# URGENT: Rebuild Required!

## 🚨 Masalah: Event Listener Tidak Terpasang

Jika link di drawer hanya "hiasan" dan tidak ada action, kemungkinan:

1. **Webpack belum rebuild** - File JavaScript lama masih digunakan
2. **Browser cache** - Browser masih menggunakan file lama
3. **Service Worker cache** - SW masih serve file lama

---

## ✅ SOLUSI: Rebuild & Clear Cache

### Step 1: Stop Development Server

Jika server sedang running, **STOP** dengan `Ctrl+C`

### Step 2: Clean Build

```bash
# Hapus folder dist/docs
rm -rf dist docs

# Atau di Windows:
rmdir /s /q dist
rmdir /s /q docs
```

### Step 3: Rebuild

```bash
# Development mode
npm run start-dev

# ATAU Production mode
npm run build
npm run serve
```

### Step 4: Hard Refresh Browser

**Chrome/Edge:**
- Windows: `Ctrl + Shift + R` atau `Ctrl + F5`
- Mac: `Cmd + Shift + R`

**Firefox:**
- Windows: `Ctrl + Shift + R` atau `Ctrl + F5`
- Mac: `Cmd + Shift + R`

### Step 5: Clear Service Worker Cache

1. Buka **DevTools** (F12)
2. Go to **Application** tab
3. Click **Service Workers** di sidebar
4. Click **Unregister** untuk service worker
5. Click **Clear storage** di sidebar
6. Check **Unregister service workers**
7. Check **Cache storage**
8. Click **Clear site data**
9. **Reload** page

---

## 🔍 Debugging: Check Console

Setelah rebuild dan hard refresh, buka Console dan cari:

```
✅ Expected Output:
🚀 DrawerInitiator.init called
📍 Button: <button id="hamburgerButton">
📍 Drawer: <nav id="navigationDrawer">
📍 Content: <main id="main-content">
🎨 Creating overlay...
✨ Overlay created and event listener attached
📱 Event delegation set up on drawer
✅ Drawer initialized successfully
```

**Jika TIDAK muncul:**
- Webpack belum rebuild
- File tidak ter-update
- Import path salah

**Jika muncul tapi link tidak work:**
- Check apakah ada error di console
- Check apakah link punya attribute `data-link`
- Check apakah event delegation bekerja

---

## 🧪 Test Event Delegation

Buka Console dan jalankan:

```javascript
// Test 1: Check if drawer exists
console.log('Drawer:', document.querySelector('#navigationDrawer'));

// Test 2: Check if links exist
console.log('Links:', document.querySelectorAll('#navigationDrawer a[data-link]'));

// Test 3: Manual click test
const drawer = document.querySelector('#navigationDrawer');
drawer.addEventListener('click', (e) => {
  console.log('Drawer clicked!', e.target);
  const link = e.target.closest('a[data-link]');
  if (link) {
    console.log('Link found:', link.href);
  }
});
```

Kemudian klik link di drawer. Harus muncul log.

---

## 📋 Checklist

- [ ] Stop development server
- [ ] Delete dist/docs folders
- [ ] Run `npm run start-dev` atau `npm run build`
- [ ] Hard refresh browser (Ctrl+Shift+R)
- [ ] Clear Service Worker cache
- [ ] Clear browser cache
- [ ] Check console for initialization logs
- [ ] Test hamburger button
- [ ] Test navigation links
- [ ] Check if drawer closes after navigation

---

## 🔧 Alternative: Manual Test

Jika masih tidak work, test manual di Console:

```javascript
// Force close drawer
const drawer = document.querySelector('#navigationDrawer');
drawer.classList.remove('open');
document.getElementById('drawer-overlay')?.classList.remove('open');
document.body.style.overflow = '';

// Force navigate
window.location.hash = '#/about';
```

---

## 📞 If Still Not Working

Jika setelah rebuild masih tidak work, kemungkinan:

1. **Import path salah** - Check `src/scripts/index.js`
2. **Webpack config issue** - Check `webpack.config.js`
3. **HTML structure berbeda** - Check `src/templates/index.html`

Share console output untuk debugging lebih lanjut!

---

**IMPORTANT**: Pastikan untuk **rebuild** dan **hard refresh** sebelum test!
