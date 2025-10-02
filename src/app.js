/**
 * app.js - Punto de entrada principal de la aplicación
 * Inicializa y coordina todos los managers
 */

class App {
    constructor() {
        this.isInitialized = false;
    }

    /**
     * Inicializa la aplicación
     */
    async initialize() {
        if (this.isInitialized) return;

        // Inicializar InputManager
        window.InputManager.initialize();

        // Inicializar managers
        window.StateManager.initialize();
        window.UIManager.initialize();
        window.NavigationManager.initialize();

        // Configurar UI inicial
        this.setupUI();

        // Marcar como inicializado
        this.isInitialized = true;

        // Mostrar pantalla de inicio con animación
        this.showHomeScreen();
    }

    /**
     * Configura la interfaz de usuario inicial
     */
    setupUI() {
        // Establecer wallpaper
        const currentWallpaper = window.StateManager.getCurrentWallpaper();
        window.UIManager.setWallpaper(currentWallpaper);

        // Actualizar estilo del dispositivo
        window.UIManager.updateDeviceStyle();

        // Crear iconos de aplicaciones
        window.UIManager.createAppIcons(
            GAMES_CONFIG,
            (game) => window.NavigationManager.openGame(game)
        );

        // Crear widget de usuario (con AI integrado)
        const userData = window.StateManager.getUserData();
        window.UIManager.createUserWidget(userData);
    }

    /**
     * Muestra la pantalla de inicio con animación
     */
    showHomeScreen() {
        const homeScreen = document.getElementById('home-screen');
        if (homeScreen) {
            requestAnimationFrame(() => {
                homeScreen.classList.add('loaded');
            });
        }
    }
}

// Inicializar aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.initialize();
});

// Exportar para uso global
window.App = App;
