// 一期橘鸦早报的全部条目：按它自己的分类分组，一条不落，也不做事件去重——别的信源报过同一件事，
// 这里照样列出橘鸦这一条。日报页顶部和 /juya 页面画的是同一份。
import { Link } from "react-router";
import { bodyLength, SOURCE_LABEL, type JuyaItemView, type JuyaIssueView } from "./view.ts";

/** 站内的链接：这条进站后成为的那条资料；还没收录就不给链接。 */
function SiteEntry({ item }: { item: JuyaItemView }) {
  if (!item.articleId || !item.inSite) {
    return <span className="text-ink-4">未收录</span>;
  }
  return (
    <Link to={`/items/${item.articleId}`} className="font-medium text-accent hover:underline">
      站内条目
    </Link>
  );
}

function Item({ item }: { item: JuyaItemView }) {
  const chars = bodyLength(item.body);
  return (
    <li className="border-t border-line py-3.5 first:border-t-0">
      <div className="flex items-baseline gap-2">
        <span className="num shrink-0 text-[12px] text-ink-4">#{item.seq}</span>
        <a href={item.url} target="_blank" rel="noreferrer noopener" className="font-medium leading-snug hover:text-accent">
          {item.title}
        </a>
      </div>
      {item.summary && <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-ink-3">{item.summary}</p>}
      <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11.5px] text-ink-4">
        <span className="num">{chars} 字</span>
        <a href={item.url} target="_blank" rel="noreferrer noopener" className="hover:text-accent">
          原文
        </a>
        <SiteEntry item={item} />
      </div>
    </li>
  );
}

/** 按分类分组，保持一期里的先后；没有分类的排在最后（source: 前缀让 sort 稳定）。 */
function groups(items: JuyaItemView[]): Array<{ category: string; items: JuyaItemView[] }> {
  const order: string[] = [];
  const byCategory = new Map<string, JuyaItemView[]>();
  for (const item of items) {
    const key = item.category ?? "其他";
    if (!byCategory.has(key)) {
      byCategory.set(key, []);
      order.push(key);
    }
    byCategory.get(key)!.push(item);
  }
  return order.map((category) => ({ category, items: byCategory.get(category)! }));
}

export function JuyaItemList({ issue }: { issue: JuyaIssueView }) {
  return (
    <div>
      {groups(issue.items).map((group) => (
        <section key={group.category} className="mb-6 last:mb-0">
          <h3 className="mb-1 text-[13px] font-semibold text-ink-2">{group.category}</h3>
          <ul>
            {group.items.map((item) => (
              <Item key={item.seq} item={item} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

/** 区块的抬头：来源、期号、条数，和那一期的原文页。 */
export function JuyaIssueHeader({ issue, href }: { issue: JuyaIssueView; href?: string }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
      <h2 className="text-[15px] font-semibold text-ink">
        {SOURCE_LABEL}
        <span className="num ml-2 text-[13px] font-normal text-ink-3">{issue.date}</span>
        <span className="ml-2 text-[12px] font-normal text-ink-4">{issue.items.length} 条全部内容</span>
      </h2>
      <div className="flex items-center gap-3 text-[12px] text-ink-4">
        {href && <Link to={href} className="hover:text-accent">往期</Link>}
        <a href={issue.url} target="_blank" rel="noreferrer noopener" className="hover:text-accent">
          橘鸦原文
        </a>
      </div>
    </div>
  );
}