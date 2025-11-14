import CONFIG from '../config.js';

export const initMapPicker = (mapId, onLocationSelect) => {
  const map = L.map(mapId).setView(CONFIG.MAP_CONFIG.DEFAULT_COORDINATE, CONFIG.MAP_CONFIG.DEFAULT_ZOOM);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  let marker;
  map.on('click', (e) => {
    const { lat, lng } = e.latlng;
    if (marker) map.removeLayer(marker);
    marker = L.marker([lat, lng]).addTo(map);
    onLocationSelect(lat, lng);
  });
  return map;
};

export const initMapForStory = (lat, lon, mapId) => {
  const map = L.map(mapId).setView([lat, lon], 15);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);
  L.marker([lat, lon]).addTo(map);
};