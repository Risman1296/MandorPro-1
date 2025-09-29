# MandorPro – Release Notes

## android-v0.1.0-rc.1 (RC)

### ✅ Yang baru

- **Material Management**: CRUD dasar + pencarian + Export CSV/Excel (`/material/management`).
- **UsageList**: tambah **sort/filter**, **Quick Reset**, **Export CSV/Excel**.
- **Admin → Database**: Isi Demo, Hapus Demo, VACUUM, Export JSON, ringkasan count, quick links.
- **Project Management**: tombol **Tambah** cepat.
- **Worker Management**: **soft-delete** (aktif=0) + export.
- **Export Utils**: CSV/XLSX reusable, web (download) & native (share).
- **FCM wiring**: `googleServicesFile` + helper `getExpoPushTokenSafe`.
- **UI tokens**: ukuran standar Android (AppBar 56dp, TabBar 48dp, Drawer 280dp, touch 48dp).

### 🔧 Perbaikan / perubahan

- Layout RN Web: seluruh konten utama `flex:1` + `minWidth/Height:0` → mencegah area “sempit”.
- `ensureDemoSeed(false)` dipanggil setelah init DB (first run native).
- ESLint flat config aktif; rule **no DOM style array** diterapkan di komponen baru.

### ⚠️ Batasan

- Dev Web non-persist (mock DB).  
- Placeholder: **Tugas**, **Timeline**, **Pengadaan**, **Kinerja**, **Laporan Bulanan**, **Keuangan**.  
- Otomasi push (topic/schedule) belum ada.

### 📦 Build

- **EAS profiles**: `internal` (testing), `production` (AAB).
- **Submit**: `submit.production.android` → track `production`.

### 🧪 Cara uji cepat

1. **Admin → Database**: klik **Isi Demo**, cek count meningkat.  
2. **Material → Usage**: filter/sort, **Export CSV/Excel**.  
3. **Material → Management**: tambah/rename/hapus.  
4. **Pekerja/Proyek**: search/sort/export; tambah proyek.  
5. **Laporan → Mingguan**: export XLSX/CSV.  
6. **Notifikasi**: ambil **ExpoPushToken** dan kirim uji via Expo Push API.

### 🗺️ Rencana berikutnya

- **Absensi** (CRUD + rekap) terhubung ke Daily Report.
- **Material Pengadaan (PO/Receive)** yang menulis ke `material_ledger`.
- **Laporan Bulanan** (rentang tanggal + PDF).
- **Import JSON/CSV** & **topic push** (stok menipis / tugas due).
