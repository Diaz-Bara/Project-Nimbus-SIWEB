# Project Nimbus SIWEB (Unified Bundle)

Aplikasi cargo/logistics Next.js: dashboard admin, shipments, flights, tracking, users, dan halaman publik. Database: Neon Postgres.

Folder ini adalah **satu sumber kebenaran** yang menggabungkan versi localhost terbaru + hardening cross-platform dari branch Neon overhaul.

## Prasyarat

- Node.js >= 20.9 (lihat `.nvmrc`)
- pnpm (wajib)

```bash
corepack enable
node -v
pnpm -v
```

## Setup cepat

```bash
cd Project-Nimbus-SIWEB
cp .env.example .env.local
# isi POSTGRES_URL dan AUTH_SECRET
pnpm install
pnpm launch:dev
```

Buka http://localhost:3000/seed sekali untuk data awal.

## Login default (setelah seed)

| Role | Email | Password |
|------|-------|----------|
| Admin | `op1@nimbus.cargo` | `password123` |
| Operator | `op4@nimbus.cargo` | `password123` |

Reset semua password demo:

```bash
bash scripts/reset-passwords.sh
```

## Scripts

| Command | Keterangan |
|---------|------------|
| `pnpm dev` | Dev server (Turbopack) |
| `pnpm dev:webpack` | Dev fallback tanpa Turbopack (Windows) |
| `pnpm launch` | Build production + start (paling cepat dipakai) |
| `pnpm launch:dev` | Dev mode via launch script |
| `pnpm launch:build` | Paksa rebuild lalu start |
| `pnpm build` | Production build |
| `pnpm start` | Jalankan build production |

Atau double-click `Launch Nimbus.command` di macOS.

## Struktur fitur

- **Publik:** Home, About, Services, Clients, Contact, Tracking, Login, Register, Forgot Password
- **Dashboard:** Dashboard, Tracking Admin, Flights
- **Admin only:** Shipments, Users
- **Redirect legacy:** `/Tentang` → `/about`, `/Layanan` → `/services`, dll.

## Environment

Hanya dua variabel wajib:

- `POSTGRES_URL` — connection string Neon Postgres (SSL)
- `AUTH_SECRET` — secret session (lihat `.env.example`)

Opsional: `AUTH_URL` untuk NextAuth callback lokal.

## Troubleshooting

| Masalah | Solusi |
|---------|--------|
| Internal Server Error di semua halaman | `rm -rf .next && pnpm dev` |
| Login gagal | Jalankan `/seed`, cek `POSTGRES_URL` |
| Turbopack error (Windows) | `pnpm dev:webpack` |
| Port 3000 sudah dipakai | Launch script auto-pindah ke 3001+ |

## Branch

Push ke branch baru: `feat/unified-bundle` — berisi semua perubahan localhost dalam satu commit bersih.