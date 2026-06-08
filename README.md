# Project Nimbus SIWEB

Aplikasi cargo/logistics Next.js dengan dashboard admin, shipments, flights, tracking, dan users. Database: Neon Postgres.

## Versi terbaru

Branch lengkap (Neon DB overhaul): `feat/neon-db-overhaul` atau `revisi-sebelum-final`.

**Jangan clone `main` saja** jika butuh fitur terbaru — `main` di repo upstream belum merge PR overhaul.

Alternatif tanpa setup lokal: https://nimbus-cargo-siweb.vercel.app

## Prasyarat

- **Node.js >= 20.9** (Next.js 16)
- **pnpm** (wajib — jangan pakai `npm install`)

```bash
corepack enable
node -v   # harus >= 20.9
pnpm -v
```

## Setup (Windows & macOS)

```bash
git clone -b feat/neon-db-overhaul https://github.com/KevArslanian/Project-Nimbus-SIWEB.git
cd Project-Nimbus-SIWEB
cp .env.example .env.local
# isi POSTGRES_URL dan AUTH_SECRET (minta ke maintainer atau buat Neon sendiri)
pnpm install
pnpm dev
```

Buka http://localhost:3000/seed sekali untuk data awal (butuh `POSTGRES_URL` valid).

## Troubleshooting Windows

| Masalah | Solusi |
|---------|--------|
| `pnpm` tidak dikenali | `corepack enable` lalu restart terminal |
| `next dev` gagal (Turbopack) | `pnpm dev:webpack` |
| Login gagal | Cek `POSTGRES_URL` + jalankan `/seed` |
| Fitur admin kosong | Pastikan branch `feat/neon-db-overhaul`, bukan `main` lama |
| Install native module error | Pakai `pnpm install` (bcrypt native sudah dihapus, pakai bcryptjs) |

## Login default (setelah seed)

- Email: `admin@nimbus.com`
- Password: `password123`

## Scripts

| Command | Keterangan |
|---------|------------|
| `pnpm dev` | Dev server (Turbopack) |
| `pnpm dev:webpack` | Dev server fallback tanpa Turbopack |
| `pnpm build` | Production build |
| `pnpm start` | Jalankan build production |