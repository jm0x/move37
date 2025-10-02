/**
 * StateManager - Maneja el estado global de la aplicación
 */

class StateManager {
    constructor() {
        this.currentWallpaper = 'gradient-elegant';
        this.userData = USER_DATA_DEFAULT;
        this.isDesktop = !Helpers.isMobile();
    }

    /**
     * Inicializa el StateManager
     */
    initialize() {
        // Cargar wallpaper guardado
        this.currentWallpaper = window.StorageManager.getWallpaper();

        // Cargar datos de usuario
        this.userData = window.StorageManager.getUserData();

        // Detectar tipo de dispositivo
        this.detectDeviceType();

        // Escuchar cambios de tamaño de ventana
        window.addEventListener('resize', Helpers.debounce(() => {
            this.handleResize();
        }, 250));
    }

    /**
     * Detecta el tipo de dispositivo
     */
    detectDeviceType() {
        const wasDesktop = this.isDesktop;
        this.isDesktop = !Helpers.isMobile();

        // Si cambió el tipo de dispositivo, actualizar UI
        if (wasDesktop !== this.isDesktop) {
            window.UIManager.updateDeviceStyle();
            window.UIManager.createAppIcons(
                GAMES_CONFIG,
                (game) => window.NavigationManager.openGame(game)
            );
            window.UIManager.createUserWidget(this.userData);
        }
    }

    /**
     * Maneja el resize de la ventana
     */
    handleResize() {
        this.detectDeviceType();
    }

    /**
     * Selecciona un wallpaper
     */
    selectWallpaper(wallpaperId) {
        this.currentWallpaper = wallpaperId;
        window.StorageManager.saveWallpaper(wallpaperId);
        window.UIManager.setWallpaper(wallpaperId);

        // Recargar settings para mostrar la selección actualizada
        window.NavigationManager.loadSettings();
    }

    /**
     * Obtiene el wallpaper actual
     */
    getCurrentWallpaper() {
        return this.currentWallpaper;
    }

    /**
     * Actualiza los datos del usuario
     */
    updateUserData(newData) {
        this.userData = { ...this.userData, ...newData };
        window.StorageManager.saveUserData(this.userData);
        window.UIManager.createUserWidget(this.userData);
    }

    /**
     * Obtiene los datos del usuario
     */
    getUserData() {
        return this.userData;
    }

    /**
     * Verifica si el dispositivo es desktop
     */
    isDesktopDevice() {
        return this.isDesktop;
    }

    /**
     * Añade un juego nuevo dinámicamente
     */
    addNewGame(gameData) {
        GAMES_CONFIG.push(gameData);
        window.UIManager.createAppIcons(
            GAMES_CONFIG,
            (game) => window.NavigationManager.openGame(game)
        );
    }

    /**
     * Actualiza un juego existente
     */
    updateGame(gameId, newData) {
        const gameIndex = GAMES_CONFIG.findIndex(game => game.id === gameId);
        if (gameIndex !== -1) {
            GAMES_CONFIG[gameIndex] = { ...GAMES_CONFIG[gameIndex], ...newData };
            window.UIManager.createAppIcons(
                GAMES_CONFIG,
                (game) => window.NavigationManager.openGame(game)
            );
        }
    }
}

// Exportar instancia singleton
window.StateManager = new StateManager();
