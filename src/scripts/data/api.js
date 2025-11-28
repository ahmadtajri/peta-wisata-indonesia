import CONFIG from '../config.js';
import { getUser, saveUser } from '../utils/storage.js';

class DicodingAPI {
  static async registerUser({ name, email, password }) {
    try {
      const response = await fetch(`${CONFIG.BASE_URL}${CONFIG.API_ENDPOINT.REGISTER}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      return result;
    } catch (error) {
      console.error('Register Error:', error);
      throw error;
    }
  }

  static async loginUser({ email, password }) {
    try {
      const response = await fetch(`${CONFIG.BASE_URL}${CONFIG.API_ENDPOINT.LOGIN}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message);

      // Simpan user token di storage
      saveUser({
        name: result.loginResult.name,
        email,
        token: result.loginResult.token,
      });

      return result;
    } catch (error) {
      console.error('Login Error:', error);
      throw error;
    }
  }

  static async getAllStories() {
    try {
      const user = getUser();
      if (!user || !user.token) throw new Error('User belum login.');

      const response = await fetch(
        `${CONFIG.BASE_URL}${CONFIG.API_ENDPOINT.ALL_STORIES}?t=${Date.now()}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      return result.listStory;
    } catch (error) {
      console.error('Get Stories Error:', error);
      throw error;
    }
  }

  static async addStory({ description, photo, lat, lon }) {
    try {
      const user = getUser();
      if (!user || !user.token) throw new Error('User belum login.');

      const formData = new FormData();
      formData.append('description', description);
      formData.append('photo', photo);
      if (lat && lon) {
        formData.append('lat', lat);
        formData.append('lon', lon);
      }

      const response = await fetch(`${CONFIG.BASE_URL}${CONFIG.API_ENDPOINT.ADD_STORY}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: formData,
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      return result;
    } catch (error) {
      console.error('Add Story Error:', error);
      throw error;
    }
  }

  static async getStoryDetail(id) {
    try {
      const user = getUser();
      console.log('[DEBUG] Token user:', user?.token);
      if (!user || !user.token) throw new Error('User belum login.');

      const response = await fetch(`${CONFIG.BASE_URL}${CONFIG.API_ENDPOINT.DETAIL_STORY(id)}?t=${Date.now()}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Story not found.');
      return result.story;
    } catch (error) {
      console.error('Get Story Detail Error:', error);
      throw error;
    }
  }

  static async getUserProfile() {
    const user = getUser();
    return user || null;
  }
}

export default DicodingAPI;
