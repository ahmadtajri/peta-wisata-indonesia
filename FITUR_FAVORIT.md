# Fitur Favorit dengan IndexedDB

## Deskripsi
Fitur ini memungkinkan pengguna untuk menyimpan destinasi wisata favorit mereka menggunakan IndexedDB. Data favorit disimpan secara lokal di browser pengguna dan dapat diakses bahkan saat offline.

## Fitur yang Diimplementasikan

### 1. **IndexedDB Helper** (`src/scripts/utils/idb-helper.js`)
- **Create**: `addFavorite(story)` - Menambahkan story ke favorit
- **Read**: `getAllFavorites()` - Mendapatkan semua favorit
- **Read**: `getFavorite(id)` - Mendapatkan satu favorit berdasarkan ID
- **Delete**: `deleteFavorite(id)` - Menghapus favorit berdasarkan ID
- **Utility**: `isFavorite(id)` - Mengecek apakah story sudah difavoritkan
- **Utility**: `toggleFavorite(story)` - Toggle status favorit

### 2. **Tombol Favorit di Home Page**
- Tombol heart (❤️/🤍) di pojok kanan atas setiap story card
- Toggle antara filled heart (❤️) untuk favorit dan outline heart (🤍) untuk non-favorit
- Animasi smooth saat di-hover dan di-klik
- Notifikasi toast saat berhasil menambah/menghapus favorit

### 3. **Halaman Favorit** (`src/scripts/pages/favorites/favorites-page.js`)
- Menampilkan semua destinasi wisata yang sudah difavoritkan
- Peta interaktif yang menampilkan marker untuk setiap favorit
- Grid layout untuk daftar favorit
- Tombol hapus untuk setiap item favorit
- Empty state yang menarik jika belum ada favorit
- Counter jumlah favorit

### 4. **Navigasi**
- Link "❤️ Favorit" ditambahkan ke menu navigasi
- Route `/favorites` untuk mengakses halaman favorit

## Cara Penggunaan

### Menambahkan ke Favorit
1. Buka halaman Beranda
2. Klik tombol heart (🤍) di pojok kanan atas story card
3. Heart akan berubah menjadi filled (❤️) dan muncul notifikasi sukses

### Melihat Favorit
1. Klik menu "❤️ Favorit" di navigasi
2. Semua destinasi favorit akan ditampilkan
3. Marker favorit juga ditampilkan di peta

### Menghapus dari Favorit
**Cara 1**: Di halaman Beranda
- Klik tombol heart yang sudah filled (❤️)
- Heart akan berubah menjadi outline (🤍)

**Cara 2**: Di halaman Favorit
- Klik tombol "🗑️ Hapus" pada story card
- Konfirmasi penghapusan
- Item akan dihapus dari daftar

## Struktur Data IndexedDB

**Database Name**: `peta-wisata-db`
**Object Store**: `favorites`
**Key Path**: `id`

**Data Structure**:
```javascript
{
  id: string,           // ID unik dari story
  name: string,         // Nama destinasi
  description: string,  // Deskripsi destinasi
  photoUrl: string,     // URL foto
  lat: number,          // Latitude
  lon: number,          // Longitude
  createdAt: string     // Timestamp ISO
}
```

## Teknologi yang Digunakan
- **idb**: Library wrapper untuk IndexedDB API yang lebih mudah digunakan
- **IndexedDB**: Browser storage untuk menyimpan data terstruktur
- **Leaflet**: Library untuk menampilkan peta interaktif

## Styling
- Tombol favorit menggunakan glassmorphism effect
- Animasi smooth untuk semua interaksi
- Responsive design untuk mobile dan desktop
- Notifikasi toast dengan slide-in/slide-out animation

## File yang Dimodifikasi/Dibuat
1. ✅ `src/scripts/utils/idb-helper.js` (BARU)
2. ✅ `src/scripts/pages/favorites/favorites-page.js` (BARU)
3. ✅ `src/scripts/pages/home/home-page.js` (DIMODIFIKASI)
4. ✅ `src/scripts/routes/routes.js` (DIMODIFIKASI)
5. ✅ `src/index.html` (DIMODIFIKASI)
6. ✅ `src/styles/styles.css` (DIMODIFIKASI)
7. ✅ `package.json` (DIMODIFIKASI - tambah dependency `idb`)

## Testing
Untuk menguji fitur ini:
1. Jalankan aplikasi dengan `npm run dev`
2. Login ke aplikasi
3. Tambahkan beberapa destinasi ke favorit
4. Buka halaman Favorit
5. Coba hapus dari favorit
6. Refresh browser - favorit tetap tersimpan (persistensi data)
7. Buka DevTools > Application > IndexedDB untuk melihat data tersimpan
