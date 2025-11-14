/* eslint-disable no-console */

const swRegister = async () => {
  // Pastikan browser mendukung service worker
  if (!('serviceWorker' in navigator)) {
    console.warn('⚠️ Service Worker tidak didukung di browser ini.');
    return;
  }

  // Abaikan pendaftaran SW di mode development HTTPS
  const isLocalhost = Boolean(
    window.location.hostname === 'localhost' ||
    window.location.hostname === '[::1]' ||
    window.location.hostname.match(/^127(?:\.\d{1,3}){3}$/)
  );

  if (isLocalhost) {
    console.log('🧩 Mode development terdeteksi (localhost). SW tetap dijalankan untuk testing.');
  }

  try {
    // Path service worker harus sesuai dengan hasil build webpack
    const registration = await navigator.serviceWorker.register('/sw.js');

    console.log('✅ Service Worker registered successfully.');
    console.log('Scope:', registration.scope);

    // Deteksi jika ada update SW baru
    registration.onupdatefound = () => {
      const installingWorker = registration.installing;
      if (installingWorker) {
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              console.log('🔄 Update baru tersedia untuk Service Worker.');
              // Kirim pesan agar SW baru segera aktif tanpa reload manual
              installingWorker.postMessage({ type: 'SKIP_WAITING' });
              // Setelah skip waiting, reload halaman otomatis agar gunakan SW baru
              installingWorker.addEventListener('statechange', () => {
                if (installingWorker.state === 'activated') {
                  window.location.reload();
                }
              });
            } else {
              console.log('🎉 Service Worker siap untuk penggunaan offline.');
            }
          }
        };
      }
    };

    // Log jika ada SW aktif
    if (navigator.serviceWorker.controller) {
      console.log('💡 Active Service Worker found.');
    }

  } catch (error) {
    console.error('❌ Service Worker registration failed:', error);
    // Jika error karena "storage" atau permission, tangani gracefully
    if (error.message && error.message.includes('storage')) {
      console.warn('⚠️ Failed to access storage. Coba clear site data dari Application tab.');
    }
  }
};

export default swRegister;
