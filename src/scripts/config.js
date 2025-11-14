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
};

export default CONFIG;