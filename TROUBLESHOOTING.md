# 🐛 Troubleshooting Guide

Panduan ini berisi solusi untuk masalah umum yang mungkin Anda temui saat mengembangkan atau menjalankan aplikasi Peta Wisata Indonesia.

## 🏗️ Masalah Build & Installation

### 1. Error `Module not found: Can't resolve 'core-js/...'`

**Penyebab:**
Webpack mencoba menggunakan polyfills dari `core-js` tetapi package tersebut tidak terinstall atau konfigurasi Babel meminta versi yang spesifik.

**Solusi:**
Install `core-js` versi 3:
```bash
npm install --save core-js@3
```
Atau, sederhanakan konfigurasi `webpack.prod.js` untuk menggunakan default preset tanpa opsi `useBuiltIns`.

### 2. Error `npm run build` Gagal

**Solusi:**
Coba bersihkan cache dan folder build lama:
```bash
# Hapus folder dist dan node_modules
rm -rf dist node_modules package-lock.json

# Install ulang dependencies
npm install

# Build ulang
npm run build
```

---

## 🚀 Masalah Runtime (Production)

### 1. Tampilan Rusak / Kotak-kotak Hitam (Skeleton)

**Gejala:**
Saat membuka aplikasi di mode production (`npm run serve-prod`), tampilan hanya menampilkan placeholder loading atau layout berantakan.

**Penyebab:**
- CSS tidak termuat dengan benar.
- Konflik antara CSS framework (misal Tailwind CDN) dengan CSS lokal.
- Webpack tidak meng-extract CSS dengan benar.

**Solusi:**
- Pastikan tidak ada CDN CSS yang conflicting di `index.html` (hapus Tailwind CDN jika tidak dipakai full).
- Cek tab **Network** di DevTools, pastikan file `.css` statusnya 200 OK.
- Jalankan `npm run build` ulang.

### 2. "Offline - Data dari cache" Terus Menerus

**Penyebab:**
Service Worker melakukan caching terlalu agresif atau tidak mendeteksi koneksi internet.

**Solusi:**
- Gunakan strategi caching yang tepat (Network First untuk API).
- Di browser: Buka DevTools > Application > Service Workers > Klik **"Unregister"**, lalu refresh halaman.

### 3. Push Notification Tidak Muncul

**Solusi:**
- Pastikan izin notifikasi diizinkan di browser.
- Pastikan VAPID Keys di `config.js` (frontend) dan `server.js` (backend) cocok.
- Cek console log untuk error saat subscribe.

---

## 🌐 Masalah API

### 1. Error 401 Unauthorized

**Penyebab:**
Token akses kadaluarsa atau tidak ada.

**Solusi:**
- Logout dan Login kembali.
- Cek `localStorage` apakah ada item `dicoding_story_user`.

### 2. Gambar Tidak Muncul (Broken Image)

**Penyebab:**
URL gambar dari API mungkin bermasalah atau terblokir mixed content (HTTP vs HTTPS).

**Solusi:**
- Pastikan aplikasi berjalan di HTTPS atau localhost.
- Cek console log untuk error loading image.

---

## 🛠️ Tips Debugging

1. **Gunakan DevTools**: Selalu cek tab **Console** untuk error JavaScript dan tab **Network** untuk request API yang gagal.
2. **Lighthouse Audit**: Gunakan tab Lighthouse di Chrome DevTools untuk mengecek performa, aksesibilitas, dan status PWA.
3. **Service Worker**: Jika ragu, matikan Service Worker sementara dengan mencentang "Bypass for network" di tab Application > Service Workers.
