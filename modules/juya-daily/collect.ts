// 橘鸦AI早报的读取与入库。
//
// 一期只当一条收进来没有意义（它是多事件打包，评分提示词把它压在门槛之下，进不了精选和日报），
// 所以这里把一期拆成它自己的那几十条，用**原文链接**作为资料的地址：和其他信源判重，读者点得进
// 原文，官方源也在场时由官方那篇出面。橘鸦自己的中文标题和正文一起入库，模块自己的页面按期逐条
// 列出全部内容（不去重），所以无论精选怎么判，橘鸦这一期的每一条都在站内读得到。
import { upsertMaterial } from "@aihot/backend/content/materials";
import { sql } from "@aihot/backend/db";
import { queueProcessing } from "@aihot/backend/jobs/content";
import { guardedFetch } from "@aihot/backend/lib/http-fetch";
import { FEED_URL, parseFeed, parseIssue, type JuyaIssue, type JuyaItem } from "./parse.ts";
import type { JuyaIssueSummary, JuyaIssueView } from "./view.ts";

/** 这些条目在站里的信源：它只接推送，不主动抓（kind=external），因此不参与热度里的「信源落后」判断。 */
export const SOURCE_ID = "juya-daily";
const SOURCE_NAME = "橘鸦AI日报";

/** 第一次运行时只导入最新一期：更早的期数是回灌，会刷屏并花钱，而读者要的是当天那期。 */
const FIRST_RUN_ISSUES = 1;
/** 一期的发布时间就是它每一条新闻的时间：那一页上没有别的日期。 */
const FEED_TIMEOUT_MS = 30_000;

export type { JuyaIssueSummary, JuyaIssueView, JuyaItemView } from "./view.ts";

async function ensureSource(): Promise<void> {
  await sql`
    INSERT INTO sources (id, name, kind, config, tier, first_party, participation_mode, interval_minutes,
      tags, site_fulltext, syndicate_fulltext, enabled, health, next_fetch_at)
    VALUES (${SOURCE_ID}, ${SOURCE_NAME}, 'external', '{}'::jsonb, 'T2', false, 'editorial', 1440,
      ARRAY['媒体', '中文', '聚合'], false, false, true, 'ok', now())
    ON CONFLICT (id) DO NOTHING`;
}

async function feedEtag(): Promise<string | null> {
  const [row] = await sql<{ etag: string | null }[]>`SELECT etag FROM juya_feed_state WHERE id = 1`;
  return row?.etag ?? null;
}

async function rememberEtag(etag: string | null): Promise<void> {
  await sql`
    INSERT INTO juya_feed_state (id, etag) VALUES (1, ${etag})
    ON CONFLICT (id) DO UPDATE SET etag = ${etag}, checked_at = now()`;
}

/** 存一期，并把它的每一条推进正常的流水线（判重、评分、归组）。返回需要处理的新资料。 */
async function storeIssue(issue: JuyaIssue): Promise<{ items: number; queued: string[] }> {
  const publishedAt = new Date(issue.publishedAt);
  const queued = await sql.begin(async (tx) => {
    await tx`
      INSERT INTO juya_issues (issue_date, url, published_at, item_count) VALUES (${issue.date}, ${issue.url}, ${publishedAt}, ${issue.items.length})
      ON CONFLICT (issue_date) DO NOTHING`;
    const pending: string[] = [];
    for (const item of issue.items) {
      const res = await upsertMaterial({
        sourceId: SOURCE_ID,
        url: item.url,
        title: item.title,
        language: "zh",
        publishedAt,
        excerpt: item.summary || null,
        bodyText: item.body,
        bodyStatus: "ok",
        raw: { juya: { issue: issue.date, seq: item.seq, category: item.category } },
        via: "module:juya-daily",
      }, tx as Parameters<typeof upsertMaterial>[1]);
      await tx`
        INSERT INTO juya_items (issue_date, seq, category, title, url, summary, body, article_id)
        VALUES (${issue.date}, ${item.seq}, ${item.category}, ${item.title}, ${item.url}, ${item.summary}, ${item.body}, ${res.articleId})
        ON CONFLICT (issue_date, url) DO UPDATE SET article_id = ${res.articleId}, body = EXCLUDED.body, summary = EXCLUDED.summary`;
      if (res.created || res.revised || res.processingNeeded) pending.push(res.articleId);
    }
    return pending;
  });
  // 队列在事务提交之后才入（jobs/content.ts queueProcessing）。
  for (const articleId of queued) await queueProcessing(articleId);
  return { items: issue.items.length, queued };
}

export interface CollectResult {
  /** 这一轮读到的、还没有入库的期数。 */
  issues: number;
  items: number;
  /** 没有新一期的常见情形：订阅没变（304），或最新一期已经在库里。 */
  status: "imported" | "unchanged";
}

/**
 * 读一次订阅，导入还没有的期。站点通常每天 09:30 前后更新（北京时间），所以定时任务在那个时段里
 * 每十分钟问一次：订阅用 ETag，没出新一期时对方只回一个 304，不重复下载整份（每份约 0.5 MB）。
 */
export async function collectJuyaDaily(): Promise<CollectResult> {
  await ensureSource();
  const etag = await feedEtag();
  const res = await guardedFetch(FEED_URL, {
    headers: etag ? { "if-none-match": etag } : {},
    timeoutMs: FEED_TIMEOUT_MS,
  });
  if (res.status === 304) return { issues: 0, items: 0, status: "unchanged" };
  if (res.status !== 200) throw new Error(`juya feed answered ${res.status}`);

  const feed = parseFeed(res.text());
  await rememberEtag(res.headers.get("etag"));
  if (feed.length === 0) return { issues: 0, items: 0, status: "unchanged" };

  const [known] = await sql<{ newest: Date | null; total: number }[]>`
    SELECT max(published_at) AS newest, count(*)::int AS total FROM juya_issues`;
  const fresh = feed.filter((issue) => !known?.newest || new Date(issue.publishedAt) > known.newest);
  const take = known?.total ? fresh : fresh.slice(0, FIRST_RUN_ISSUES);
  if (take.length === 0) return { issues: 0, items: 0, status: "unchanged" };

  let items = 0;
  for (const issue of take) items += (await storeIssue(parseIssue(issue))).items;
  return { issues: take.length, items, status: "imported" };
}

interface ItemRow {
  seq: number;
  category: string | null;
  title: string;
  url: string;
  summary: string;
  body: string;
  article_id: string | null;
  listed: boolean | null;
}

async function readIssue(date: string | null): Promise<JuyaIssueView | null> {
  // date 列读成文本：期号是 YYYY-MM-DD，不是时间戳。
  const [issue] = date
    ? await sql<{ issue_date: string; url: string; published_at: Date }[]>`SELECT issue_date::text AS issue_date, url, published_at FROM juya_issues WHERE issue_date = ${date}`
    : await sql<{ issue_date: string; url: string; published_at: Date }[]>`SELECT issue_date::text AS issue_date, url, published_at FROM juya_issues ORDER BY issue_date DESC LIMIT 1`;
  if (!issue) return null;
  const rows = await sql<ItemRow[]>`
    SELECT i.seq, i.category, i.title, i.url, i.summary, i.body, i.article_id,
      (p.article_id IS NOT NULL AND coalesce(p.visibility, 'public') = 'public') AS listed
    FROM juya_items i LEFT JOIN publications p ON p.article_id = i.article_id
    WHERE i.issue_date = ${issue.issue_date} ORDER BY i.seq`;
  return {
    date: issue.issue_date,
    url: issue.url,
    publishedAt: issue.published_at.toISOString(),
    items: rows.map((row) => ({
      seq: row.seq,
      category: row.category,
      title: row.title,
      url: row.url,
      summary: row.summary,
      body: row.body,
      articleId: row.article_id,
      inSite: !!row.listed,
    })),
  };
}

/** 某一期的全部内容，按 seq；不给期号就是最新一期。模块的页面和日报页顶部的区块读它。 */
export function juyaIssue(date?: string | null): Promise<JuyaIssueView | null> {
  return readIssue(date ?? null);
}

/** 已入库的期数清单，新的在前，条目数一并给出。 */
export async function juyaIssues(limit = 60): Promise<JuyaIssueSummary[]> {
  const rows = await sql<{ issue_date: string; url: string; published_at: Date; item_count: number }[]>`
    SELECT issue_date::text AS issue_date, url, published_at, item_count FROM juya_issues ORDER BY issue_date DESC LIMIT ${limit}`;
  return rows.map((row) => ({ date: row.issue_date, url: row.url, publishedAt: row.published_at.toISOString(), itemCount: row.item_count }));
}