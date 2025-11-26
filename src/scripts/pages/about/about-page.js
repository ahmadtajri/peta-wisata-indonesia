const AboutPage = {
  async render() {
    return `
      <section class="about-page">
        <h2>Tentang Aplikasi</h2>
        <p>Aplikasi ini adalah platform untuk berbagi cerita wisata di Indonesia menggunakan peta interaktif. Dibangun dengan teknologi modern seperti Leaflet untuk peta dan API Dicoding untuk autentikasi.</p>
        <p>Temukan destinasi wisata terbaik dan bagikan pengalaman Anda kepada dunia!</p>
      </section>
    `;
  },

  async afterRender() {
    // Tidak ada logika khusus
  },
};

export default AboutPage;