import API from '../../data/api.js';
import CONFIG from '../../config.js';

const HomePage = {
  async render() {
    return `
      <section class="home-page px-6 md:px-12 py-10 bg-gradient-to-b from-blue-50 to-white min-h-screen">
        <div class="text-center mb-10">
          <h1 class="text-4xl md:text-5xl font-bold text-blue-700 mb-2">🌏 Peta Lokasi Wisata Indonesia</h1>
          <p class="text-gray-600 text-lg max-w-2xl mx-auto">
            Temukan dan jelajahi berbagai destinasi wisata menarik di seluruh Indonesia, lengkap dengan lokasi peta dan cerita dari para wisatawan.
          </p>
        </div>

        <div id="map-home" class="map-container h-80 md:h-[500px] rounded-2xl shadow-lg overflow-hidden mb-10"></div>

        <div class="flex items-center justify-between mb-4">
          <h2 class="text-2xl font-semibold text-gray-800">🗺️ Daftar Lokasi Wisata</h2>
          <a href="#/add-story" class="text-blue-600 hover:text-blue-800 transition font-medium">
            + Tambah Cerita Baru
          </a>
        </div>

        <div id="story-list" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 story-list"></div>
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
          <div class="col-span-full text-center text-gray-500 text-lg py-10">
            Tidak ada cerita ditemukan.
          </div>
        `;
        return;
      }

      // Render setiap story
      stories.forEach((story) => {
        const storyElement = document.createElement('div');
        storyElement.classList.add(
          'story-card',
          'bg-white',
          'rounded-2xl',
          'shadow-md',
          'hover:shadow-xl',
          'transition',
          'overflow-hidden',
          'flex',
          'flex-col'
        );

        // 🔥 PERBAIKAN: Cek format ID dari API
        const storyId = story.id;
        console.log('Story ID from API:', storyId);

        storyElement.innerHTML = `
          <img src="${story.photoUrl}" alt="${story.name}" class="w-full h-52 object-cover" />
          <div class="p-5 flex flex-col flex-grow">
            <h3 class="text-lg font-semibold text-gray-800 mb-1">${story.name}</h3>
            <p class="text-gray-600 text-sm flex-grow">${story.description.substring(0, 100)}...</p>
            <a href="#/story/${storyId}" 
               class="mt-3 inline-block text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
               data-story-id="${storyId}">
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
              <div class="text-center">
                <img src="${story.photoUrl}" alt="${story.name}" width="100" class="rounded-lg mb-1"/>
                <h4 class="font-semibold">${story.name}</h4>
                <p class="text-sm text-gray-700">${story.description.substring(0, 80)}...</p>
                <a href="#/story/${storyId}" class="text-blue-600 underline text-sm">Lihat Detail</a>
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