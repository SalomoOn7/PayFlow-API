# PayFlow API

Backend REST API dengan integrasi payment gateway (Midtrans), dibangun untuk portofolio backend developer. Mengimplementasikan autentikasi JWT (access + refresh token), pembuatan transaksi pembayaran, webhook signature verification, dan idempotency key untuk mencegah double charge.

## Fitur Utama

- **Autentikasi JWT** — register, login, refresh token dengan rotasi otomatis
- **Payment Gateway Integration** — Midtrans Core API (Bank Transfer VA, GoPay)
- **Webhook Handler** — signature verification (SHA512) untuk validasi notifikasi pembayaran
- **Idempotency Key** — mencegah transaksi ganda akibat retry/double-click
- **Validasi Payload** — Zod schema dengan validasi kombinasi field
- **Error Handling** — custom error class dan global error handler yang konsisten
- **Rate Limiting** — pembatasan request pada endpoint auth
- **Containerized** — Docker multi-stage build, siap deploy

## Tech Stack

| Kategori | Tools |
|---|---|
| Runtime | Node.js, TypeScript |
| Framework | Express |
| Database | MongoDB (Mongoose) |
| Validasi | Zod |
| Autentikasi | JWT (access + refresh token) |
| Payment Gateway | Midtrans Core API |
| Logger | Pino |
| Container | Docker |
| Deployment | Railway |
| Linting | ESLint, Husky (pre-commit hook) |

## Arsitektur

```
src/
├── config/          # Koneksi DB, environment variables, logger, Midtrans client
├── controllers/      # Handler request/response tiap endpoint
├── middlewares/       # Auth (JWT), validasi Zod, idempotency, error handler
├── models/           # Mongoose schema (User, Transaction, Session, IdempotencyKey)
├── routes/            # Definisi endpoint per modul
├── schemas/           # Zod schema untuk validasi payload
├── services/          # Business logic (auth, transaction, webhook)
├── types/             # Custom TypeScript type declarations
├── utils/             # Helper (AppError, dll)
└── server.ts          # Entry point aplikasi
```

**Alur request umum:**
```
Client → Route → Middleware (auth/validate/idempotency) → Controller → Service → Model/External API → Response
```

Error dari `Service` dilempar sebagai `AppError` dan ditangkap oleh `errorHandler` global di `app.ts`, sehingga format response error konsisten di seluruh endpoint.

## Diagram Alur

### 1. Autentikasi (Register → Login → Refresh)
```
Client                          Server                           Database
  |                                |                                  |
  |--- POST /auth/register ------->|                                  |
  |                                |--- hash password, save user ---->|
  |                                |--- generate access+refresh ----->|
  |<---- { user, tokens } ---------|                                  |
  |                                |                                  |
  |--- POST /auth/login ---------->|                                  |
  |                                |--- verify password -------------->|
  |                                |--- generate access+refresh ------>|
  |<---- { user, tokens } ---------|                                  |
  |                                |                                  |
  |--- POST /auth/refresh -------->|                                  |
  |    (refreshToken lama)         |--- cek session, rotate token ---->|
  |<---- { new tokens } -----------|    (token lama dihapus)          |
```

### 2. Create Transaction & Webhook
```
Client                Server               Midtrans              Database
  |                      |                     |                     |
  |-- POST /transactions ->|                     |                     |
  |   (Bearer + Idempotency-Key)                 |                     |
  |                      |--- charge() -------->|                     |
  |                      |<-- VA number ---------|                     |
  |                      |--- simpan transaksi (status: pending) ---->|
  |<-- { transaction } ---|                     |                     |
  |                      |                     |                     |
  |   (user bayar VA di luar sistem)            |                     |
  |                      |                     |                     |
  |                      |<== webhook notif ====|                     |
  |                      |--- verifikasi signature (SHA512) --->|      |
  |                      |--- update status transaksi --------->|      |
  |                      |=== 200 OK ==========>|                     |
```

## Menjalankan Secara Lokal

### Prasyarat
- Node.js 20+
- MongoDB Atlas (atau MongoDB lokal)
- Akun sandbox [Midtrans](https://midtrans.com)

### Instalasi

```bash
git clone <repo-url>
cd payflow-api
npm install
```

### Environment Variables

Salin `.env.example` menjadi `.env`, isi dengan nilai kamu:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
MIDTRANS_SERVER_KEY=your_sandbox_server_key
MIDTRANS_CLIENT_KEY=your_sandbox_client_key
MIDTRANS_IS_PRODUCTION=false
```

### Menjalankan Development Server

```bash
npm run dev
```

Server berjalan di `http://localhost:5000`.

### Menjalankan dengan Docker

```bash
docker build -t payflow-api .
docker run -p 5000:5000 --env-file .env payflow-api
```

### Testing Webhook Secara Lokal

Gunakan [ngrok](https://ngrok.com) untuk expose server lokal, lalu daftarkan URL-nya sebagai **Payment Notification URL** di dashboard sandbox Midtrans:

```bash
ngrok http 5000
```

## API Endpoints

### Auth
| Method | Endpoint | Deskripsi | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Registrasi user baru | - |
| POST | `/api/auth/login` | Login, dapatkan access & refresh token | - |
| POST | `/api/auth/refresh` | Refresh access token | - |

### Transaction
| Method | Endpoint | Deskripsi | Auth |
|---|---|---|---|
| POST | `/api/transactions` | Buat transaksi baru | Bearer + `Idempotency-Key` header |
| GET | `/api/transactions/:orderId` | Cek status transaksi | Bearer |

### Webhook
| Method | Endpoint | Deskripsi | Auth |
|---|---|---|---|
| POST | `/api/webhooks/midtrans` | Notifikasi status pembayaran dari Midtrans | Signature verification |

### Health
| Method | Endpoint | Deskripsi | Auth |
|---|---|---|---|
| GET | `/api/health` | Cek status server | - |

## Keamanan

- **Password hashing** dengan bcrypt
- **JWT** dengan access token berumur pendek (15 menit) dan refresh token yang dirotasi setiap dipakai
- **Webhook signature verification** (SHA512) — notifikasi palsu otomatis ditolak dengan `403`
- **Idempotency key** — mencegah pembuatan transaksi ganda dari request yang sama
- **Rate limiting** pada endpoint auth (10 request/15 menit per IP)
- **Helmet** untuk security headers

## Live Demo

API pernah di-deploy di Railway (trial sudah berakhir).

Untuk menjalankan sendiri, lihat bagian "Menjalankan Secara Lokal" di atas.

API sebelumnya sudah di-deploy di Railway: `https://payflow-api-production-dc77.up.railway.app`

Contoh test health check:
```bash
curl https://payflow-api-production-dc77.up.railway.app/api/health
```

## Lisensi

MIT
