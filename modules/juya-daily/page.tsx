// /juya：某一期橘鸦早报的全部条目。/juya 不带期号时是最新一期，/juya/2026-10-14 是那一期。
// 这里是模块自己的页面。日报页上出现的每一条都和其他信源一样过了同一套评分与编排，这个模块不改它。
import { Link, useLoaderData } from "react-router";
import { AsideCard, EmptyState, ReadingLayout } from "../../apps/web/app/components/ui/Page";
import type { Screen } from "../../apps/web/app/components/shell/screens";
import { apiGet } from "../../apps/web/app/lib/api.server";
import { pageMeta } from "../../apps/web/app/lib/seo";
import { JuyaIssueHeader, JuyaItemList } from "./list.tsx";
import { SOURCE_LABEL, type JuyaIssueSummary, type JuyaIssueView } from "./view.ts";

export const handle: Screen = { tab: "daily", name: SOURCE_LABEL };

interface LoaderData {
  issue: JuyaIssueView | null;
  issues: JuyaIssueSummary[];
  date: string | null;
}

export async function loader({ params, request }: { params: { date?: string }; request: Request }): Promise<LoaderData> {
  const date = params.date ?? null;
  const { issues } = await apiGet<{ issues: JuyaIssueSummary[] }>("/api/juya/issues", { signal: request.signal });
  // 没有这一期就是一个 404，不是一个报错的页面。
  if (date && !issues.some((entry) => entry.date === date)) throw new Response("no such issue", { status: 404 });
  const { issue } = await apiGet<{ issue: JuyaIssueView | null }>(date ? `/api/juya/issue/${date}` : "/api/juya/issue", { signal: request.signal });
  return { issue, issues, date };
}

export function meta({ loaderData, location }: { loaderData?: LoaderData; location: { pathname: string } }) {
  const issue = loaderData?.issue;
  return pageMeta({
    title: issue ? `${SOURCE_LABEL} ${issue.date}` : SOURCE_LABEL,
    description: `${SOURCE_LABEL}每一期的全部条目：中文标题、原文链接和中文正文，按它自己的分类列出，不做去重。`,
    path: location.pathname,
  });
}

export default function JuyaPage() {
  const { issue, issues } = useLoaderData() as LoaderData;
  if (!issue) {
    return (
      <ReadingLayout>
        <EmptyState title={`还没有${SOURCE_LABEL}`}>模块读到新一期之后，这里按期列出它的全部条目。</EmptyState>
      </ReadingLayout>
    );
  }
  return (
    <ReadingLayout
      aside={
        <AsideCard title="往期">
          {issues.length === 0 ? (
            <p className="text-[13px] text-ink-4">还没有别的期数。</p>
          ) : (
            <ul className="space-y-1.5">
              {issues.map((entry) => (
                <li key={entry.date} className="flex items-baseline justify-between gap-3 text-[13px]">
                  {entry.date === issue.date ? (
                    <span className="num font-medium text-ink">{entry.date}</span>
                  ) : (
                    <Link to={`/juya/${entry.date}`} className="num text-ink-2 hover:text-accent">
                      {entry.date}
                    </Link>
                  )}
                  <span className="num shrink-0 text-[12px] text-ink-4">{entry.itemCount} 条</span>
                </li>
              ))}
            </ul>
          )}
        </AsideCard>
      }
    >
      <div className="pt-4">
        <JuyaIssueHeader issue={issue} />
        <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-4">
          这一期的每一条都列在这里，包括站内别处已经报过同一件事的那些。标题和正文是橘鸦的中文版本，链接指向原文。
        </p>
        <div className="mt-4">
          <JuyaItemList issue={issue} />
        </div>
      </div>
    </ReadingLayout>
  );
}