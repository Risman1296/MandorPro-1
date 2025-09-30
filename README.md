# MandorPro

Aplikasi manajemen proyek konstruksi berbasis **Expo Router** (React Native 0.81, React 19) dengan target **Android/iOS/Web**.

> **Status**: Release Candidate (android-v0.1.0-rc.1) – fitur inti siap dipakai; sebagian halaman lanjutan masih placeholder.  
> **Release notes**: [Lihat catatan rilis](./RELEASE_NOTES.md)

---

## ✨ Fitur Utama

- **Navigasi & Layout**
   - Sidebar: **Dashboard**, **Proyek** (Daftar Proyek, Tugas*, Timeline*), **Pekerja** (Daftar, Absensi*, Kinerja*),
      **Material** (Stok, Pemakaian, Management), **Keuangan** (Penggajian*, Biaya Proyek*, Laporan Keuangan*),
      **Laporan** (Harian, Mingguan, Bulanan*), **Pengaturan**, **Admin → Database**  
      \*placeholder – akan diisi bertahap.
   - Expo Router: semua rute utama terdaftar & dinavigasi via Sidebar.

- **Basis Data**
   - Native (Android/iOS): **SQLite** (async singleton) + migrasi aman.
   - Web (dev): adapter **mock** agar app tetap jalan tanpa SQLite.
   - Adapters “safe” (`all/get/run`) untuk query lintas platform.
   - **Seeding demo** (scope `DEMO`): otomatis first run, atau manual via **Admin → Database**.

- **Material**
   - **Stok** (view `v_material_stock`): total_in/out & balance.
   - **Pemakaian**: daftar dengan **pencarian + sort + filter**, **Export CSV/Excel**.
   - **Management**: CRUD dasar material + Export CSV/Excel.

- **Pekerja**
   - Management: pencarian, sort, **soft-delete (aktif=0)**, Export CSV/Excel.

- **Proyek**
   - Management: daftar + tambah cepat + hapus.

- **Laporan**
   - **Harian**: ringkasan berbasis data stok (web-safe).
   - **Mingguan (Weekly Export)**: pencarian cepat + **Export CSV/Excel** (download web / share native).

- **Admin → Database**
   - Ringkasan count per entitas (scope DEMO).
   - Isi Demo / Hapus Demo (aman – hanya scope DEMO).
   - VACUUM (no-op aman di web).
   - Export JSON per scope (download web / share native).
   - Quick links ke editor Pekerja/Proyek/Material/Laporan Harian.

- **Ekspor & Berbagi**
   - Util ekspor **CSV/Excel** (reusable untuk list manapun).
   - Web: **download**; Native: **cache + share** (`expo-sharing`).

- **Notifikasi**
   - Integrasi `expo-notifications`, helper **Expo Push Token** siap uji.
   - FCM produksi: `google-services.json` + **Service Account (HTTP v1)** via `eas credentials`.

---

## 🗂️ Struktur Proyek (ringkas)

```

app/                 # Expo Router routes (dashboard, project, worker, material, report, admin, ...)
components/          # UI reusable (Sidebar, Layout, nav, ...)
src/
data/              # demo.ts, units.ts, navTree.ts
db/                # adapters, schema, queries, seed, boot, database helpers
logic/             # domain logic (payroll, bobot, ...)
models/            # types & constants
services/          # export CSV/XLSX, notify, sync/outbox
ui/                # theme, icons, shadows, boundary
utils/             # helpers umum (id, time, url state, import)
assets/              # ikon & data CSV seed
scripts/             # automasi build/dev

```

---

## 🧰 Prasyarat

- Node 18+ LTS
- PNPM / NPM / Yarn (bebas)
- **Expo CLI** (pakai `npx` saja)
- Android Studio (untuk emulator) – opsional

---

## � Menjalankan

### Dev Web
```bash
pnpm install        # atau npm/yarn
npx expo start --web --clear
```

### Dev Android (Expo Go / dev build)

```bash
npx expo start --clear
# scan QR di Expo Go (device & PC harus 1 jaringan)
```

> Web memakai **mock DB**: perubahan tidak dipersist (by design untuk dev).

---

## 🧱 Database & Seed

* **Init & seed**: dipanggil di `_layout.tsx` → `initDb()` lalu `ensureDemoSeed(false)`.
* **Admin → Database**:

   * **Isi Demo** / **Hapus Demo** (hanya scope `DEMO`)
   * **Export JSON**, **VACUUM**, ringkasan count

### Migrasi & Seed SQL (opsional)

Tersedia file SQL final:

- `migrations/001_init.sqlite` – schema lengkap
- `migrations/001_seed.sqlite` – data demo

Jalankan dari kode:

```ts
import { migrateAndSeed } from '@/src/db/migrate';
await migrateAndSeed();
```

Catatan: Pada Web (dev), DB memakai mock sehingga migrasi dilewati.

---

## 🔔 Notifikasi (FCM)

1. Taruh **`google-services.json`** di repo root (di-ignore Git).
2. Tambah di `app.json`:

    ```json
    { "expo": { "android": { "googleServicesFile": "./google-services.json" } } }
    ```
3. Upload **Service Account (FCM HTTP v1)** via:

    ```bash
    eas credentials
    ```
4. Uji kirim:

    ```ts
    const { data: expoPushToken } = await Notifications.getExpoPushTokenAsync();
    ```

    ```bash
    curl -X POST https://exp.host/--/api/v2/push/send \
       -H "Content-Type: application/json" \
       -d '{"to":"<ExpoPushToken>","title":"Test","body":"Hello from MandorPro"}'
    ```

---

## 🏗️ Build & Rilis (EAS)

Profil `eas.json`:

* **internal**: distribution internal (link tester)
* **production**: AAB untuk Play Store

Perintah:

```bash
# Build
npm run eas:build:android
# Submit (siapkan ./google-play-service-account.json)
npm run eas:submit:android
```

> Gunakan tag: `android-v0.1.0-rc.1`, dsb.

---

## 🧹 Kualitas & Tooling

* ESLint **flat config** (`eslint.config.js`) aktif

   > legacy `.eslintrc.cjs` akan dihapus pada rilis final.
* Rule kustom: **no DOM style array** (kompatibel RN Web).
* Script:

   ```json
   {
      "lint": "eslint .",
      "lint:fix": "eslint . --fix",
      "typecheck": "tsc --noEmit",
      "start-web-clear": "expo start --web --clear",
      "android:prebuild": "expo prebuild -p android",
      "android:bundle": "cd android && ./gradlew bundleRelease",
      "android:apk": "cd android && ./gradlew assembleRelease",
      "eas:build:android": "eas build -p android --profile production",
      "eas:submit:android": "eas submit -p android --profile production"
   }
   ```

---

## ⚠️ Batasan Diketahui

* Dev **Web** tidak persist DB (mock).
* Beberapa sub-halaman: **Timeline, Tugas, Pengadaan, Bulanan, Kinerja, Keuangan** masih placeholder.
* Otomasi push (topic/schedule) dan import JSON/CSV: belum dibuat.

---

## 🧭 Troubleshooting singkat

* **expo doctor fail (version mismatch)**
   Jalankan:

   ```bash
   npx expo-doctor --verbose
   npx expo install --check
   ```

   Pastikan hanya **1** lockfile & versi sesuai SDK.

* **Tampilan sub-tab sempit (web)**
   Pastikan ancestor konten pakai:

   ```js
   { flex: 1, minWidth: 0, minHeight: 0 }
   ```

---

## � Lisensi

Internal / proprietary (tentukan sesuai kebutuhan).

## Fitur Kegiatan Berdasarkan Tujuan Aplikasi

Fitur kegiatan merupakan aktivitas utama yang mendukung pengelolaan dan monitoring proyek konstruksi. Fitur-fitur yang harus ada antara lain:

- **Dashboard Proyek**: Menampilkan overview progres, status tugas, dan jadwal harian.
- **Manajemen Tugas & Penjadwalan**: Pembuatan, penugasan, serta update status tugas; dilengkapi dengan kalender dan timeline proyek.
- **Absensi & Check-In**: Absensi berbasis GPS dengan fitur check-in/out real-time dan rekap kehadiran.
- **Input Progres & Dokumentasi**: Pengunggahan foto kegiatan, pencatatan progres lapangan, dan integrasi data lapangan secara real-time.
- **Notifikasi & Reminder**: Otomatisasi push notification untuk reminder tugas, check-in, dan update status proyek.
- **Laporan & Analitik**: Laporan harian, mingguan, dan bulanan yang lengkap dengan visualisasi data dan analisa tren.
- **Integrasi & Sinkronisasi**: Sinkronisasi data antara aplikasi mobile dan sistem pusat secara real-time untuk menjaga konsistensi informasi.
