# Golang REST API Single Page Application (SPA) Frontend

Testing Frontend Client berarsitektur modern untuk menguji dan mengonsumsi seluruh endpoint REST API dari backend Golang (`test-golang-project`). Dibangun menggunakan **Vue 3 (Composition API & `<script setup>`)**, **Vite**, **Tailwind CSS v4**, **Pinia**, **Vue Router 4**, dan **Axios**.

---

## 🌟 Fitur Utama

- **100% Endpoint Coverage (31 Endpoints)**: Mengonsumsi dan menguji seluruh endpoint Backend (Health, Auth, Profile, Categories, Todos, Users, Soft-Deletes & Restore).
- **Dark Mode Support (Light / Dark / System)**: Mendukung dark mode penuh dengan tombol toggle 1-klik di header & halaman login, deteksi preferensi sistem (`prefers-color-scheme`), serta persistensi ke `localStorage`.
- **Interactive API Explorer & Runner**: Panel pengujian interaktif langsung di dalam aplikasi untuk mengeksekusi request method (`GET`, `POST`, `PATCH`, `DELETE`), mengedit query params & body JSON, serta menginspeksi status HTTP, latency (ms), response headers, dan JSON response secara real-time.
- **Modern UI & Responsive Design**: Menggunakan Tailwind CSS v4 dengan palet warna modern, responsif untuk layar mobile hingga desktop.
- **State Management Terpusat (Pinia)**:
  - `auth`: Autentikasi JWT, session persistence di `localStorage`, auto-logout saat token kedaluwarsa (401).
  - `todo`: Filter realtime (`category_id`, `is_completed`, `search`), paginasi, toggle status selesai.
  - `category`: CRUD kategori berbasis kepemilikan user (creator-scoped).
  - `user`: Manajemen pengguna khusus role Administrator (`is_admin: true`).
  - `health`: Monitoring status server Gin dan database MySQL secara live dengan indikator latency.
  - `theme`: Pengaturan tema gelap/terang.
  - `toast`: Stack notifikasi interaktif (Success, Error, Warning, Info) dengan rincian pesan validasi field.
- **Routing & Navigation Guards (Vue Router 4)**:
  - Guard `requiresAuth` untuk rute terproteksi.
  - Guard `guestOnly` untuk halaman login & register.
  - Guard `requiresAdmin` untuk proteksi halaman User Management.
- **Zero-CORS Dev Setup**: Vite dev server proxy terkonfigurasi otomatis mengarahkan `/api` dan `/health` ke `http://127.0.0.1:8080`.

---

## 📁 Struktur Direktori

```text
src/
├── api/                        # HTTP API Service Layer (Axios)
│   ├── client.js               # Axios instance, Bearer token interceptor, 401 handling
│   ├── health.js               # GET /health
│   ├── auth.js                 # POST /api/auth/{login, register, logout}
│   ├── profile.js              # GET & PATCH /api/profile
│   ├── categories.js           # Full CRUD /api/category (termasuk deleted, restore, permanent)
│   ├── todos.js                # Full CRUD /api/todo (termasuk complete toggle, trash)
│   └── users.js                # Full CRUD /api/user (khusus role Admin)
├── stores/                     # Pinia State Management
│   ├── auth.js                 # Session, User profile, role checks
│   ├── todo.js                 # Todos, search, filter, pagination
│   ├── category.js             # Categories & cache
│   ├── user.js                 # Admin user directory
│   ├── health.js               # Backend health & DB connectivity
│   ├── theme.js                # Light / Dark mode state & persistence
│   └── toast.js                # Global toast notifications
├── router/
│   └── index.js                # Route definitions & navigation guards
├── components/
│   ├── common/
│   │   ├── AppHeader.vue       # Topbar dengan status live API, theme toggle, profile & logout
│   │   ├── AppSidebar.vue      # Sidebar menu navigasi responsif
│   │   ├── ThemeToggle.vue     # Tombol switch Light / Dark mode
│   │   ├── ToastContainer.vue  # Floating toast notifications
│   │   ├── ModalDialog.vue     # Reusable accessible modal dialog
│   │   ├── ConfirmDialog.vue   # Reusable confirm dialog (soft delete / permanent delete)
│   │   ├── PaginationBar.vue   # Navigasi halaman & limit per halaman
│   │   ├── LoadingSpinner.vue  # State loading
│   │   ├── EmptyState.vue      # Tampilan data kosong
│   │   └── StatusBadge.vue     # Badges warna status & role
│   ├── todo/
│   │   └── TodoModal.vue       # Form modal tambah/edit todo
│   ├── category/
│   │   └── CategoryModal.vue   # Form modal tambah/edit kategori
│   └── user/
│       └── UserModal.vue       # Form modal tambah/edit user (Admin)
├── views/
│   ├── auth/
│   │   ├── LoginView.vue       # Sign In + Demo accounts quick-fill
│   │   └── RegisterView.vue    # Pendaftaran akun baru
│   ├── dashboard/
│   │   └── DashboardView.vue   # Overview metrik, status server & ringkasan aktivitas
│   ├── todos/
│   │   └── TodosView.vue       # Manajemen Todo lengkap dengan filter kategori & status
│   ├── categories/
│   │   └── CategoriesView.vue  # Manajemen Kategori
│   ├── users/
│   │   └── UsersView.vue       # Manajemen Pengguna (Khusus Admin)
│   ├── trash/
│   │   └── TrashView.vue       # Tempat Sampah terpadu (Restore & Purge permanen)
│   ├── profile/
│   │   └── ProfileView.vue     # Edit profil & ganti password akun aktif
│   ├── api-explorer/
│   │   └── ApiExplorerView.vue # Interactive Live REST API Runner untuk 31 endpoints
│   └── NotFoundView.vue        # 404 handler
├── layouts/
│   ├── MainLayout.vue          # Layout dashboard dengan sidebar & header
│   └── AuthLayout.vue          # Layout autentikasi dengan theme toggle
├── App.vue
└── main.js
```

---

## 🔑 Akun Demo Siap Uji (Database Seeder)

Untuk mempermudah pengujian, terdapat tombol pintas 1-klik di halaman Login:

| Akun | Email | Password | Role |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@example.com` | `password` | Admin (Akses penuh + User Management) |
| **Shin** | `shin@example.com` | `password` | Admin (Akses penuh + User Management) |
| **Test User** | `user@example.com` | `password` | Regular User (Creator Scoped) |
| **Nao** | `nao@example.com` | `password` | Regular User (Creator Scoped) |

---

## ⚙️ Konfigurasi Environment Dinamis (.env)

Port server Frontend dan domain/URL Backend dapat dikonfigurasi secara dinamis melalui file `.env`:

```env
# Port Server Frontend (Vite)
# Ubah nilai ini jika ingin menjalankan FE di port lain (misal: 3000, 5173, 8000)
VITE_PORT=5173

# Port Server Production (Nginx) jika menggunakan Docker Compose profile 'prod'
VITE_PROD_PORT=80

# Domain / Target URL Backend
# - Lokal di Windows Host: http://127.0.0.1:8080
# - Di dalam Docker Desktop: otomatis terkonfigurasi ke http://host.docker.internal:8080
#   (atau bisa diisi host container seperti http://test-golang-api:8080 atau https://api.domainanda.com)
VITE_BACKEND_URL=http://127.0.0.1:8080

# Opsional: Direct base URL jika tidak ingin menggunakan Vite Dev Proxy
VITE_API_BASE_URL=

# Judul Aplikasi
VITE_APP_TITLE=Golang API Frontend Tester
```

Ketika nilai di `.env` diubah:
1. `vite.config.js` secara otomatis menyesuaikan port frontend (`server.port`) dan target proxy backend (`server.proxy`).
2. Tampilan Frontend (Sidebar, Dashboard, dan API Explorer) secara dinamis menampilkan hostname dan port backend yang sedang aktif.

---

## 🪵 Error Logging Frontend

Error khusus pada aplikasi Frontend (Vue component errors, unhandled promise rejections, runtime JS errors) dicatat secara otomatis ke file log di folder `logs/` tanpa mengganggu atau mencampur error dari Backend Golang.

- **Lokasi File**: `logs/fe-YYYY-MM-DD.log`
- **Format Log**:
  ```text
  [2026-11-13 11:05:42] local.ERROR: Cannot read properties of undefined (reading 'title') {"component":"TodoModal","url":"http://localhost:5173/todos"}
  [stacktrace]
  TypeError: Cannot read properties of undefined...
  ```
- **Silent & Non-Blocking**: Menggunakan `navigator.sendBeacon` sehingga tidak mempengaruhi performa UI atau pengalaman pengguna.
- **Log Management Ready**: Siap dikonsumsi langsung oleh aplikasi log viewer / collector (Grafana Promtail, Filebeat, Datadog agent, atau tail log biasa).

---

## 🐳 Menjalankan dengan Docker Desktop

Project telah dilengkapi `Dockerfile` multi-stage dan `compose.yaml` yang siap dijalankan langsung di Docker Desktop.

### 1. Mode Development / Testing (Rekomendasi)
Mode ini menjalankan Vite dev server di dalam container dengan fitur **Hot-Module Replacement (HMR)** dan volume mount ke folder `logs/` di host:

```bash
# Build dan jalankan container di background
docker compose up -d --build

# Cek status container
docker compose ps

# Cek live logs container
docker compose logs -f frontend

# Hentikan container
docker compose down
```
Akses aplikasi melalui browser di `http://localhost:5173` (atau sesuai `VITE_PORT` di `.env`).

> [!TIP]
> **Koneksi ke Backend Golang di Docker Desktop**:
> Container Frontend menggunakan `host.docker.internal:8080` sehingga dapat terhubung secara otomatis ke backend Golang, baik saat backend dijalankan via Docker Compose (`test-golang-api`) maupun via terminal lokal (`go run cmd/api/main.go`).

### 2. Mode Production (Nginx Multi-Stage)
Jika ingin menguji build statis production yang disajikan oleh web server Nginx berkinerja tinggi:

```bash
# Jalankan container production (Nginx di port 80)
docker compose --profile prod up -d --build frontend-prod

# Hentikan container production
docker compose --profile prod down
```
Akses aplikasi melalui browser di `http://localhost:80` (atau sesuai `VITE_PROD_PORT` di `.env`).

---

## 🚀 Cara Menjalankan Secara Lokal (Tanpa Docker)

### 1. Jalankan Backend Project Terlebih Dahulu
Pastikan database MySQL aktif dan backend Project dijalankan di port 8080

### 2. Jalankan Frontend Vue SPA
Buka terminal di folder project:
```bash
# Install dependencies (jika belum)
npm install

# Jalankan dev server
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173`.
Buka browser dan login menggunakan salah satu akun demo di atas!
