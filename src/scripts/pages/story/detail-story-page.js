import API from '../../data/api.js';
import UrlParser from '../../routes/url-parser.js';
import { initMapForStory } from '../../utils/leaflet-init.js';

const DetailStoryPage = {
  async render() {
    return `
      <section class="detail-story-page">
        <div id="story-detail" class="story-detail">
          <div class="text-center py-10">
            <p>Memuat detail cerita...</p>
          </div>
        </div>
      </section>
    `;
  },

  async afterRender() {
    const url = UrlParser.parseActiveUrlWithoutCombiner();
    const rawHash = window.location.hash;

    console.log('[DetailStoryPage] Raw Hash:', rawHash);
    console.log('[DetailStoryPage] Parsed URL:', url);

    // Ambil ID langsung dari hash sebagai fallback
    const hashParts = rawHash.replace('#/', '').split('/');
    const idFromHash = hashParts[1]; // story/ID -> ambil index 1
    const id = idFromHash || url.id;

    console.log('[DetailStoryPage] Final Story ID to fetch:', id);

    if (!id) {
      document.querySelector('#story-detail').innerHTML = `
        <h2>Detail Cerita</h2>
        <p class="error-message">❌ ID cerita tidak ditemukan di URL.</p>
        <p class="text-muted">URL: ${rawHash}</p>
        <a href="#/" class="btn-primary" style="display: inline-block; width: auto; margin-top: 1rem; text-decoration: none;">
          ← Kembali ke Beranda
        </a>
      `;
      return;
    }

    try {
      console.log('[DetailStoryPage] Fetching story with ID:', id);
      const story = await API.getStoryDetail(id);

      if (!story) {
        throw new Error('Cerita tidak ditemukan di server.');
      }

      const { name, description, photoUrl, lat, lon, createdAt } = story;

      document.querySelector('#story-detail').innerHTML = `
        <h2>${name}</h2>
        <div class="story-card detail-content">
          <img src="${photoUrl}" alt="${name}" class="story-image"/>
          <div class="story-info">
            <span class="story-date" style="font-size: 1rem; margin-bottom: 1.5rem;">
              📅 ${new Date(createdAt).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })}
            </span>
            <h3>Deskripsi</h3>
            <p>${description}</p>
            ${lat && lon ? `
              <h3>Lokasi</h3>
              <div id="map-detail" class="map-container"></div>
            ` : ''}
            <a href="#/" class="btn-primary" style="display: inline-block; width: auto; margin-top: 1.5rem; text-decoration: none;">
              ← Kembali ke Beranda
            </a>
          </div>
        </div>
      `;

      if (lat && lon) {
        // Tunggu sedikit agar DOM sudah ready
        setTimeout(() => {
          initMapForStory(lat, lon, 'map-detail');
        }, 100);
      }

      console.log('[DetailStoryPage] ✅ Cerita berhasil dimuat:', name);
    } catch (error) {
      console.error('[DetailStoryPage] ❌ Gagal memuat detail:', error);
      document.querySelector('#story-detail').innerHTML = `
        <h2>Detail Cerita</h2>
        <div class="text-center py-10">
          <p class="error-message">❌ Gagal memuat detail cerita.</p>
          <p class="text-muted"><strong>Error:</strong> ${error.message}</p>
          <p class="text-muted"><strong>Story ID:</strong> ${id}</p>
          <p class="text-muted"><strong>URL:</strong> ${rawHash}</p>
          <a href="#/" class="btn-primary" style="display: inline-block; width: auto; margin-top: 1rem; text-decoration: none;">
            ← Kembali ke Beranda
          </a>
        </div>
      `;
    }
  },
};

export default DetailStoryPage;