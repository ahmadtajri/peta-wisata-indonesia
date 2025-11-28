# 🗺️ Peta Wisata Indonesia

Aplikasi web Progressive Web App (PWA) yang menampilkan cerita dan lokasi wisata di Indonesia. Aplikasi ini memungkinkan pengguna untuk melihat, menambahkan, dan menyimpan destinasi wisata favorit mereka, serta melihat lokasinya secara interaktif di peta.

## ✨ Fitur Utama

- **Otentikasi Pengguna**: Fitur Login dan Register menggunakan Dicoding Story API.
- **Daftar Cerita Wisata**: Menampilkan daftar cerita wisata dari berbagai pengguna.
- **Peta Interaktif**: Integrasi dengan **Leaflet.js** untuk menampilkan lokasi wisata pada peta.
- **Tambah Cerita**: Pengguna dapat mengunggah cerita baru beserta foto dan lokasi.
- **Favorit (Offline)**: Menyimpan cerita ke daftar favorit yang dapat diakses secara offline (menggunakan **IndexedDB**).
- **PWA Support**:
  - **Offline Capability**: Aplikasi tetap bisa dibuka saat tidak ada internet (menggunakan Service Worker).
  - **Installable**: Dapat diinstal ke homescreen perangkat (Manifest).
- **Push Notification**: Mendukung notifikasi web (Subscribe/Unsubscribe).
- **Responsive Design**: Tampilan yang menyesuaikan berbagai ukuran layar (Mobile First).

## 🛠️ Teknologi yang Digunakan

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Build Tool**: Webpack 5
- **Maps**: Leaflet.js & OpenStreetMap
- **PWA**: Service Worker, Web App Manifest, Cache API, IndexedDB
- **Server (Production)**: Node.js & Express
- **API**: Dicoding Story API

## 🚀 Cara Menjalankan Project

### Prasyarat

Pastikan Anda telah menginstal:
- [Node.js](https://nodejs.org/) (v14 atau lebih baru)
- [npm](https://www.npmjs.com/)

### Instalasi

1. **Clone atau Download** repository ini.
2. Buka terminal di folder project.
3. Install dependencies:
   ```bash
   npm install
   ```
   *Jika ada error terkait `core-js`, jalankan: `npm install --save core-js@3`*

### Mode Development

Untuk menjalankan aplikasi dalam mode pengembangan (dengan Hot Module Replacement):

```bash
npm start
```
Aplikasi akan berjalan di `http://localhost:9000`.

### Mode Production

Untuk membuild aplikasi dan menjalankannya dalam mode produksi (seperti saat dideploy):

1. **Build Project**:
   ```bash
   npm run build
   ```
   Perintah ini akan menghasilkan folder `dist/` yang berisi file-file yang sudah dioptimasi.

2. **Jalankan Server Production**:
   ```bash
   npm run serve-prod
   ```
   Aplikasi akan berjalan di `http://localhost:8080`.

3. **Build & Serve Sekaligus**:
   ```bash
   npm run build-serve
   ```

## 📂 Struktur Project

```text
peta-wisata-indonesia/
├── dist/                   # File hasil build (Production)
├── src/                    # Source code
│   ├── public/             # Aset statis (gambar, icon, manifest)
│   ├── scripts/            # Kode JavaScript
│   │   ├── components/     # Web Components (jika ada)
│   │   ├── data/           # API & Database logic
│   │   ├── pages/          # Logika per halaman
│   │   ├── routes/         # Routing logic
│   │   ├── utils/          # Utility functions (SW register, notifikasi, dll)
│   │   ├── globals/        # Konfigurasi global
│   │   └── index.js        # Entry point
│   ├── styles/             # File CSS
│   ├── index.html          # Template HTML utama
│   └── sw.js               # Service Worker configuration
├── webpack.common.js       # Konfigurasi Webpack umum
├── webpack.dev.js          # Konfigurasi Webpack development
├── webpack.prod.js         # Konfigurasi Webpack production
├── server.js               # Server untuk Push Notification
├── serve-prod.js           # Server untuk Production Serve
├── package.json            # Dependencies & Scripts
└── README.md               # Dokumentasi
```

## 🧪 Testing

Lihat panduan lengkap testing di file [TESTING.md](./TESTING.md).

## 🐛 Troubleshooting

Jika mengalami masalah saat build atau menjalankan aplikasi, lihat panduan di [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) (jika tersedia) atau cek bagian Scripts di `package.json`.

---
**Dicoding Academy - Belajar Pengembangan Web Intermediate**
