const DB_NAME = 'peta-wisata-db';
const DB_VERSION = 1;
const STORE_NAME = 'favorites';

/**
 * Inisialisasi database IndexedDB menggunakan native API
 */
const openDatabase = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => {
            reject(new Error('Failed to open database'));
        };

        request.onsuccess = (event) => {
            resolve(event.target.result);
        };

        request.onupgradeneeded = (event) => {
            const db = event.target.result;

            if (!db.objectStoreNames.contains(STORE_NAME)) {
                const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
                store.createIndex('createdAt', 'createdAt', { unique: false });
            }
        };
    });
};

const FavoriteIDB = {
    /**
     * Menambahkan story ke favorit
     * @param {Object} story - Story object yang akan disimpan
     * @returns {Promise<string>} ID dari story yang disimpan
     */
    async addFavorite(story) {
        try {
            const db = await openDatabase();
            const favoriteData = {
                id: story.id,
                name: story.name,
                description: story.description,
                photoUrl: story.photoUrl,
                lat: story.lat,
                lon: story.lon,
                createdAt: story.createdAt || new Date().toISOString(),
            };

            return new Promise((resolve, reject) => {
                const transaction = db.transaction([STORE_NAME], 'readwrite');
                const store = transaction.objectStore(STORE_NAME);
                const request = store.put(favoriteData);

                request.onsuccess = () => {
                    console.log('Story added to favorites:', favoriteData);
                    resolve(story.id);
                };

                request.onerror = () => {
                    reject(new Error('Failed to add favorite'));
                };
            });
        } catch (error) {
            console.error('Error adding to favorites:', error);
            throw error;
        }
    },

    /**
     * Mendapatkan semua favorit
     * @returns {Promise<Array>} Array of favorite stories
     */
    async getAllFavorites() {
        try {
            const db = await openDatabase();

            return new Promise((resolve, reject) => {
                const transaction = db.transaction([STORE_NAME], 'readonly');
                const store = transaction.objectStore(STORE_NAME);
                const request = store.getAll();

                request.onsuccess = () => {
                    console.log('All favorites:', request.result);
                    resolve(request.result);
                };

                request.onerror = () => {
                    reject(new Error('Failed to get favorites'));
                };
            });
        } catch (error) {
            console.error('Error getting favorites:', error);
            throw error;
        }
    },

    /**
     * Mendapatkan satu favorit berdasarkan ID
     * @param {string} id - ID dari story
     * @returns {Promise<Object|undefined>} Story object atau undefined jika tidak ditemukan
     */
    async getFavorite(id) {
        try {
            const db = await openDatabase();

            return new Promise((resolve, reject) => {
                const transaction = db.transaction([STORE_NAME], 'readonly');
                const store = transaction.objectStore(STORE_NAME);
                const request = store.get(id);

                request.onsuccess = () => {
                    resolve(request.result);
                };

                request.onerror = () => {
                    reject(new Error('Failed to get favorite'));
                };
            });
        } catch (error) {
            console.error('Error getting favorite:', error);
            throw error;
        }
    },

    /**
     * Menghapus story dari favorit
     * @param {string} id - ID dari story yang akan dihapus
     * @returns {Promise<void>}
     */
    async deleteFavorite(id) {
        try {
            const db = await openDatabase();

            return new Promise((resolve, reject) => {
                const transaction = db.transaction([STORE_NAME], 'readwrite');
                const store = transaction.objectStore(STORE_NAME);
                const request = store.delete(id);

                request.onsuccess = () => {
                    console.log('Story removed from favorites:', id);
                    resolve();
                };

                request.onerror = () => {
                    reject(new Error('Failed to delete favorite'));
                };
            });
        } catch (error) {
            console.error('Error deleting favorite:', error);
            throw error;
        }
    },

    /**
     * Mengecek apakah story sudah ada di favorit
     * @param {string} id - ID dari story
     * @returns {Promise<boolean>} true jika sudah favorit, false jika belum
     */
    async isFavorite(id) {
        try {
            const favorite = await this.getFavorite(id);
            return !!favorite;
        } catch (error) {
            console.error('Error checking favorite:', error);
            return false;
        }
    },

    /**
     * Toggle favorit (tambah jika belum ada, hapus jika sudah ada)
     * @param {Object} story - Story object
     * @returns {Promise<boolean>} true jika ditambahkan, false jika dihapus
     */
    async toggleFavorite(story) {
        try {
            const isFav = await this.isFavorite(story.id);

            if (isFav) {
                await this.deleteFavorite(story.id);
                return false;
            } else {
                await this.addFavorite(story);
                return true;
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
            throw error;
        }
    },
};

export default FavoriteIDB;
