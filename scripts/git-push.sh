#!/usr/bin/env bash
# git 推送包装：本机到 github.com 的直连不稳定时，先试 HTTP 代理，连不上再直连。
# 用法（和 git 一样，只是前面加 scripts/）：scripts/git-push.sh [git push 的参数]
# 代理地址取环境变量 AIHOT_GIT_PROXY，默认 http://10.20.15.242:10880（本机 DSH rule-proxy 的同一个）。
set -uo pipefail

PROXY="${AIHOT_GIT_PROXY:-http://10.20.15.242:10880}"

# 代理是否真的可用：只发一个 HEAD 请求，3 秒内没有 2xx/3xx 就当作不可用。
proxy_up() {
  curl -s -o /dev/null --max-time 3 -x "$PROXY" https://github.com 2>/dev/null
}

if proxy_up; then
  echo "[git-push] 走代理 $PROXY"
  exec git -c http.proxy="$PROXY" -c https.proxy="$PROXY" "$@"
fi

echo "[git-push] 代理不可用，直连" >&2
# 直连也给一个上限：本机到 github.com 偶尔整体不通，别让命令无限挂着。
exec git -c http.lowSpeedLimit=1000 -c http.lowSpeedTime=30 "$@"
