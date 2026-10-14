// 橘鸦AI早报这个模块的后端：一个把新一期拆开推进站里的定时任务，两个给网页读的地址，以及
// 「订阅停了」的提醒。地址见 module.ts（apiPaths），定时任务由 worker 注册（apps/worker/src/schedules.ts）。
import type { ServerModule } from "@aihot/backend/modules";
import type { Finding } from "@aihot/backend/notify/feishu";
import { sql } from "@aihot/backend/db";
import { collectJuyaDaily, juyaIssue, juyaIssues, SOURCE_ID } from "./collect.ts";

/** 站点通常在 09:30 前后更新（北京时间），这个时段里每十分钟问一次订阅，没更新就只花一个 304。 */
const POLL_CRON = "*/10 8-13 * * *";
/** 超过这么久还没有新一期，就是订阅停了或者抓不动了，运营方该知道。 */
const STALE_HOURS = 36;

const DATE = /^\d{4}-\d{2}-\d{2}$/;

export default {
  name: "juya-daily",

  http(app) {
    app.get("/api/juya/issues", async (_req, reply) => {
      reply.header("Cache-Control", "public, max-age=300");
      return { issues: await juyaIssues() };
    });
    // 最新一期，给日报页顶部的区块用；还没有期数时是 null，页面不画那一块。
    app.get("/api/juya/issue", async (_req, reply) => {
      reply.header("Cache-Control", "public, max-age=300");
      return { issue: await juyaIssue() };
    });
    app.get("/api/juya/issue/:date", async (req, reply) => {
      const date = String((req.params as { date?: string }).date ?? "");
      if (!DATE.test(date)) return reply.code(400).send({ error: "bad issue date" });
      const issue = await juyaIssue(date);
      if (!issue) return reply.code(404).send({ error: "no such issue" });
      reply.header("Cache-Control", "public, max-age=300");
      return { issue };
    });
  },

  schedules: [
    {
      name: "juya-daily.collect",
      cron: POLL_CRON,
      missed: "once",
      run: collectJuyaDaily,
      // 和其他采集一样：采集关掉时这个任务也不跑。
      when: () => process.env.COLLECT_ENABLED === "true",
    },
  ],

  async alerts(now: number): Promise<Finding[]> {
    const [row] = await sql<{ newest: Date | null }[]>`SELECT max(published_at) AS newest FROM juya_issues`;
    const [last] = await sql<{ started_at: Date }[]>`
      SELECT started_at FROM job_runs WHERE job = 'cron.juya-daily.collect' ORDER BY started_at DESC LIMIT 1`;
    if (!row?.newest) {
      // 装上了却一条也没读进来：订阅读不到，或定时任务从没跑过。
      return !last || now - last.started_at.getTime() > 24 * 3600_000
        ? [stale("橘鸦AI早报一条都没读进来", "日报页顶部那一块和站内来自它的条目都是空的", "先看模块的定时任务有没有在跑，再确认订阅地址还读得到")]
        : [];
    }
    return (now - row.newest.getTime()) / 3600_000 > STALE_HOURS
      ? [stale("橘鸦AI早报一天多没有新一期了", "日报页顶部那一块停在上一次的一期", `信源 ${SOURCE_ID}：对方可能改了订阅结构，或者抓取连续失败`)]
      : [];
  },
} satisfies ServerModule;

function stale(title: string, impact: string, action: string): Finding {
  return { key: "juya-daily-stale", level: "today", title, impact, heals: "不会自己好：对方改了订阅结构时要改模块的解析", action };
}