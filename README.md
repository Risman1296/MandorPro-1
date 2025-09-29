# MandorPro - Construction Field Management App

**MandorPro** adalah aplikasi mobile (Android & iOS) untuk manajemen proyek konstruksi perumahan. Dikembangkan dengan **Expo React Native TypeScript**, menggunakan database **SQLite** untuk operasi offline-first dengan sinkronisasi ke **Google Drive**.

![Expo](https://img.shields.io/badge/Expo-~54.0.0-000020.svg?style=flat-square&logo=EXPO&labelColor=f3f3f3&logoColor=000)
![React Native](https://img.shields.io/badge/React_Native-0.81.4-blue.svg?style=flat-square&logo=react&logoColor=61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-~5.9.2-blue.svg?style=flat-square&logo=typescript&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-database-003b57.svg?style=flat-square&logo=sqlite&logoColor=white)

---

## 📱 Fitur Utama

### 🏗️ **Progress Tracking**

- Input progres per unit dan item WBS
- Perhitungan Earned Value (EV) otomatis
- Foto bukti dengan GPS location
- Status tracking (On Track/Delayed/Completed)

### 👥 **Absensi GPS**

- Check-in/out berbasis lokasi GPS
- Pencarian dan filter pekerja
- Statistik kehadiran harian
- Export data absensi

### 📦 **Material Management**

- Tracking stok real-time (IN/OUT/ADJ)
- Kartu stok per material
- Alert stok minimum
- Pencatatan penggunaan per shift (Pagi/Siang/Sore)

### 💰 **Payroll System**

- Gaji harian vs alokasi borongan
- Perhitungan berdasarkan bobot progres
- Laporan perbandingan mingguan
- Approval workflow

### 📊 **Site Diary**

- Dokumentasi harian per shift
- Catatan cuaca dan kondisi lapangan
- Multi-photo per entry
- Export ke PDF

### 📈 **Reporting**

- Laporan mingguan otomatis (Excel/PDF)
- Dashboard real-time
- Progress S-Curve (planned)
- Material usage analysis

### ☁️ **Offline-First + Sync**

- SQLite local database
- Delta sync dengan Google Drive
- Outbox pattern untuk reliability
- Backup/restore otomatis

---

## 🏗️ Arsitektur Aplikasi

```text
app/                    # Screens (Expo Router)
├─ index.tsx           # Dashboard
├─ progres/form.tsx    # Progress input
├─ material/usage.tsx  # Material usage
├─ absensi/            # Attendance screens
├─ payroll/            # Payroll screens
└─ reports/            # Reporting screens

src/
├─ db/                 # Database layer
│  ├─ database.ts      # SQLite setup & migrations
│  ├─ queries.ts       # CRUD operations
│  └─ seed.ts          # Mock data
├─ models/
│  ├─ types.ts         # Zod schemas & TypeScript types
│  └─ constants.ts     # WBS templates, enums
├─ services/
│  ├─ outbox.ts        # Delta sync service
│  ├─ gdrive.ts        # Google Drive integration
│  ├─ photo.ts         # Photo management
│  ├─ export.ts        # Excel/PDF generation
│  └─ notification.ts  # Push notifications
├─ logic/
│  ├─ payroll.ts       # Payroll calculations
│  └─ bobot.ts         # Progress weighting
├─ ui/
│  ├─ components.tsx   # Reusable UI components
│  └─ theme.ts         # Design tokens
└─ utils/
   ├─ id.ts            # ID generation
   ├─ time.ts          # Date/time utilities
   └─ validation.ts    # Form validation
```

---

## 🗄️ Database Schema

### Tabel Utama

- **projects**: Master proyek
- **unit_types**: Template tipe rumah (T-36, T-45, dll)
- **units**: Unit rumah individual
- **wbs_items**: Template WBS per tipe
- **unit_progress**: Progress tracking per unit
- **workers**: Master pekerja
- **attendance**: Kehadiran harian
- **payroll_weeks**: Payroll mingguan
- **materials**: Master material
- **stock_ledger**: Transaksi material
- **site_diary**: Catatan harian

### Sync & Audit

- **sync_outbox**: Delta changes untuk sinkronisasi
- **audit_log**: History perubahan data

---

## ⚙️ Setup & Development

1. **Install Dependencies**:

   ```bash
   npm install
   ```

2. **Environment Variables**:

   ```bash
   # .env (optional)
   GOOGLE_DRIVE_CLIENT_ID=your_client_id
   ```

3. **Run Development**:

   ```bash
   npm start          # Start Expo dev server
   npm run android    # Run on Android
   npm run ios        # Run on iOS
   npm run web        # Run web version
   ```

### Template WBS T-36 (contoh)

```typescript
export const WBS_SEED_T36 = [
  { code: 'A.001', name: 'Galian & Urugan', uom: 'M3', qty_total: 45, weight_pct: 8, piecework_total: 2700000 },
  { code: 'A.002', name: 'Pondasi Batu Kali', uom: 'M3', qty_total: 12, weight_pct: 15, piecework_total: 7200000 },
  // ... more WBS items
];
```

### Earned Value Calculation

```typescript
// Contoh: Unit A1-001, progress 60%
const evValue = calculateEV(unitId, 0.60);  // Returns earned value in Rupiah
```

---

## 📋 Workflow Harian

- **07:00** - Apel pagi & rencana harian
- **07:30** - Check-in GPS semua pekerja
- **12:00** - Input progress pagi + foto
- **13:00** - Material usage input
- **17:00** - Input progress siang + foto  
- **17:30** - Check-out & site diary
- **18:00** - Sync to cloud (auto)

### Mock Data

- Master proyek dari office
- Template WBS per tipe rumah
- Master pekerja dengan skill
- Material dengan stok awal

### API Integration (Future)

- REST API untuk master data
- WebSocket untuk real-time updates
- Push notifications untuk alerts

### Security (Future)

- PIN/biometric app lock
- Role-based access control
- Data encryption at rest

---

## 🚀 Build & Deployment

### EAS Build (Production)

```bash
# Setup EAS
npm install -g @expo/cli eas-cli
eas login
eas build:configure

# Build for stores
eas build --platform android --profile production
eas build --platform ios --profile production

# Submit to stores
eas submit --platform android
eas submit --platform ios
```

### Local Development Build

```bash
# For testing production features locally
eas build --profile development --platform android --local
eas build --profile development --platform ios --local

# Install on device
eas install --id [build-id]
```

---

## 📊 Export & Reporting

### Excel Output

- **Sheet 1**: Progress Overview
- **Sheet 2**: Material Usage
- **Sheet 3**: Payroll Summary
- **Sheet 4**: Attendance Report

### PDF Output

- Executive summary
- Progress photos with GPS
- Material consumption chart
- Worker productivity analysis

---

## 🛣️ Development Roadmap

### Phase 1 (MVP) ✅

- [x] Basic CRUD operations
- [x] Progress tracking with photos
- [x] Material stock management
- [x] GPS attendance
- [x] Payroll calculations
- [x] Excel reporting

### Phase 2 (Enhanced)

- [ ] Advanced S-Curve analytics
- [ ] WhatsApp integration for reports
- [ ] Barcode scanning for materials
- [ ] Weather API integration
- [ ] Push notification alerts
- [ ] Multi-project support

### Phase 3 (Enterprise)

- [ ] Web dashboard for managers
- [ ] Integration dengan ERP
- [ ] Advanced forecasting
- [ ] AI-powered insights
- [ ] IoT sensor integration

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 📧 Contact

**Developer**: Risman Mawir  
**Email**: <rismanmawir24@gmail.com>  
**Project Link**: [https://github.com/rismanmawir24/MandorPro](https://github.com/rismanmawir24/MandorPro)

---

🏗️ Built with ❤️ for Indonesian Construction Industry
