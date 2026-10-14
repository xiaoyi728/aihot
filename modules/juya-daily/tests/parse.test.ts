// 橘鸦AI早报的解析：拿真实订阅的样本（tests/fixtures/）跑，不访问网络。
// 样本是 2026-10-14 那一期的原文，结构与线上一致，所以对方改版时这里会先红。
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { parseFeed, parseIssue, MAX_ITEMS } from "../parse.ts";

const here = path.dirname(fileURLToPath(import.meta.url));
const fixture = (name: string) => readFileSync(path.join(here, "fixtures", name), "utf8");

test("订阅：一期一条，新的在前，没有整期正文的那条只剩摘要", () => {
  const issues = parseFeed(fixture("feed.xml"));
  assert.equal(issues.length, 2);
  assert.deepEqual(issues.map((i) => i.date), ["2026-10-14", "2026-10-13"]);
  assert.equal(issues[0]!.url, "https://daily.juya.uk/issues/2026-10-14/");
  assert.equal(issues[0]!.publishedAt, "2026-10-14T01:33:20.000Z");
  assert.ok(issues[0]!.content.includes("<h3 id=\"s10\">"));
  // 第二条在样本里被去掉了 content:encoded，只剩 description：它没有可拆的正文。
  assert.deepEqual(parseIssue(issues[1]!).items, []);
});

test("一期 2026-10-14：27 条，每条有自己的分类、原文链接、摘要和正文", () => {
  const issue = parseIssue(parseFeed(fixture("feed.xml"))[0]!);
  assert.equal(issue.items.length, 27);

  const [first] = issue.items;
  assert.equal(first!.seq, 1);
  assert.equal(first!.category, "要闻");
  assert.equal(first!.title, "Google 全球开放 Gemini 4 Argon");
  assert.equal(first!.url, "https://deepmind.google/blog/introducing-gemini-4-argon/");
  assert.ok(first!.summary.startsWith("Google 已向全球开放 Gemini 4 Argon 模型。"));
  assert.ok(first!.body.includes("API 优惠价为每 100 万输入、输出 token 2 美元和 10 美元"));
  // 「相关链接」那一段不进正文：原文链接已经是条目自己的地址。
  assert.ok(!first!.body.includes("相关链接"));
  // 图片那一段是空的，去掉。
  assert.ok(!first!.body.includes("m001_"));

  const last = issue.items.at(-1)!;
  assert.equal(last.seq, 27);
  assert.equal(last.category, "前瞻与传闻");
  assert.equal(last.title, "报道称字节 Seed 将成立安全与对齐部门");

  // 概览区的小节标题没有原文链接，不算新闻；正文的每一条都按页面的顺序编号。
  assert.deepEqual(
    issue.items.filter((i) => i.category === "行业动态").map((i) => i.seq),
    [20, 21, 22, 23, 24, 25],
  );
  assert.deepEqual([...new Set(issue.items.map((i) => i.seq))], issue.items.map((_, index) => index + 1));
});

test("摘样本：概览被跳过，正文区的三条按自己的分类分组", () => {
  const issue = parseIssue({
    date: "2026-10-14",
    url: "https://daily.juya.uk/issues/2026-10-14/",
    publishedAt: "2026-10-14T01:33:20.000Z",
    content: fixture("issue-2026-10-14.html"),
  });
  assert.deepEqual(issue.items.map((i) => [i.seq, i.category, i.title]), [
    [1, "要闻", "Google 全球开放 Gemini 4 Argon"],
    [2, "要闻", "OpenAI 优化 ChatGPT 桌面应用存储占用"],
    [3, "模型发布", "Cat Jam 匿名编程模型免费上线 OpenCode"],
  ]);
  assert.equal(issue.items[1]!.url, "https://x.com/thsottiaux/status/2110151780478927344");
  assert.ok(issue.items[2]!.body.length > 80);
});

test("空页面和没有外链的标题都拆不出条目", () => {
  const empty = { date: "2026-10-14", url: "https://daily.juya.uk/issues/2026-10-14/", publishedAt: "2026-10-14T01:33:20.000Z" };
  assert.deepEqual(parseIssue({ ...empty, content: "<div><p>今天没有内容</p></div>" }).items, []);
  assert.throws(() => parseFeed("<html><body>不是订阅</body></html>"), /no channel/);
});

test("一期最多 MAX_ITEMS 条", () => {
  const many = Array.from({ length: MAX_ITEMS + 5 }, (_, i) =>
    `<h3 id="s${i}"><a href="https://example.com/${i}">第 ${i} 条</a></h3><p>正文</p>`).join("");
  assert.equal(parseIssue({ date: "2026-10-14", url: "https://daily.juya.uk/issues/2026-10-14/", publishedAt: "2026-10-14T01:33:20.000Z", content: many }).items.length, MAX_ITEMS);
});