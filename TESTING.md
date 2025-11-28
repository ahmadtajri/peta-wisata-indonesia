# 🧪 Panduan Testing Aplikasi - Step by Step

## ✅ CHECKLIST TESTING

### 📍 **TEST 1: Development Mode**

#### Langkah-langkah:

1. **Jalankan Development Server**
   ```bash
   npm start
   ```

2. **Tunggu hingga muncul:**
   ```
   webpack compiled successfully
   Project is running at http://localhost:9000/
   ```

3. **Buka Browser**
   - Otomatis terbuka atau buka manual: `http://localhost:9000`

4. **Cek di Browser:**
   - [ ] Halaman loading dengan benar
   - [ ] Tidak ada error di console (F12)
   - [ ] Bisa login
   - [ ] Bisa lihat daftar story
   - [ ] Peta muncul dengan marker
   - [ ] Tombol favorite berfungsi
   - [ ] Tombol reload berfungsi

5. **Test Hot Reload:**
   - Ubah file CSS atau JS
   - Simpan file
   - Browser auto-reload
   - Perubahan langsung terlihat

6. **Stop Server:**
   - Tekan `Ctrl + C` di terminal

---

### 📍 **TEST 2: Production Build**

#### Langkah-langkah:

1. **Build Production**
   ```bash
   npm run build
   ```

2. **Tunggu hingga selesai:**
   ```
   webpack compiled successfully
   asset main.[hash].bundle.js
   asset main.[hash].css
   ```

3. **Cek Folder dist/**
   - Buka folder `dist/`
   - Pastikan ada file:
     ```
     ✅ index.html
     ✅ sw.js
     ✅ manifest.json
     ✅ offline.html
     ✅ main.[hash].bundle.js
     ✅ main.[hash].css
     ✅ public/ (folder)
     ```

4. **Cek Ukuran File:**
   - `main.bundle.js` harus ter-minify (ukuran kecil)
   - `main.css` harus ter-extract (file terpisah)

---

### 📍 **TEST 3: Serve Production**

#### Langkah-langkah:

1. **Jalankan Production Server**
   ```bash
   npm run serve-prod
   ```

2. **Tunggu hingga muncul:**
   ```
   🚀 Production server running on http://localhost:8080
   ✅ Application is ready!
   ```

3. **Buka Browser**
   - Buka: `http://localhost:8080`

4. **Cek Aplikasi:**
   - [ ] Halaman loading dengan benar
   - [ ] Tidak ada error di console
   - [ ] Semua fitur berfungsi
   - [ ] Service Worker terdaftar

5. **Cek Service Worker:**
   - Buka DevTools (F12)
   - Tab **Application**
   - Klik **Service Workers**
   - Pastikan ada service worker aktif
   - Status: **activated and is running**

6. **Cek Caching:**
   - Tab **Network**
   - Refresh halaman (F5)
   - Lihat kolom "Size"
   - Beberapa file harus dari "ServiceWorker"

---

### 📍 **TEST 4: Offline Functionality**

#### Langkah-langkah:

1. **Buka Aplikasi** (production mode)
   ```bash
   npm run serve-prod
   ```

2. **Buka Browser:** `http://localhost:8080`

3. **Tunggu halaman fully loaded**

4. **Aktifkan Offline Mode:**
   - Buka DevTools (F12)
   - Tab **Network**
   - Centang checkbox **"Offline"**

5. **Refresh Halaman (F5)**

6. **Cek Hasil:**
   - [ ] Halaman tetap muncul (dari cache)
   - [ ] Tidak ada error "No internet"
   - [ ] Story yang sudah di-cache tetap muncul
   - [ ] Peta tetap bisa dilihat

7. **Nonaktifkan Offline:**
   - Uncheck "Offline"
   - Refresh lagi
   - Aplikasi kembali fetch data fresh

---

### 📍 **TEST 5: Push Notification**

#### Langkah-langkah:

1. **Pastikan sudah login**

2. **Klik Tombol Notifikasi (🔕)**
   - Di header aplikasi

3. **Izinkan Notification:**
   - Browser akan minta permission
   - Klik **"Allow"**

4. **Cek Console:**
   ```
   ✅ Push subscription created
   📤 Sending subscription to Dicoding API
   ✅ Subscription sent to Dicoding API
   ```

5. **Cek di DevTools:**
   - Tab **Application**
   - Klik **Push Messaging**
   - Pastikan ada subscription endpoint

6. **Test Notification (Opsional):**
   - Jalankan di console browser:
   ```javascript
   // Import module (jika perlu)
   // Atau test langsung dari Dicoding API
   ```

---

### 📍 **TEST 6: All Features**

#### Checklist Fitur:

**Authentication:**
- [ ] Register user baru
- [ ] Login dengan user
- [ ] Logout
- [ ] Token tersimpan di localStorage

**Story Management:**
- [ ] Lihat daftar story
- [ ] Klik "Lihat Detail" → Buka detail story
- [ ] Tambah story baru (dengan foto & lokasi)
- [ ] Story baru muncul di list setelah reload

**Favorites:**
- [ ] Klik tombol favorite (❤️/🤍)
- [ ] Story masuk ke halaman Favorites
- [ ] Unfavorite → Story hilang dari Favorites
- [ ] Favorite tersimpan di IndexedDB

**Map:**
- [ ] Peta muncul dengan benar
- [ ] Marker muncul di lokasi story
- [ ] Klik marker → Popup muncul
- [ ] Popup berisi info story
- [ ] Link "Lihat Detail" di popup berfungsi

**Reload:**
- [ ] Klik tombol Reload (🔄)
- [ ] Loading indicator muncul
- [ ] Data di-fetch dari API
- [ ] List dan peta di-update

**Service Worker:**
- [ ] Service Worker terdaftar
- [ ] Cache berfungsi
- [ ] Offline mode berfungsi
- [ ] Update otomatis saat ada versi baru

**Push Notification:**
- [ ] Subscribe berhasil
- [ ] Unsubscribe berhasil
- [ ] Notification permission granted
- [ ] Subscription terkirim ke API

---

## 🐛 Troubleshooting

### Error: "Port 9000 already in use"
```bash
# Matikan process yang menggunakan port
# Atau ubah port di webpack.dev.js
```

### Error: "Cannot find module"
```bash
npm install
```

### Service Worker tidak update
```bash
# Di browser:
# DevTools → Application → Service Workers → Unregister
# Refresh halaman
```

### Build gagal
```bash
# Hapus cache dan build ulang
rm -rf dist node_modules
npm install
npm run build
```

---

## ✅ Hasil Testing

Setelah semua test selesai, pastikan:

- [x] Development mode berjalan tanpa error
- [x] Production build berhasil
- [x] Production serve berjalan tanpa error
- [x] Offline mode berfungsi
- [x] Service Worker aktif
- [x] Semua fitur berfungsi normal
- [x] Push notification berfungsi

---

## 📊 Performance Check

### Cek di Lighthouse (Chrome DevTools):

1. Buka DevTools (F12)
2. Tab **Lighthouse**
3. Pilih kategori:
   - Performance
   - Accessibility
   - Best Practices
   - SEO
   - PWA
4. Klik **"Generate report"**

**Target Score:**
- Performance: > 90
- PWA: > 90
- Accessibility: > 90

---

**Selamat Testing! 🎉**
