import API from '../../data/api.js';
import CONFIG from '../../config.js';
import FavoriteIDB from '../../utils/idb-helper.js';

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
          <div style="display: flex; gap: 1rem; align-items: center;">
            <button id="reload-btn" class="btn-secondary" style="padding: 0.75rem 1.5rem; background-color: #64748b; color: white; border: none; border-radius: 0.5rem; cursor: pointer; display: flex; align-items: center; gap: 0.5rem;">
              🔄 Reload
            </button>
            <a href="#/add-story" class="btn-primary" style="width: auto; padding: 0.75rem 1.5rem; text-decoration: none;">
              + Tambah Cerita
            </a>
          </div>
        </div>

        <div id="story-list" class="story-list"></div>
      </section>
    `;
  },

  async afterRender() {
    console.log('HomePage afterRender called');

    // Inisialisasi map
    this.map = L.map('map-home').setView(
      CONFIG.MAP_CONFIG.DEFAULT_COORDINATE,
      CONFIG.MAP_CONFIG.DEFAULT_ZOOM
    );
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(this.map);

    this.markerLayer = L.layerGroup().addTo(this.map);

    // Setup Reload Button
    const reloadBtn = document.querySelector('#reload-btn');
    if (reloadBtn) {
      reloadBtn.addEventListener('click', async () => {
        reloadBtn.disabled = true;
        reloadBtn.innerHTML = '🔄 Loading...';
        await this._loadStories();
        reloadBtn.disabled = false;
        reloadBtn.innerHTML = '🔄 Reload';
      });
    }

    await this._loadStories();
  },

  async _loadStories() {
    try {
      const stories = await API.getAllStories();
      console.log('Stories fetched:', stories);

      const storyList = document.querySelector('#story-list');
      storyList.innerHTML = ''; // Clear list
      this.markerLayer.clearLayers(); // Clear markers

      if (!stories || stories.length === 0) {
        storyList.innerHTML = `
          <div class="error-message">
            Tidak ada cerita ditemukan.
          </div>
        `;
        return;
      }

      // Render setiap story
      for (const story of stories) {
        const storyElement = document.createElement('div');
        storyElement.classList.add('story-card');

        const storyId = story.id;

        // Check if already favorited
        const isFavorited = await FavoriteIDB.isFavorite(storyId);
        const heartIcon = isFavorited ? '❤️' : '🤍';

        storyElement.innerHTML = `
          <div style="position: absolute; top: 10px; right: 10px; z-index: 10;">
            <button class="favorite-btn" data-story-id="${storyId}" aria-label="Toggle favorite" style="background: rgba(255, 255, 255, 0.9); border: none; border-radius: 50%; width: 40px; height: 40px; display: flex; justify-content: center; align-items: center; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
              <span class="heart-icon" style="font-size: 1.2rem;">${heartIcon}</span>
            </button>
          </div>
          <img src="${story.photoUrl}" alt="${story.name}" loading="lazy" />
          <div class="story-info">
            <h3>${story.name}</h3>
            <span class="story-date">${new Date(story.createdAt).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}</span>
            <p>${story.description.substring(0, 100)}...</p>
            <a href="#/story/${storyId}" data-story-id="${storyId}">
               Lihat Detail
            </a>
          </div>
        `;

        storyList.appendChild(storyElement);

        // Add favorite button event listener
        const favoriteBtn = storyElement.querySelector('.favorite-btn');
        favoriteBtn.addEventListener('click', async (e) => {
          e.preventDefault();
          e.stopPropagation();

          try {
            const isNowFavorited = await FavoriteIDB.toggleFavorite(story);
            const heartIcon = favoriteBtn.querySelector('.heart-icon');
            heartIcon.textContent = isNowFavorited ? '❤️' : '🤍';

            // Show notification
            this._showNotification(
              isNowFavorited ? 'Ditambahkan ke favorit!' : 'Dihapus dari favorit!',
              isNowFavorited ? 'success' : 'info'
            );
          } catch (error) {
            console.error('Error toggling favorite:', error);
            this._showNotification('Gagal mengubah favorit', 'error');
          }
        });

        // Tambahkan marker ke peta
        if (story.lat && story.lon) {
          L.marker([story.lat, story.lon])
            .addTo(this.markerLayer)
            .bindPopup(`
              <div class="leaflet-popup-content">
                <img src="${story.photoUrl}" alt="${story.name}" />
                <h4>${story.name}</h4>
                <p>${story.description.substring(0, 80)}...</p>
                <a href="#/story/${storyId}">Lihat Detail</a>
              </div>
            `);
        }
      }
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

  _showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 80px;
      right: 20px;
      background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 0.5rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      z-index: 10000;
      animation: slideIn 0.3s ease-out;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  },
};

export default HomePage;