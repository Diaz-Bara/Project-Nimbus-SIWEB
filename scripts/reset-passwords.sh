#!/usr/bin/env bash
# Reset semua password user demo ke password123
set -euo pipefail
cd "$(dirname "$0")/.."
node <<'NODE'
const postgres = require('postgres');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const url = fs.readFileSync('.env.local', 'utf8').match(/POSTGRES_URL=(.+)/)[1].trim();
const sql = postgres(url, { ssl: 'require' });
(async () => {
  const hash = await bcrypt.hash('password123', 10);
  const updated = await sql`UPDATE users SET password = ${hash}, updated_at = NOW()`;
  console.log('✅ Semua password di-reset ke: password123');
  console.log('   Contoh login: op1@nimbus.cargo / password123');
  await sql.end();
})();
NODE