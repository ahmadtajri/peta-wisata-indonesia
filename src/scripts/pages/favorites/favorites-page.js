import FavoriteIDB from '../../utils/idb-helper.js';
import CONFIG from '../../config.js';

const FavoritesPage = {
    async render() {
        return `
      <section class="favorites-page">
        <div class="page-header">
          <h2>❤️ Favorit Saya</h2>
          <p>Daftar destinasi wisata yang telah Anda simpan sebagai favorit</p>
        </div>

        <div id="favorites-map" class="map-container"></div>

        <div class="section-header" style="margin-bottom: 2rem;">
          <h3 style="font-size: 1.75rem; color: var(--text-main);">📌 Daftar Favorit</h3>
          <span id="favorites-count" class="badge">0 Favorit</span>
        </div>

        <div id="favorites-list" class="story-list"></div>
      </section>
    `;
    },

    async afterRender() {
        console.log('FavoritesPage afterRender called');

        // Inisialisasi map
        const map = L.map('favorites-map').setView(
            CONFIG.MAP_CONFIG.DEFAULT_COORDINATE,
            CONFIG.MAP_CONFIG.DEFAULT_ZOOM
        );
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map);

        // Load favorites dari IndexedDB
        await this._loadFavorites(map);
    },

    async _loadFavorites(map) {
        const favoritesList = document.querySelector('#favorites-list');
        const favoritesCount = document.querySelector('#favorites-count');

        try {
            const favorites = await FavoriteIDB.getAllFavorites();
            console.log('Favorites loaded:', favorites);

            if (!favorites || favorites.length === 0) {
                favoritesList.innerHTML = `
          <div class="empty-state">
            <div style="font-size: 4rem; margin-bottom: 1rem;">💔</div>
            <h3 style="color: var(--text-main); margin-bottom: 0.5rem;">Belum Ada Favorit</h3>
            <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">
              Anda belum menyimpan destinasi wisata apapun sebagai favorit.
            </p>
            <a href="#/" class="btn-primary" style="text-decoration: none; display: inline-block;">
              Jelajahi Destinasi
            </a>
          </div>
        `;
                favoritesCount.textContent = '0 Favorit';
                return;
            }

            // Update count
            favoritesCount.textContent = `${favorites.length} Favorit`;

            // Clear list
            favoritesList.innerHTML = '';

            // Render each favorite
            favorites.forEach((story) => {
                const storyElement = document.createElement('div');
                storyElement.classList.add('story-card');
                storyElement.dataset.storyId = story.id;

                storyElement.innerHTML = `
          <img src="${story.photoUrl}" alt="${story.name}" loading="lazy" />
          <div class="story-info">
            <h3>${story.name}</h3>
            <p>${story.description.substring(0, 100)}...</p>
            <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
              <a href="#/story/${story.id}" class="btn-secondary" style="text-decoration: none; flex: 1; text-align: center;">
                Lihat Detail
              </a>
              <button class="btn-remove-favorite" data-id="${story.id}" style="background: #ef4444; color: white; border: none; padding: 0.75rem 1rem; border-radius: 0.5rem; cursor: pointer; font-weight: 500;">
                🗑️ Hapus
              </button>
            </div>
          </div>
        `;

                favoritesList.appendChild(storyElement);

                // Add marker to map
                if (story.lat && story.lon) {
                    L.marker([story.lat, story.lon])
                        .addTo(map)
                        .bindPopup(`
              <div class="leaflet-popup-content">
                <img src="${story.photoUrl}" alt="${story.name}" />
                <h4>${story.name}</h4>
                <p>${story.description.substring(0, 80)}...</p>
                <a href="#/story/${story.id}">Lihat Detail</a>
              </div>
            `);
                }
            });

            // Add event listeners for remove buttons
            this._initRemoveButtons(map);
        } catch (error) {
            console.error('Error loading favorites:', error);
            favoritesList.innerHTML = `
        <div class="error-message">
          <p>Gagal memuat favorit. Silakan coba lagi.</p>
        </div>
      `;
        }
    },

    _initRemoveButtons(map) {
        const removeButtons = document.querySelectorAll('.btn-remove-favorite');

        removeButtons.forEach((button) => {
            button.addEventListener('click', async (e) => {
                const storyId = e.target.dataset.id;

                // Konfirmasi sebelum menghapus
                const confirmed = confirm('Apakah Anda yakin ingin menghapus dari favorit?');

                if (confirmed) {
                    try {
                        await FavoriteIDB.deleteFavorite(storyId);

                        // Show success message
                        this._showNotification('Berhasil dihapus dari favorit!', 'success');

                        // Reload favorites
                        await this._loadFavorites(map);
                    } catch (error) {
                        console.error('Error removing favorite:', error);
                        this._showNotification('Gagal menghapus dari favorit', 'error');
                    }
                }
            });
        });
    },

    _showNotification(message, type = 'info') {
        // Simple notification
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
      position: fixed;
      top: 80px;
      right: 20px;
      background: ${type === 'success' ? '#10b981' : '#ef4444'};
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

export default FavoritesPage;
