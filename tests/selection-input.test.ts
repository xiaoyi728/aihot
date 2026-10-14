// Invalid gold must fail before model requests; invalid reports must not leave partial imports.
import "./setup.ts";
import assert from "node:assert/strict";
import { after, test } from "node:test";
import { execFileSync } from "node:child_process";
import { writeFileSync, unlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { sql, closeDb } from "@aihot/backend/db";
import { importSelectBenchRun, selectBenchRun } from "@aihot/backend/admin/selectbench";
import { parseSelectionGoldJsonl, selectionGoldPool } from "../scripts/eval-selection-core.ts";

after(closeDb);
const row = { caseId: "a", material: { title: "title", sourceName: "source", originalTitle: null, publishedAt: null, bodyZh: null, bodyOriginal: "body" }, sourceFacts: { sourceKind: "rss" }, samplingContext: { benchmarkSplit: "development" }, gold: { decision: "select" } };
const text = (value: unknown) => JSON.stringify(value);

test("valid gold preserves comments, split and optional material", () => {
  const rows = parseSelectionGoldJsonl(`// comment\n\n${text(row)}\n${text({ ...row, caseId: "b", samplingContext: { benchmarkSplit: "holdout" }, gold: { decision: "either" } })}`);
  assert.equal(rows.length, 2);
  assert.equal(selectionGoldPool(rows, "development")[0]!.caseId, "a");
  assert.equal(selectionGoldPool(rows, "holdout")[0]!.caseId, "b");
  assert.equal(selectionGoldPool(rows, "all").length, 2);
  assert.throws(() => selectionGoldPool(rows, "missing"), /no gold cases/);
});

test("invalid gold is rejected with physical line numbers", () => {
  for (const invalid of [{ ...row, caseId: " " }, { ...row, gold: { decision: "maybe" } }, { ...row, material: {} }, { ...row, sourceFacts: null }]) {
    assert.throws(() => parseSelectionGoldJsonl(`// comment\n\n${text(invalid)}`), /line 3:/);
  }
  assert.throws(() => parseSelectionGoldJsonl(`${text(row)}\n${text(row)}`), /line 2: duplicate caseId/);
  assert.throws(() => parseSelectionGoldJsonl("\n{broken"), /line 2: invalid JSON/);
});

test("CLI rejects invalid gold and empty splits before connecting to model or database", () => {
  const file = path.join(tmpdir(), "selection-invalid.jsonl");
  try {
    for (const [input, split, error] of [[text({ ...row, gold: { decision: "maybe" } }), "all", /gold.decision/], [text(row), "holdout", /no gold cases/]] as const) {
      writeFileSync(file, input);
      assert.throws(() => execFileSync(process.execPath, ["scripts/eval-selection.ts", "--gold", file, "--split", split, "--models", "default", "--no-import"], { env: { ...process.env, MODEL_CALLS_ENABLED: "false", DATABASE_URL: "postgres://invalid@127.0.0.1:1/unreachable_test" }, stdio: "pipe" }), (e: unknown) => error.test(String((e as { stderr: Buffer }).stderr)));
    }
  } finally { unlinkSync(file); }
});

const evidence = { caseId: "a", title: "title", gold: "select", decision: "select" };
test("invalid uploaded evidence is rejected before any run is inserted", async () => {
  const before = (await sql`SELECT count(*)::int AS n FROM selectbench_runs`)[0]!.n;
  for (const cases of [[evidence, evidence], [{ ...evidence, gold: "maybe" }], [{ ...evidence, caseId: " " }]]) {
    await assert.rejects(importSelectBenchRun({ models: { good: { summary: {}, cases: [evidence] }, bad: { summary: {}, cases } } }, "invalid", "test"), /duplicate caseId|invalid gold|caseId must/);
    assert.equal((await sql`SELECT count(*)::int AS n FROM selectbench_runs`)[0]!.n, before);
  }
});

test("valid multi-model and summary-only reports remain supported", async () => {
  const { id } = await importSelectBenchRun({ meta: { n: 1 }, models: { a: { summary: {}, cases: [evidence] }, b: { summary: {}, cases: [{ ...evidence, decision: "reject" }] } } }, "valid", "test");
  const result = await selectBenchRun(id, {});
  assert.equal(result!.rows.length, 1);
  assert.deepEqual(Object.keys(result!.rows[0]!.by_model).sort(), ["a", "b"]);
  const summary = await importSelectBenchRun({ models: { a: { summary: {} } } }, "summary", "test");
  assert.equal((await selectBenchRun(summary.id, {}))!.rows.length, 0);
});
