const AboutPage = {
  async render() {
    return `
      <section class="about-page">
        <h1>Tentang Aplikasi Peta Wisata Indonesia</h1>
        <h2>Deskripsi Aplikasi</h2>
        <p>Aplikasi ini adalah platform untuk berbagi cerita wisata di Indonesia menggunakan peta interaktif. Dibangun dengan teknologi modern seperti Leaflet untuk peta dan API Dicoding untuk autentikasi.</p>
      </section>
    `;
  },

  async afterRender() {
    // Tidak ada logika khusus
  },
};

export default AboutPage;