#!/bin/sh
# macOS/Linux 런처 — 더블클릭하면 서버가 뜨고 브라우저가 열린다
cd "$(dirname "$0")"
exec node --env-file=.env server/index.mjs
