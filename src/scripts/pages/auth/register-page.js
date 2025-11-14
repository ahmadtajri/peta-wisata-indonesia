import API from '../../data/api.js';

const RegisterPage = {
  async render() {
    return `
      <section class="auth-page">
        <h1>Register</h1>
        <h2 class="sr-only">Form Registrasi Pengguna Baru</h2>
        <form id="registerForm" class="auth-form">
          <div class="form-group">
            <label for="name">Nama</label>
            <input id="name" type="text" required aria-required="true" />
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input id="email" type="email" required aria-required="true" />
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input id="password" type="password" required aria-required="true" />
          </div>
          <button type="submit">Register</button>
          <p>Sudah punya akun? <a href="#/login">Login</a></p>
        </form>
        <div id="error-message" class="error-message" role="alert"></div>
      </section>
    `;
  },

  async afterRender() {
    const form = document.querySelector('#registerForm');
    const errorDiv = document.querySelector('#error-message');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.querySelector('#name').value.trim();
      const email = document.querySelector('#email').value.trim();
      const password = document.querySelector('#password').value.trim();

      if (!name || !email || !password) {
        errorDiv.textContent = 'Semua field wajib diisi.';
        return;
      }

      try {
        await API.registerUser({ name, email, password });
        alert('Registrasi berhasil! Silakan login.');
        window.location.hash = '/login';
      } catch (error) {
        errorDiv.textContent = error.message || 'Registrasi gagal.';
      }
    });
  },
};

export default RegisterPage;