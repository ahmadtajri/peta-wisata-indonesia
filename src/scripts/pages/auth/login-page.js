import API from '../../data/api.js';
import { saveUser } from '../../utils/storage.js';

const LoginPage = {
  async render() {
    return `
      <section class="auth-page">
        <h1>Login</h1>
        <h2 class="sr-only">Form Login Pengguna</h2>
        <form id="loginForm" class="auth-form">
          <div class="form-group">
            <label for="email">Email</label>
            <input id="email" type="email" required aria-required="true" />
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input id="password" type="password" required aria-required="true" />
          </div>
          <button type="submit">Login</button>
          <p>Belum punya akun? <a href="#/register">Register</a></p>
        </form>
        <div id="error-message" class="error-message" role="alert"></div>
      </section>
    `;
  },

  async afterRender() {
    const form = document.querySelector('#loginForm');
    const errorDiv = document.querySelector('#error-message');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.querySelector('#email').value.trim();
      const password = document.querySelector('#password').value.trim();

      if (!email || !password) {
        errorDiv.textContent = 'Email dan password wajib diisi.';
        return;
      }

      try {
        const result = await API.loginUser({ email, password });
        saveUser({
          name: result.loginResult.name,
          email,
          token: result.loginResult.token,
        });
        window.location.hash = '/';
      } catch (error) {
        errorDiv.textContent = error.message || 'Login gagal.';
      }
    });
  },
};

export default LoginPage;