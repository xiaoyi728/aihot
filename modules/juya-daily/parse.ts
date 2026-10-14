// 橘鸦AI早报的一期，在它的订阅里只是一条 item：标题只有一个日期，链接指向整期页面，正文是整期的
// HTML。这一期真正的几十条新闻只存在于那份 HTML 里，按 分类（h2）→ 条目标题（h3 里的原文链接）→
// 摘要（blockquote）→ 正文（后续段落）排列。这里把它们拆出来，和它们的原文链接一起给站里。
//
// 纯函数，不碰数据库和网络：tests/parse.test.ts 用真实订阅的样本跑它。
import * as cheerio from "cheerio";
import { XMLParser } from "fast-xml-parser";
import { collapseWhitespace } from "@aihot/backend/lib/text";

export const FEED_URL = "https://daily.juya.uk/rss.xml";
/** 一期里最多取这么多条：站点自己的上限，防止对方改版后一次塞进几百条。 */
export const MAX_ITEMS = 80;

export interface JuyaItem {
  /** 这一期里的第几条，从 1 开始，也就是页面上 #1、#2 的那个序号。 */
  seq: number;
  category: string | null;
  title: string;
  /** 原文链接：这条新闻真正的出处，不是橘鸦的页面。 */
  url: string;
  summary: string;
  body: string;
}

export interface JuyaIssue {
  date: string;
  url: string;
  publishedAt: string;
  items: JuyaItem[];
}

/** 订阅里的一期：日期、整期页面、发布时间，以及整期的 HTML。 */
export interface JuyaFeedIssue {
  date: string;
  url: string;
  publishedAt: string;
  content: string;
}

const parser = new XMLParser({ ignoreAttributes: true, trimValues: true, parseTagValue: false });

/** fast-xml-parser 把带属性的标签读成对象，纯文本标签读成字符串。 */
function textOf(value: unknown): string {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && "#text" in value) return String((value as { "#text": unknown })["#text"]);
  return "";
}

function listOf<T>(value: T | T[] | undefined): T[] {
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
}

/** 期号：订阅的条目标题就是日期；取不到就从页面地址的 /issues/YYYY-MM-DD/ 里取。 */
function dateOf(title: string, link: string): string | null {
  const iso = /^(\d{4}-\d{2}-\d{2})$/.exec(collapseWhitespace(title));
  if (iso) return iso[1]!;
  return /\/issues\/(\d{4}-\d{2}-\d{2})\/?$/.exec(link)?.[1] ?? null;
}

/** 订阅里的每一期，新的在前。日期或地址读不出来、发布时间不是有效时间的，跳过。 */
export function parseFeed(xml: string): JuyaFeedIssue[] {
  const channel = parser.parse(xml)?.rss?.channel;
  if (!channel) throw new Error("juya feed: no channel");
  const issues: JuyaFeedIssue[] = [];
  for (const item of listOf(channel.item)) {
    const url = collapseWhitespace(textOf(item?.link));
    const date = dateOf(textOf(item?.title), url);
    const published = new Date(collapseWhitespace(textOf(item?.pubDate)));
    const content = textOf(item?.["content:encoded"]) || textOf(item?.description);
    if (!date || !url || !Number.isFinite(published.getTime()) || !content) continue;
    issues.push({ date, url, publishedAt: published.toISOString(), content });
  }
  return issues.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

/** 只留正文里的文字：图片和「相关链接」这一段不进正文（原文链接已经是条目自己的地址）。 */
function paragraph(node: { text(): string }): string {
  return collapseWhitespace(node.text());
}

/**
 * 一期的 HTML → 它自己的那几十条。概览区的小节标题（h3）里没有原文链接，跳过；正文区每个带外链的
 * h3 是一条新闻，它后面的兄弟节点直到下一个小标题，就是这条的摘要和正文。同一原文只留第一条。
 */
export function parseIssue(feed: JuyaFeedIssue): JuyaIssue {
  const $ = cheerio.load(feed.content, null, false);
  const items: JuyaItem[] = [];
  const seen = new Set<string>();
  let category: string | null = null;

  $("h2, h3").each((_, element) => {
    const node = $(element);
    if (element.tagName === "h2") {
      category = paragraph(node) || category;
      return;
    }
    const link = node.children("a").toArray().map((a) => $(a)).find((a) => /^https?:\/\//i.test(a.attr("href") ?? ""));
    if (!link) return; // 概览的小节标题，不是新闻
    const title = paragraph(link);
    const url = collapseWhitespace(link.attr("href") ?? "");
    if (!title || !url || seen.has(url) || items.length >= MAX_ITEMS) return;
    seen.add(url);
    const summary: string[] = [];
    const body: string[] = [];
    node.nextUntil("h2, h3").each((__, sibling) => {
      const part = $(sibling);
      const text = paragraph(part);
      if (!text) return; // 只有图片的段落
      if (sibling.tagName === "blockquote") summary.push(text);
      else if (!/^相关链接[:：]/.test(text)) body.push(text);
    });
    items.push({ seq: items.length + 1, category, title, url, summary: collapseWhitespace(summary.join(" ")), body: body.join("\n") });
  });

  return { date: feed.date, url: feed.url, publishedAt: feed.publishedAt, items };
}