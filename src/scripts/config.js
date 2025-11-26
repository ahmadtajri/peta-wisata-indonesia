const CONFIG = {
  BASE_URL: 'https://story-api.dicoding.dev/v1/',
  API_ENDPOINT: {
    REGISTER: 'register',
    LOGIN: 'login',
    ALL_STORIES: 'stories',
    ADD_STORY: 'stories',
    DETAIL_STORY: (id) => `stories/${id}`,
  },
  MAP_CONFIG: {
    DEFAULT_COORDINATE: [-6.2, 106.816666], // Jakarta
    DEFAULT_ZOOM: 10,
  },
  PUSH_NOTIFICATION: {
    PUBLIC_VAPID_KEY: 'BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk', // Ganti dengan key Anda
    SERVER_URL: 'http://localhost:3000/subscribe', // URL server push Anda
  },
};

export default CONFIG; 