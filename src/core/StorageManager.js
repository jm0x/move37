/**
 * StorageManager - Gestor centralizado de almacenamiento local
 * Maneja todas las operaciones de localStorage de manera segura
 */

class StorageManager {
    constructor() {
        this.isAvailable = this.checkAvailability();
    }

    /**
     * Verifica si localStorage está disponible
     */
    checkAvailability() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            console.warn('localStorage no está disponible:', e);
            return false;
        }
    }

    /**
     * Guarda un valor en localStorage
     */
    set(key, value) {
        if (!this.isAvailable) return false;

        try {
            const serializedValue = JSON.stringify(value);
            localStorage.setItem(key, serializedValue);
            return true;
        } catch (e) {
            console.error('Error al guardar en localStorage:', e);
            return false;
        }
    }

    /**
     * Obtiene un valor de localStorage
     */
    get(key, defaultValue = null) {
        if (!this.isAvailable) return defaultValue;

        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.error('Error al leer de localStorage:', e);
            return defaultValue;
        }
    }

    /**
     * Elimina un valor de localStorage
     */
    remove(key) {
        if (!this.isAvailable) return false;

        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error('Error al eliminar de localStorage:', e);
            return false;
        }
    }

    /**
     * Limpia todo el localStorage
     */
    clear() {
        if (!this.isAvailable) return false;

        try {
            localStorage.clear();
            return true;
        } catch (e) {
            console.error('Error al limpiar localStorage:', e);
            return false;
        }
    }

    /**
     * Guarda el mejor puntaje de un juego
     */
    saveBestScore(gameId, score) {
        const key = `${CONSTANTS.STORAGE_KEYS.BEST_SCORE}${gameId}`;
        return this.set(key, score);
    }

    /**
     * Obtiene el mejor puntaje de un juego
     */
    getBestScore(gameId) {
        const key = `${CONSTANTS.STORAGE_KEYS.BEST_SCORE}${gameId}`;
        return this.get(key, 0);
    }

    /**
     * Guarda el wallpaper actual
     */
    saveWallpaper(wallpaperId) {
        return this.set(CONSTANTS.STORAGE_KEYS.WALLPAPER, wallpaperId);
    }

    /**
     * Obtiene el wallpaper actual
     */
    getWallpaper() {
        return this.get(CONSTANTS.STORAGE_KEYS.WALLPAPER, 'gradient-elegant');
    }

    /**
     * Guarda los datos del usuario
     */
    saveUserData(userData) {
        return this.set(CONSTANTS.STORAGE_KEYS.USER_DATA, userData);
    }

    /**
     * Obtiene los datos del usuario
     */
    getUserData() {
        return this.get(CONSTANTS.STORAGE_KEYS.USER_DATA, USER_DATA_DEFAULT);
    }

    /**
     * Actualiza un campo específico de los datos del usuario
     */
    updateUserDataField(field, value) {
        const userData = this.getUserData();
        userData[field] = value;
        return this.saveUserData(userData);
    }

    /**
     * Obtiene todas las claves almacenadas
     */
    getAllKeys() {
        if (!this.isAvailable) return [];

        try {
            return Object.keys(localStorage);
        } catch (e) {
            console.error('Error al obtener claves:', e);
            return [];
        }
    }

    /**
     * Obtiene el tamaño aproximado del localStorage
     */
    getStorageSize() {
        if (!this.isAvailable) return 0;

        let size = 0;
        try {
            for (let key in localStorage) {
                if (localStorage.hasOwnProperty(key)) {
                    size += localStorage[key].length + key.length;
                }
            }
            return size;
        } catch (e) {
            console.error('Error al calcular tamaño:', e);
            return 0;
        }
    }

    /**
     * Verifica si una clave existe
     */
    has(key) {
        return this.get(key) !== null;
    }
}

// Exportar instancia singleton
window.StorageManager = new StorageManager();
