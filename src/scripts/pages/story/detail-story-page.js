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
    console.log('[DetailStoryPage] Resource:', url.resource);
    console.log('[DetailStoryPage] ID from parser:', url.id);

    // Ambil ID langsung dari hash sebagai fallback
    const hashParts = rawHash.replace('#/', '').split('/');
    const idFromHash = hashParts[1]; // story/ID -> ambil index 1
    
    console.log('[DetailStoryPage] Hash parts:', hashParts);
    console.log('[DetailStoryPage] ID from hash:', idFromHash);

    // Gunakan ID dari hash langsung, bukan dari parser
    const id = idFromHash || url.id;

    console.log('[DetailStoryPage] Final Story ID to fetch:', id);

    if (!id) {
      document.querySelector('#story-detail').innerHTML = `
        <h1>Detail Cerita</h1>
        <p class="text-red-600">❌ ID cerita tidak ditemukan di URL.</p>
        <p class="text-gray-600">URL: ${rawHash}</p>
        <a href="#/" class="inline-block mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition">
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

      const { name, description, photoUrl, lat, lon } = story;

      document.querySelector('#story-detail').innerHTML = `
        <h1 class="text-3xl font-bold text-gray-800 mb-6">${name}</h1>
        <div class="story-card">
          <img src="${photoUrl}" alt="${name}" class="story-image"/>
          <div class="story-info">
            <h2 class="text-xl font-semibold mb-3">Deskripsi</h2>
            <p class="mb-4">${description}</p>
            ${lat && lon ? `
              <h2 class="text-xl font-semibold mb-3">Lokasi</h2>
              <div id="map-detail" class="map-container"></div>
            ` : ''}
            <a href="#/" class="inline-block mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition">
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
        <h1>Detail Cerita</h1>
        <div class="text-center py-10">
          <p class="text-red-600 mb-4">❌ Gagal memuat detail cerita.</p>
          <p class="text-gray-600 mb-2"><strong>Error:</strong> ${error.message}</p>
          <p class="text-gray-600 mb-2"><strong>Story ID:</strong> ${id}</p>
          <p class="text-gray-600 mb-4"><strong>URL:</strong> ${rawHash}</p>
          <a href="#/" class="inline-block bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition">
            ← Kembali ke Beranda
          </a>
        </div>
      `;
    }
  },
};

export default DetailStoryPage;