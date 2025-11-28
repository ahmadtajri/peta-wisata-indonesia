# 🚀 Panduan Menjalankan Aplikasi

## 📋 Prerequisites

Pastikan sudah terinstall:
- Node.js (v14 atau lebih baru)
- npm (biasanya sudah terinstall dengan Node.js)

## 🛠️ Installation

```bash
npm install
```

## 🔧 Mode Development

### Menjalankan Development Server

```bash
npm start
```

atau

```bash
npm run dev
```

**Fitur Development Mode:**
- ✅ Hot Module Replacement (HMR)
- ✅ Auto reload saat file berubah
- ✅ Source maps untuk debugging
- ✅ Berjalan di `http://localhost:9000`
- ✅ Browser otomatis terbuka

**Service Worker di Development:**
- Service Worker tetap aktif untuk testing
- Cache dinonaktifkan untuk development
- Setiap perubahan langsung terlihat

## 🏭 Mode Production

### 1. Build Production

```bash
npm run build
```

**Hasil build:**
- File bundle di-minify dan di-optimize
- CSS di-extract ke file terpisah
- Assets di-copy ke folder `dist/`
- Service Worker di-copy ke `dist/sw.js`
- File manifest dan offline.html di-copy

### 2. Serve Production Build

Setelah build selesai, jalankan:

```bash
npm run serve-prod
```

**Fitur Production Mode:**
- ✅ Serve dari folder `dist/`
- ✅ Berjalan di `http://localhost:8080`
- ✅ Service Worker aktif dengan caching penuh
- ✅ Optimized bundle size
- ✅ Production-ready

### 3. Build & Serve Sekaligus

```bash
npm run build-serve
```

Command ini akan:
1. Build production bundle
2. Langsung serve hasil build

## 📊 Validasi Production Build

### 1. Cek Folder dist/

Setelah build, pastikan folder `dist/` berisi:
```
dist/
├── index.html
├── manifest.json
├── offline.html
├── sw.js
├── main.[hash].bundle.js
├── main.[hash].css
└── public/
    ├── icons/
    └── ...
```

### 2. Test di Browser

1. Jalankan `npm run serve-prod`
2. Buka `http://localhost:8080`
3. Buka Developer Tools (F12)
4. Cek tab **Application** → **Service Workers**
5. Pastikan Service Worker aktif
6. Cek tab **Network** → Refresh halaman
7. Pastikan file di-cache (lihat "from ServiceWorker")

### 3. Test Offline

1. Buka aplikasi di browser
2. Buka Developer Tools (F12)
3. Tab **Network** → Centang "Offline"
4. Refresh halaman
5. Aplikasi harus tetap bisa diakses (dari cache)

## 🔍 Troubleshooting

### Build Gagal

```bash
# Hapus node_modules dan install ulang
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Service Worker Tidak Update

```bash
# Di browser:
# 1. Buka Developer Tools (F12)
# 2. Tab Application → Service Workers
# 3. Klik "Unregister"
# 4. Refresh halaman
```

### Port Sudah Digunakan

**Development (port 9000):**
```bash
# Ubah port di webpack.dev.js
devServer: {
  port: 9001, // Ganti port
}
```

**Production (port 8080):**
```bash
# Set environment variable
PORT=8081 npm run serve-prod
```

## 📝 Scripts Summary

| Command | Deskripsi |
|---------|-----------|
| `npm start` | Jalankan development server |
| `npm run dev` | Sama dengan `npm start` |
| `npm run build` | Build production bundle |
| `npm run serve-prod` | Serve production build |
| `npm run build-serve` | Build + serve production |

## 🎯 Best Practices

### Development
- Gunakan `npm start` untuk development
- Service Worker aktif tapi cache minimal
- Perubahan langsung terlihat

### Production
- Selalu build ulang sebelum deploy: `npm run build`
- Test production build lokal: `npm run serve-prod`
- Pastikan Service Worker berfungsi
- Cek bundle size di folder `dist/`

## 🚀 Deploy ke Production

### Vercel / Netlify
```bash
# Build command
npm run build

# Output directory
dist
```

### Manual Deploy
```bash
# 1. Build
npm run build

# 2. Upload folder dist/ ke server

# 3. Serve dengan web server (nginx, apache, dll)
```

## ✅ Checklist Production

- [ ] `npm run build` berhasil tanpa error
- [ ] Folder `dist/` berisi semua file
- [ ] `npm run serve-prod` berjalan tanpa error
- [ ] Aplikasi bisa diakses di `http://localhost:8080`
- [ ] Service Worker terdaftar di browser
- [ ] Aplikasi bisa diakses offline
- [ ] Push notification berfungsi
- [ ] Semua fitur berjalan normal

---

**Dibuat untuk:** Peta Wisata Indonesia
**Framework:** Webpack 5 + Vanilla JavaScript
**Mode:** Development & Production Ready ✅
