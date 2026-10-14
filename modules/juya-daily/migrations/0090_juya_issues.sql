-- 橘鸦AI早报的每一期：期号、整期页面、发布时间和它自己的条数（modules/juya-daily）。
CREATE TABLE IF NOT EXISTS juya_issues (
  issue_date   date PRIMARY KEY,
  url          text NOT NULL,
  published_at timestamptz NOT NULL,
  item_count   integer NOT NULL
);