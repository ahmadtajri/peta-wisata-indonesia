// Import global stylesheet agar Webpack memproses CSS
import '../styles/styles.css';

// Import App utama dan service worker register
import App from './pages/app.js';
import swRegister from './utils/sw-register.js';

// Debugging awal
console.log('App initialized...');

// Instance global app
let app;

// Jalankan setelah DOM siap
document.addEventListener('DOMContentLoaded', () => {
  // Ambil elemen utama untuk inisialisasi App
  app = new App({
    button: document.querySelector('#hamburgerButton'),
    drawer: document.querySelector('#navigationDrawer'),
    content: document.querySelector('#main-content'),
  });

  // Render ulang setiap kali hash berubah
  window.addEventListener('hashchange', async () => {
    console.log('Route changed:', window.location.hash);
    await app.renderPage();
  });

  // Render halaman awal setelah halaman selesai dimuat
  window.addEventListener('load', async () => {
    console.log('Window loaded, rendering initial page...');
    await app.renderPage();
    swRegister();
  });
});

const updateNav = () => {
      const user = JSON.parse(localStorage.getItem('dicoding_story_user') || 'null');
      const nav = document.querySelector('#nav-links');
      if (user) {
        nav.classList.add('logged-in');
        nav.classList.remove('logged-out');
      } else {
        nav.classList.add('logged-out');
        nav.classList.remove('logged-in');
      }
    };
    document.addEventListener('DOMContentLoaded', updateNav);
    window.addEventListener('hashchange', updateNav);
    document.querySelector('#logout-btn')?.addEventListener('click', () => {
      localStorage.clear();
      window.location.hash = '/';
      updateNav();
    });