const TOKEN_KEY = 'dicoding_story_token';
const USER_KEY = 'dicoding_story_user';

export const saveToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const getUserToken = getToken; // Alias

export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const saveUser = (user) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUser = () => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const clearUser = () => {
  localStorage.removeItem(USER_KEY);
};

export const clearAll = () => {
  clearToken();
  clearUser();
};

export default {
  saveToken,
  getToken,
  getUserToken,
  clearToken,
  saveUser,
  getUser,
  clearUser,
  clearAll,
};