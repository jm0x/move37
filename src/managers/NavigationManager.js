/**
 * NavigationManager - Maneja la navegación entre pantallas, juegos y apps
 * Utiliza GameLoader y AppLoader para cargar contenido dinámicamente
 */

class NavigationManager {
    constructor() {
        this.gameContainer = null;
        this.gameContent = null;
        this.closeGameBtn = null;
        this.currentGame = null;
        this.gameLoader = null;
        this.appLoader = null;
    }

    /**
     * Inicializa el NavigationManager
     */
    initialize() {
        this.gameContainer = document.getElementById('game-container');
        this.gameContent = document.getElementById('game-content');
        this.closeGameBtn = document.getElementById('close-game');

        // Inicializar loaders
        this.gameLoader = new GameLoader();
        this.appLoader = new AppLoader();

        if (this.closeGameBtn) {
            this.closeGameBtn.addEventListener('click', () => this.closeGame());
        }
    }

    /**
     * Abre un juego o app según su tipo
     */
    openGame(game) {
        if (game.id.startsWith('coming-soon')) {
            window.UIManager.showMessage('Coming soon!');
            return;
        }

        this.currentGame = game;

        const gameIds = ['snake', 'minesweeper', 'combat', 'pong'];
        const appIds = ['settings', 'messages', 'browser', 'appstore', 'wallet'];

        if (gameIds.includes(game.id)) {
            // Cargar juego usando GameLoader
            this.gameLoader.loadGame(game);
        } else if (appIds.includes(game.id)) {
            // Cargar app usando AppLoader
            this.loadApp(game);
        } else {
            // Placeholder para contenido no implementado
            this.loadPlaceholder(game);
        }
    }

    /**
     * Carga una app usando AppLoader
     */
    loadApp(appConfig) {
        if (!this.gameContainer || !this.gameContent) return;

        this.gameContainer.classList.add('active');
        this.gameContent.innerHTML = '';

        // Usar AppLoader para cargar la app
        this.appLoader.loadApp(appConfig, this.gameContent);

        // Ocultar home screen en móvil
        window.UIManager.hideHomeScreen();
    }

    /**
     * Carga un placeholder para contenido no implementado
     */
    loadPlaceholder(game) {
        if (!this.gameContainer || !this.gameContent) return;

        this.gameContainer.classList.add('active');
        this.gameContent.innerHTML = `
            <div style="padding: 20px; color: #fff; background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%); height: 100%; display: flex; align-items: center; justify-content: center;">
                <div style="text-align: center;">
                    <div style="font-size: 60px; margin-bottom: 20px;">${game.icon}</div>
                    <h2 style="margin-bottom: 10px;">${game.name}</h2>
                    <p style="color: rgba(255, 255, 255, 0.6);">Coming soon!</p>
                </div>
            </div>
        `;

        window.UIManager.hideHomeScreen();
    }

    /**
     * Carga la app de Settings (legacy support - ahora usa AppLoader)
     */
    loadSettings() {
        this.loadApp({ id: 'settings', name: 'Settings', icon: '⚙️' });
    }

    /**
     * Cierra el juego o app actual
     */
    closeGame() {
        if (this.gameContainer) {
            this.gameContainer.classList.remove('active');
        }

        // Limpiar app loader si existe
        if (this.appLoader) {
            this.appLoader.cleanup();
        }

        window.UIManager.showHomeScreen();
        this.currentGame = null;

        // Limpiar contenido después de la animación
        setTimeout(() => {
            if (this.gameContent) {
                this.gameContent.innerHTML = '';
            }
        }, CONSTANTS.ANIMATION.TRANSITION_DURATION);
    }

    /**
     * Obtiene el juego o app actual
     */
    getCurrentGame() {
        return this.currentGame;
    }

    /**
     * Limpia todos los recursos
     */
    cleanup() {
        if (this.gameLoader) {
            // GameLoader limpia automáticamente con eventos
        }
        if (this.appLoader) {
            this.appLoader.cleanupAll();
        }
    }
}

// Exportar instancia singleton
window.NavigationManager = new NavigationManager();
