// 模块的页面和后端之间约定的一份数据形状。后端按它返回（collect.ts），网页按它读（page.tsx、list.tsx）。
export interface JuyaItemView {
  seq: number;
  category: string | null;
  title: string;
  /** 原文链接：这条新闻真正的出处。 */
  url: string;
  summary: string;
  body: string;
  /** 它进站后成为的那条资料（/items/<id>）。 */
  articleId: string | null;
  /** 站内是否已经公开收录（判重后可能早被别的信源收过）。 */
  inSite: boolean;
}

export interface JuyaIssueView {
  date: string;
  url: string;
  publishedAt: string;
  items: JuyaItemView[];
}

export interface JuyaIssueSummary {
  date: string;
  url: string;
  publishedAt: string;
  itemCount: number;
}

export const SOURCE_LABEL = "橘鸦AI日报";

/** 正文里的中文字数，用来在列表里说清这一条有多少可读的内容。 */
export function bodyLength(body: string): number {
  return body.replace(/\s/g, "").length;
}