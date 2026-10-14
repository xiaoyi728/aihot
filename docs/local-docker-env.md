# 本机 Docker 环境的已知问题

这台机器用 `docker compose` 跑着一套站点（`aihot-db-1`、`aihot-web-1`、`aihot-worker-1`、`aihot-api-1`）。
在上面跑测试有几处环境缺陷，**都与代码无关**，每次都会稳定复现。合并上游前后都一样，
所以看到这些失败可以直接跳过——以线上 CI 的结果为准。

判断标准很简单：**同一批用例，在合并前的提交上跑，失败完全相同，就不是回归。**

## 跑测试的方式

容器里是 Node 24，本机 shell 只有 Node 22，而 `npm test` 用到 `--test-global-setup`（Node 24 才有）。
所以后端测试要在容器里跑，并且带上开发和数据库环境变量：

```bash
PW=$(grep -E "^POSTGRES_PASSWORD" .env | cut -d= -f2)
SS=$(grep -E "^SESSION_SECRET" .env | cut -d= -f2)
docker exec -e SESSION_SECRET="$SS" -e NODE_ENV=development -e AIHOT_ENVIRONMENT=development \
  -e DATABASE_URL="postgres://aihot:${PW}@aihot-db-1:5432/aihot_test" -w /app aihot-worker-1 npm test
```

两个环境变量都必须给：

- `NODE_ENV=development` / `AIHOT_ENVIRONMENT=development`——容器默认是 `NODE_ENV=production`，
  生产环境下 `config.devAdmin` 免登录不生效，所有 `/api/admin/*` 的用例会返回 401 而不是预期的 400。
- `DATABASE_URL`——指向 `aihot_test`（名字必须以 `_test` 结尾，`setup.ts` 会拒绝其他名字）。

## 已知失败（可以跳过）

| 失败 | 原因 |
|---|---|
| `tests/mcp.standalone.test.ts`、`outlet-invariants.test.ts`、`public-categories.test.ts`，以及 6 个 MCP 子用例（`a required sample...`、`a required tool...`、`async input validation...`、`an explicit invalid sample...`、`schema-valid arguments...`、`every declared module tool...`）和 `the MCP check uses module samples...` | 容器 `node_modules` 缺 `@modelcontextprotocol/client`。`package.json` 声明了 2.2.0，本机 `npm ci` 装上了，容器镜像构建时没有 |
| `every environment variable the code reads is listed in a template, and every listed one is read` | 容器里没有 `git`，用例用 `git ls-files -- '*.env.example'` 列文件，报 `spawnSync git ENOENT` |
| `tests/migration-check.standalone.test.ts` | 同上，也是 `git` 缺失 |

共 12 个。除此之外全部通过（当前 745 个用例中 733 个）。

修容器缺依赖的办法（会改动镜像，先想清楚再做）：在镜像构建时补一次 `npm ci`，
或者给容器装上 `git`。不修也不影响线上 CI。

## 千万不要绕过 global setup 跑单文件

`tests/databases.ts` 作为 `--test-global-setup` 会清理上一次的库副本；
每个测试文件又通过 `--import` 拿到自己的一份数据库副本。直接这样跑：

```bash
docker exec ... node --test tests/xxx.test.ts     # 错
```

不会建副本，测试数据直接写进模板库 `aihot_test`。之后每一次完整跑都带着这些脏数据，
报错看起来像代码问题，其实全是污染。

已经踩过一次的后果：403 行 `deliveries`、21 个 `notify_targets`、11 行 `sources` 残留在模板库里，
导致几十个用例莫名失败（`deliverContent` 查 `notify_targets` 时不过滤 key，
残留的 target 全部参与，`requests.length` 从 1 涨到 10 以上）。

清理办法：

```bash
# 删掉上一次跑留下的库副本
docker exec -e PGPASSWORD="$PW" aihot-db-1 psql -U aihot -d postgres -Atc \
  "select format('DROP DATABASE IF EXISTS %I WITH (FORCE);', datname)
   from pg_database where datname ~ 'aihot_test_f[0-9]+_test'" \
  | docker exec -i -e PGPASSWORD="$PW" aihot-db-1 psql -U aihot -d postgres

# 模板库脏了就重建（global setup 会重新迁移）
docker exec -i -e PGPASSWORD="$PW" aihot-db-1 psql -U aihot -d postgres <<'SQL'
DROP DATABASE IF EXISTS aihot_test WITH (FORCE);
CREATE DATABASE aihot_test;
SQL
```

注意 `DROP DATABASE` 不能放在一个事务里批量执行，要一条一条来。

## 其他

- **同一命令不要并发跑。** 多个 `npm test` 同时跑会互相 `DROP DATABASE ... WITH (FORCE)`，
  留下几百个删不掉的库副本，global teardown 也收不住。
- **`docker exec` 不支持 `-v` 挂载。** 想在另一个提交上跑对比，用 `docker run --rm --network container:aihot-db-1`，
  或者老老实实 `git stash` 掉改动再跑。
- **别删容器里的 `tests/`。** 容器 `/app/tests` 是镜像里的一份，删了不会自己回来，
  要用 `docker cp tests/xxx.test.ts aihot-worker-1:/app/tests/` 拷回去。
- **Playwright 的 12 个 web 用例**（`navigation-performance.test.ts`、`native-video.test.ts`）本机也跑不了，
  缺 `libgtk-4.so.1` 等浏览器库。非浏览器的那 44 个用例正常跑：

```bash
npm run build -w @aihot/web && node --test apps/web/tests/cache.test.ts \
  apps/web/tests/request-target.test.ts apps/web/tests/session-cache.test.ts \
  apps/web/tests/admin-performance.test.ts apps/web/tests/article-outline.test.ts \
  apps/web/tests/local-state.test.ts apps/web/tests/markdown.test.ts \
  apps/web/tests/report-discovery.test.ts apps/web/tests/report-ordinals.test.ts \
  apps/web/tests/timeline-unread.test.ts
```
