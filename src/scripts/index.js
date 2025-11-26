import '../styles/styles.css';
import App from './pages/app.js';
import swRegister from './utils/sw-register.js';
import NotificationHelper from './utils/notification-helper.js';
import InstallPrompt from './utils/install-prompt.js';

console.log('App initialized...');

let app;

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

document.addEventListener('DOMContentLoaded', () => {
  updateNav();
  
  app = new App({
    button: document.querySelector('#hamburgerButton'),
    drawer: document.querySelector('#navigationDrawer'),
    content: document.querySelector('#main-content'),
  });

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

  window.addEventListener('hashchange', async () => {
    console.log('Route changed:', window.location.hash);
    await app.renderPage();
    updateNav();
  });

  window.addEventListener('load', async () => {
    console.log('Window loaded');
    await app.renderPage();
    
    // 🔥 Register Service Worker
    await swRegister();
    
    // 🔔 Initialize Push Notification (optional)
    try {
      await NotificationHelper.init();
    } catch (error) {
      console.warn('Notification init failed:', error);
    }
    
    // 📱 Initialize Install Prompt
    InstallPrompt.init();
  });
});