export type SelectionGoldDecision = "select" | "reject" | "either";
export type SelectionDecision = "select" | "reject";

export interface SelectionGoldRow {
  caseId: string;
  material: { title: string; originalTitle: string | null; publishedAt: string | null; sourceName: string; bodyZh: string | null; bodyOriginal: string | null };
  sourceFacts: { sourceKind: string; sourceTier?: string; firstParty?: boolean; language?: string | null };
  samplingContext?: { benchmarkSplit?: string; samplingStratum?: string };
  gold: { decision: SelectionGoldDecision };
}

/** Validate the entire gold set before filtering or sending any model requests. */
export function parseSelectionGoldJsonl(text: string): SelectionGoldRow[] {
  const rows: SelectionGoldRow[] = [];
  const ids = new Set<string>();
  for (const [index, raw] of text.split(/\r?\n/).entries()) {
    const line = index + 1;
    if (!raw.trim() || raw.trim().startsWith("//")) continue;
    const fail = (message: string): never => { throw new Error(`line ${line}: ${message}`); };
    const record = (value: unknown, field: string): Record<string, unknown> => {
      if (!value || typeof value !== "object" || Array.isArray(value)) return fail(`${field} must be an object`);
      return value as Record<string, unknown>;
    };
    const string = (obj: Record<string, unknown>, key: string): string => {
      if (typeof obj[key] !== "string" || !obj[key].trim()) return fail(`${key} must be a non-empty string`);
      return obj[key];
    };
    const nullable = (obj: Record<string, unknown>, key: string): string | null => {
      if (obj[key] === undefined || obj[key] === null) return null;
      if (typeof obj[key] !== "string") return fail(`${key} must be a string or null`);
      return obj[key];
    };
    let value: unknown;
    try { value = JSON.parse(raw); } catch { fail("invalid JSON"); }
    const obj = record(value, "row");
    const caseId = string(obj, "caseId");
    if (ids.has(caseId)) fail(`duplicate caseId ${caseId}`);
    ids.add(caseId);
    const material = record(obj.material, "material");
    const facts = record(obj.sourceFacts, "sourceFacts");
    const gold = record(obj.gold, "gold");
    if (!["select", "reject", "either"].includes(gold.decision as string)) fail("gold.decision must be select, reject or either");
    const publishedAt = nullable(material, "publishedAt");
    if (publishedAt && Number.isNaN(new Date(publishedAt).getTime())) fail("publishedAt is not a valid date");
    if (facts.firstParty !== undefined && typeof facts.firstParty !== "boolean") fail("firstParty must be a boolean");
    const sampling = obj.samplingContext === undefined ? undefined : record(obj.samplingContext, "samplingContext");
    rows.push({
      caseId,
      material: { title: string(material, "title"), sourceName: string(material, "sourceName"), originalTitle: nullable(material, "originalTitle"), publishedAt, bodyZh: nullable(material, "bodyZh"), bodyOriginal: nullable(material, "bodyOriginal") },
      sourceFacts: { sourceKind: string(facts, "sourceKind"), sourceTier: nullable(facts, "sourceTier") ?? undefined, firstParty: facts.firstParty as boolean | undefined, language: nullable(facts, "language") },
      ...(sampling ? { samplingContext: { benchmarkSplit: nullable(sampling, "benchmarkSplit") ?? undefined, samplingStratum: nullable(sampling, "samplingStratum") ?? undefined } } : {}),
      gold: { decision: gold.decision as SelectionGoldDecision },
    });
  }
  return rows;
}

export function selectionGoldPool(rows: SelectionGoldRow[], split: string): SelectionGoldRow[] {
  const pool = split === "all" ? rows : rows.filter(r => r.samplingContext?.benchmarkSplit === split);
  if (!pool.length) throw new Error(`no gold cases for split ${split}`);
  return pool;
}

export interface SelectionMetricCase {
  gold: SelectionGoldDecision;
  decision: SelectionDecision | null;
}

export interface SelectionThresholdCase {
  gold: SelectionGoldDecision;
  available: boolean;
  relevance: string | null;
  score: number | null;
}

function round(value: number): number {
  return +value.toFixed(3);
}

/**
 * Selection quality has two denominators:
 * - valid-output metrics describe decisions the pipeline actually returned;
 * - coverage / completeAccuracy charge failures against every decisive gold case.
 * Gold "either" cases are excluded from both denominators, but their failures remain observable.
 */
export function selectionMetrics(cases: SelectionMetricCase[]) {
  let tp = 0, fp = 0, fn = 0, tn = 0;
  let decisiveGold = 0, either = 0, errors = 0, decisiveErrors = 0, eitherErrors = 0;
  let goldSelect = 0;

  for (const row of cases) {
    if (row.gold === "either") {
      either++;
      if (row.decision === null) {
        errors++;
        eitherErrors++;
      }
      continue;
    }

    decisiveGold++;
    if (row.gold === "select") goldSelect++;
    if (row.decision === null) {
      errors++;
      decisiveErrors++;
      continue;
    }

    if (row.decision === "select" && row.gold === "select") tp++;
    else if (row.decision === "select") fp++;
    else if (row.gold === "select") fn++;
    else tn++;
  }

  const decisive = tp + fp + fn + tn;
  const correct = tp + tn;
  const precision = tp / Math.max(1, tp + fp);
  const recall = tp / Math.max(1, tp + fn);
  const f1 = (2 * precision * recall) / Math.max(1e-9, precision + recall);

  return {
    n: cases.length,
    decisiveGold,
    decisive,
    either,
    errors,
    decisiveErrors,
    eitherErrors,
    tp,
    fp,
    fn,
    tn,
    coverage: round(decisive / Math.max(1, decisiveGold)),
    accuracy: round(correct / Math.max(1, decisive)),
    completeAccuracy: round(correct / Math.max(1, decisiveGold)),
    precision: round(precision),
    recall: round(recall),
    f1: round(f1),
    selectedRate: round((tp + fp) / Math.max(1, decisive)),
    // A property of the labelled decisive set, not of whichever cases a model happened to answer.
    goldSelectRate: round(goldSelect / Math.max(1, decisiveGold)),
  };
}

export function selectionThresholdMetrics(cases: SelectionThresholdCase[], threshold: number) {
  const metrics = selectionMetrics(cases.map((row) => ({
    gold: row.gold,
    decision: row.available
      ? (row.relevance === "pass" && row.score !== null && row.score >= threshold ? "select" : "reject")
      : null,
  })));
  return {
    t: threshold,
    acc: metrics.accuracy,
    completeAcc: metrics.completeAccuracy,
    coverage: metrics.coverage,
    P: metrics.precision,
    R: metrics.recall,
    F1: metrics.f1,
    sel: metrics.selectedRate,
    decisive: metrics.decisive,
    decisiveGold: metrics.decisiveGold,
    decisiveErrors: metrics.decisiveErrors,
  };
}
