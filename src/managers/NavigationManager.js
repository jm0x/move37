/**
 * NavigationManager - Maneja la navegación entre pantallas y juegos
 */

class NavigationManager {
    constructor() {
        this.gameContainer = null;
        this.gameContent = null;
        this.closeGameBtn = null;
        this.currentGame = null;
    }

    /**
     * Inicializa el NavigationManager
     */
    initialize() {
        this.gameContainer = document.getElementById('game-container');
        this.gameContent = document.getElementById('game-content');
        this.closeGameBtn = document.getElementById('close-game');

        if (this.closeGameBtn) {
            this.closeGameBtn.addEventListener('click', () => this.closeGame());
        }
    }

    /**
     * Abre un juego
     */
    openGame(game) {
        if (game.id.startsWith('coming-soon')) {
            window.UIManager.showMessage('Coming soon!');
            return;
        }

        this.currentGame = game;

        const gameIds = ['snake', 'minesweeper', 'combat', 'pong'];

        if (gameIds.includes(game.id)) {
            // Usar GameLoader para juegos reales
            const gameLoader = new GameLoader();
            gameLoader.loadGame(game);
        } else {
            // Para settings, messages, etc.
            this.loadLegacyContent(game);
            window.UIManager.hideHomeScreen();
        }
    }

    /**
     * Carga contenido legacy (settings, messages)
     */
    loadLegacyContent(game) {
        if (!this.gameContainer || !this.gameContent) return;

        this.gameContainer.classList.add('active');
        this.gameContent.innerHTML = '';

        switch (game.id) {
            case 'settings':
                this.loadSettings();
                break;
            case 'messages':
                this.loadMessages();
                break;
            case 'browser':
                this.loadBrowser();
                break;
            case 'wallet':
                this.loadWallet();
                break;
            default:
                this.loadPlaceholder(game);
        }
    }

    /**
     * Carga la app de Settings
     */
    loadSettings() {
        const currentWallpaper = window.StateManager.getCurrentWallpaper();
        this.gameContent.innerHTML = window.UIManager.createSettingsContent(
            currentWallpaper,
            (wallpaperId) => window.StateManager.selectWallpaper(wallpaperId)
        );
    }

    /**
     * Carga la app de Messages
     */
    loadMessages() {
        this.gameContent.innerHTML = window.UIManager.createMessagesContent();
    }

    /**
     * Carga la app de Coffee
     */
    loadBrowser() {
        this.gameContent.innerHTML = window.UIManager.createBrowserContent();
    }

    /**
     * Carga la app de Wallet
     */
    loadWallet() {
        this.gameContent.innerHTML = window.UIManager.createWalletContent();
    }

    /**
     * Carga un placeholder para apps no implementadas
     */
    loadPlaceholder(game) {
        this.gameContent.innerHTML = `
            <div style="text-align: center; color: #333;">
                <h2>${game.icon} ${game.name}</h2>
                <p>Coming soon with AI!</p>
                <div style="margin-top: 20px; padding: 20px; background: #e0e0e0; border-radius: 10px;">
                    <p>This game will be available soon with artificial intelligence.</p>
                </div>
            </div>
        `;
    }

    /**
     * Cierra el juego actual
     */
    closeGame() {
        if (this.gameContainer) {
            this.gameContainer.classList.remove('active');
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
     * Obtiene el juego actual
     */
    getCurrentGame() {
        return this.currentGame;
    }
}

// Exportar instancia singleton
window.NavigationManager = new NavigationManager();
