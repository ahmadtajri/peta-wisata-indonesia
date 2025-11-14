import API from '../data/api.js';
import { getUserToken, saveUser, getUser, clearAll } from './storage.js';

const Auth = {
  async login(email, password) {
    try {
      const result = await API.loginUser({ email, password });
      saveUser({ name: result.loginResult.name, email });
      return result;
    } catch (error) {
      throw error;
    }
  },

  async register(name, email, password) {
    try {
      const result = await API.registerUser({ name, email, password });
      return result;
    } catch (error) {
      throw error;
    }
  },

  isLoggedIn() {
    return !!getUserToken();
  },

  logout() {
    clearAll();
  },
};

export default Auth;