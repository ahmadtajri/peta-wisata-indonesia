// Import global stylesheet agar Webpack memproses CSS
import '../styles/styles.css';

// Import App utama dan service worker register
import App from './pages/app.js';
import swRegister from './utils/sw-register.js';
import NotificationHelper from './utils/notification-helper.js';

// Debugging awal
console.log('App initialized...');

// Instance global app
let app;

// ========================================
// Update Navigation Status
// ========================================
const updateNav = () => {
  const user = JSON.parse(localStorage.getItem('dicoding_story_user') || 'null');
  const nav = document.querySelector('#nav-links');
  
  if (!nav) return;
  
  if (user) {
    nav.classList.add('logged-in');
    nav.classList.remove('logged-out');
  } else {
    nav.classList.add('logged-out');
    nav.classList.remove('logged-in');
  }
};

// ========================================
// Initialize App
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  // Update navigation status
  updateNav();
  
  // Ambil elemen utama untuk inisialisasi App
  app = new App({
    button: document.querySelector('#hamburgerButton'),
    drawer: document.querySelector('#navigationDrawer'),
    content: document.querySelector('#main-content'),
  });

  // Logout handler
  const logoutBtn = document.querySelector('#logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (confirm('Apakah Anda yakin ingin logout?')) {
        localStorage.clear();
        window.location.hash = '/';
        updateNav();
      }
    });
  }

  // Render ulang setiap kali hash berubah
  window.addEventListener('hashchange', async () => {
    console.log('Route changed:', window.location.hash);
    await app.renderPage();
    updateNav(); // Update nav setiap kali route berubah
  });

  // Render halaman awal setelah halaman selesai dimuat
  window.addEventListener('load', async () => {
    console.log('Window loaded, rendering initial page...');
    await app.renderPage();
    
    // Register Service Worker
    await swRegister();
    
    // 🔔 Initialize Push Notification UI (OPTIONAL)
    try {
      await NotificationHelper.init();
      console.log('✅ Notification helper initialized');
    } catch (error) {
      console.warn('⚠️ Notification helper failed to initialize:', error);
    }
  });
});