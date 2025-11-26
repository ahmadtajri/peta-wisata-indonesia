import API from '../../data/api.js';
import CONFIG from '../../config.js';

const HomePage = {
  async render() {
    return `
      <section class="home-page">
        <h2>🌏 Peta Lokasi Wisata Indonesia</h2>
        <p>
          Temukan dan jelajahi berbagai destinasi wisata menarik di seluruh Indonesia, lengkap dengan lokasi peta dan cerita dari para wisatawan.
        </p>

        <div id="map-home" class="map-container"></div>

        <div class="section-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
          <h3 style="font-size: 1.75rem; color: var(--text-main);">🗺️ Daftar Lokasi Wisata</h3>
          <a href="#/add-story" class="btn-primary" style="width: auto; padding: 0.75rem 1.5rem; text-decoration: none;">
            + Tambah Cerita
          </a>
        </div>

        <div id="story-list" class="story-list"></div>
      </section>
    `;
  },

  async afterRender() {
    console.log('HomePage afterRender called');

    // Inisialisasi map
    const map = L.map('map-home').setView(
      CONFIG.MAP_CONFIG.DEFAULT_COORDINATE,
      CONFIG.MAP_CONFIG.DEFAULT_ZOOM
    );
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    // Ambil data story dari API
    try {
      const stories = await API.getAllStories();
      console.log('Stories fetched:', stories);

      const storyList = document.querySelector('#story-list');

      if (!stories || stories.length === 0) {
        storyList.innerHTML = `
          <div class="error-message">
            Tidak ada cerita ditemukan.
          </div>
        `;
        return;
      }

      // Render setiap story
      stories.forEach((story) => {
        const storyElement = document.createElement('div');
        storyElement.classList.add('story-card');

        // 🔥 PERBAIKAN: Cek format ID dari API
        const storyId = story.id;
        console.log('Story ID from API:', storyId);

        storyElement.innerHTML = `
          <img src="${story.photoUrl}" alt="${story.name}" loading="lazy" />
          <div class="story-info">
            <h3>${story.name}</h3>
            <p>${story.description.substring(0, 100)}...</p>
            <a href="#/story/${storyId}" data-story-id="${storyId}">
               Lihat Detail
            </a>
          </div>
        `;

        storyList.appendChild(storyElement);

        // Tambahkan marker ke peta
        if (story.lat && story.lon) {
          L.marker([story.lat, story.lon])
            .addTo(map)
            .bindPopup(`
              <div class="leaflet-popup-content">
                <img src="${story.photoUrl}" alt="${story.name}" />
                <h4>${story.name}</h4>
                <p>${story.description.substring(0, 80)}...</p>
                <a href="#/story/${storyId}">Lihat Detail</a>
              </div>
            `);
        }
      });
    } catch (error) {
      console.error('Error in HomePage:', error);
      const storyList = document.querySelector('#story-list');

      if (error.message && error.message.includes('Invalid token')) {
        storyList.innerHTML = `
          <div class="text-center py-10">
            <p class="text-red-600 font-medium mb-2">Token login tidak valid. Silakan login ulang.</p>
            <a href="#/login" class="text-blue-600 hover:text-blue-800 underline">Login di sini</a>
          </div>
        `;
        localStorage.removeItem('token');
      } else {
        storyList.innerHTML = '<p class="text-center text-gray-500 py-10">Gagal memuat cerita.</p>';
      }
    }
  },
};

export default HomePage;