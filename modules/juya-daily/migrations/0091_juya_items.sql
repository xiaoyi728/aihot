-- 一期里的每一条新闻：分类、中文标题、原文链接、摘要和正文，以及它进站后成为的那条资料。
-- 同一期里同一个原文只留一条（unique），条目按 seq 读出，不做事件去重（modules/juya-daily）。
CREATE TABLE IF NOT EXISTS juya_items (
  id         bigserial PRIMARY KEY,
  issue_date date NOT NULL REFERENCES juya_issues (issue_date) ON DELETE CASCADE,
  seq        integer NOT NULL,
  category   text,
  title      text NOT NULL,
  url        text NOT NULL,
  summary    text NOT NULL DEFAULT '',
  body       text NOT NULL DEFAULT '',
  article_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (issue_date, url)
);