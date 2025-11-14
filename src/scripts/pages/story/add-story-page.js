import API from '../../data/api.js';
import { getUser } from '../../utils/storage.js';
import { initMapPicker } from '../../utils/leaflet-init.js';

const AddStoryPage = {
  async render() {
    return `
      <section class="add-story-page">
        <h1>Tambah Cerita Baru</h1>
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
        const response = await API.addStory({ description, photo: photoInput, lat: selectedLat, lon: selectedLng });
        if (!response.error) {
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
};

export default AddStoryPage;