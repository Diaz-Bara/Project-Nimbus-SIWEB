#!/usr/bin/env bash
# Jalankan Nimbus dalam mode production: build sekali, halaman langsung cepat (tanpa compile per-klik).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

PORT="${PORT:-3000}"
REBUILD=0
DEV_MODE=0
OPEN_BROWSER=1

for arg in "$@"; do
  case "$arg" in
    --rebuild|-r) REBUILD=1 ;;
    --dev|-d) DEV_MODE=1 ;;
    --no-open) OPEN_BROWSER=0 ;;
    --port=*) PORT="${arg#*=}" ;;
    -h|--help)
      echo "Usage: pnpm launch [-- --rebuild] [-- --dev] [-- --no-open] [-- --port=3000]"
      echo ""
      echo "  (default)  Production: build sekali lalu next start — paling cepat dipakai"
      echo "  --rebuild  Paksa build ulang sebelum start"
      echo "  --dev      Mode development (compile per halaman, untuk coding)"
      exit 0
      ;;
  esac
done

if [[ ! -f .env.local ]]; then
  echo "❌ .env.local tidak ditemukan."
  echo "   Salin .env.example lalu isi POSTGRES_URL dan AUTH_SECRET."
  exit 1
fi

if [[ ! -d node_modules ]]; then
  echo "📦 Menginstall dependencies..."
  pnpm install
fi

pick_port() {
  local p="$1"
  if lsof -iTCP:"$p" -sTCP:LISTEN -t >/dev/null 2>&1; then
    for try in 3001 3002 3003 3004 3005; do
      if ! lsof -iTCP:"$try" -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "$try"
        return
      fi
    done
    echo "$p"
  else
    echo "$p"
  fi
}

REQUESTED_PORT="$PORT"
PORT="$(pick_port "$PORT")"
export PORT

if [[ "$PORT" != "$REQUESTED_PORT" ]]; then
  echo "⚠️  Port $REQUESTED_PORT sudah dipakai. Server akan jalan di port $PORT."
  echo "   Tutup instance lama atau jalankan: npm run launch:build -- --port=$REQUESTED_PORT"
fi

free_port() {
  local p="$1"
  local pid
  pid="$(lsof -iTCP:"$p" -sTCP:LISTEN -t 2>/dev/null | head -1 || true)"
  if [[ -n "$pid" ]]; then
    echo "🔄 Port $p dipakai (PID $pid), menghentikan..."
    kill "$pid" 2>/dev/null || true
    sleep 1
  fi
}

if [[ "$DEV_MODE" -eq 1 ]]; then
  echo "🔧 Dev mode (compile saat buka halaman) → http://localhost:$PORT"
  [[ "$OPEN_BROWSER" -eq 1 ]] && (sleep 2 && open "http://localhost:$PORT/login") &
  exec npx next dev --turbopack -p "$PORT"
fi

needs_build=0
if [[ ! -f .next/BUILD_ID ]]; then
  needs_build=1
fi
if [[ "$REBUILD" -eq 1 ]]; then
  needs_build=1
fi

# Auto-rebuild when source/config changed after the last production build.
if [[ "$needs_build" -eq 0 && -f .next/BUILD_ID ]]; then
  build_stamp="$(stat -f "%m" .next/BUILD_ID 2>/dev/null || echo 0)"
  newer_src="$(
    find src scripts public -type f \( -name '*.ts' -o -name '*.tsx' -o -name '*.js' -o -name '*.jsx' -o -name '*.css' -o -name '*.json' \) -newer .next/BUILD_ID 2>/dev/null | head -1 || true
  )"
  if [[ -n "$newer_src" ]]; then
    echo "📝 Kode berubah sejak build terakhir ($newer_src)."
    needs_build=1
  elif [[ -f package.json && "$(stat -f "%m" package.json)" -gt "$build_stamp" ]]; then
    echo "📝 package.json berubah sejak build terakhir."
    needs_build=1
  elif [[ -f next.config.ts && "$(stat -f "%m" next.config.ts)" -gt "$build_stamp" ]]; then
    echo "📝 next.config.ts berubah sejak build terakhir."
    needs_build=1
  fi
fi

if [[ "$needs_build" -eq 1 ]]; then
  echo "🏗️  Build production (sekali, ~20–30 detik)..."
  pnpm run build
else
  echo "⚡ Pakai build yang sudah ada (.next). Pakai --rebuild untuk paksa build ulang."
fi

free_port "$PORT"

echo "🚀 Nimbus jalan → http://localhost:$PORT"
echo "   Login: op1@nimbus.cargo / password123"
[[ "$OPEN_BROWSER" -eq 1 ]] && open "http://localhost:$PORT/login"

exec npx next start -p "$PORT"