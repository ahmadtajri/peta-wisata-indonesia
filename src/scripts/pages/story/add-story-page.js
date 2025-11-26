import API from '../../data/api.js';
import { getUser } from '../../utils/storage.js';
import { initMapPicker } from '../../utils/leaflet-init.js';

const AddStoryPage = {
  async render() {
    return `
      <section class="add-story-page">
        <h2>Tambah Cerita Baru</h2>
        <h2 class="sr-only">Form Tambah Cerita Wisata</h2>
        <form id="storyForm" class="story-form" enctype="multipart/form-data">
          <div class="form-group">
            <label for="description">Deskripsi</label>
            <textarea id="description" rows="4" placeholder="Tuliskan cerita anda..." required aria-required="true"></textarea>
          </div>
          <div class="form-group">
            <label for="photo">Unggah Foto</label>
            <input id="photo" type="file" accept="image/*" required aria-required="true" />
          </div>
          <div class="form-group">
            <label>Pilih Lokasi di Peta</label>
            <div id="map-add" class="map-select" role="application" aria-label="Peta untuk memilih lokasi"></div>
          </div>
          <button type="submit" class="btn-primary">Kirim Cerita</button>
        </form>
      </section>
    `;
  },

  async afterRender() {
    const user = getUser();
    if (!user || !user.token) {
      alert('Silakan login terlebih dahulu untuk menambahkan cerita.');
      window.location.hash = '/login';
      return;
    }

    let selectedLat = null;
    let selectedLng = null;
    const map = initMapPicker('map-add', (lat, lng) => {
      selectedLat = lat;
      selectedLng = lng;
    });

    const form = document.querySelector('#storyForm');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const description = document.querySelector('#description').value.trim();
      const photoInput = document.querySelector('#photo').files[0];

      if (!description || !photoInput || !selectedLat || !selectedLng) {
        alert('Semua kolom wajib diisi, termasuk lokasi!');
        return;
      }

      try {
        const response = await API.addStory({
          description,
          photo: photoInput,
          lat: selectedLat,
          lon: selectedLng
        });

        if (!response.error) {
          // ✅ TRIGGER NOTIFICATION
          await this.showSuccessNotification(description);

          alert('Cerita berhasil ditambahkan!');
          window.location.hash = '/';
        } else {
          alert(`Gagal: ${response.message}`);
        }
      } catch (error) {
        alert('Terjadi kesalahan.');
        console.error(error);
      }
    });
  },

  // ========================================
  // Show Success Notification
  // ========================================
  async showSuccessNotification(description) {
    try {
      // Check if browser supports notifications
      if (!('Notification' in window)) {
        console.warn('Browser tidak support notifikasi');
        return;
      }

      // Check permission
      let permission = Notification.permission;

      if (permission === 'default') {
        permission = await Notification.requestPermission();
      }

      if (permission !== 'granted') {
        console.warn('Notifikasi tidak diizinkan');
        return;
      }

      // Get service worker registration
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;

        // Show notification via service worker
        await registration.showNotification('Cerita Berhasil Ditambahkan! 🎉', {
          body: description.substring(0, 100) + '...',
          icon: '/public/icons/icon-192x192.png',
          badge: '/public/icons/icon-192x192.png',
          tag: 'story-added',
          requireInteraction: false,
          vibrate: [200, 100, 200],
          data: {
            url: '/#/',
            timestamp: Date.now(),
          },
          actions: [
            {
              action: 'view',
              title: '👁️ Lihat Cerita',
            },
            {
              action: 'close',
              title: '❌ Tutup',
            },
          ],
        });

        console.log('✅ Notifikasi ditampilkan');
      }
    } catch (error) {
      console.error('Error showing notification:', error);
    }
  },
};

export default AddStoryPage;