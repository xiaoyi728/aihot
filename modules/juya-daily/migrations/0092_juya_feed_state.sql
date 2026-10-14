-- 订阅的读取状态：ETag 让没出新一期的那次轮询只花一个 304，不重复下载整份订阅（modules/juya-daily）。
CREATE TABLE IF NOT EXISTS juya_feed_state (
  id           integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  etag         text,
  checked_at   timestamptz NOT NULL DEFAULT now()
);