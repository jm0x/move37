/**
 * GameLoader - Sistema de carga dinámica de juegos
 * Maneja la carga del contenedor y del juego específico
 */

class GameLoader {
    constructor() {
        this.gameContainer = null;
    }

    /**
     * Carga un juego según su ID
     */
    loadGame(gameConfig) {
        // Crear instancia del GameContainer
        this.gameContainer = new GameContainer();
        const gameArea = this.gameContainer.create(gameConfig);

        // Esperar a que el loading termine
        window.addEventListener('gameContainerReady', (event) => {
            if (event.detail.gameId === gameConfig.id) {
                this.initializeGame(gameConfig.id, gameArea);
            }
        }, { once: true });
    }

    /**
     * Inicializa el juego específico según su ID
     */
    initializeGame(gameId, gameArea) {
        switch (gameId) {
            case 'snake':
                this.loadSnake(gameArea);
                break;
            case 'minesweeper':
                this.loadMinesweeper(gameArea);
                break;
            case 'combat':
                this.loadCombat(gameArea);
                break;
            case 'pong':
                this.loadPong(gameArea);
                break;
            default:
                this.loadPlaceholder(gameArea, gameId);
        }
    }

    /**
     * Carga el juego Snake
     */
    loadSnake(gameArea) {
        if (typeof initializeSnakeInContainer === 'function') {
            initializeSnakeInContainer(gameArea, this.gameContainer);
        } else {
            console.error('Snake game not loaded');
        }
    }

    /**
     * Carga el juego Minesweeper
     */
    loadMinesweeper(gameArea) {
        if (typeof initializeMinesweeperInContainer === 'function') {
            initializeMinesweeperInContainer(gameArea, this.gameContainer);
        } else {
            console.error('Minesweeper game not loaded');
        }
    }

    /**
     * Carga el juego Combat
     */
    loadCombat(gameArea) {
        if (typeof initializeCombatInContainer === 'function') {
            initializeCombatInContainer(gameArea, this.gameContainer);
        } else {
            console.error('Combat game not loaded');
        }
    }

    /**
     * Carga el juego Pong (placeholder por ahora)
     */
    loadPong(gameArea) {
        gameArea.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; text-align: center; padding: 20px;">
                <div style="font-size: 60px; margin-bottom: 20px;">🏓</div>
                <h2 style="margin-bottom: 10px; font-size: 24px;">Pong</h2>
                <p style="color: rgba(255, 255, 255, 0.6); font-size: 16px;">Coming soon!</p>
            </div>
        `;
    }

    /**
     * Carga un placeholder para juegos no implementados
     */
    loadPlaceholder(gameArea, gameId) {
        gameArea.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; text-align: center; padding: 20px;">
                <div style="font-size: 60px; margin-bottom: 20px;">🎮</div>
                <h2 style="margin-bottom: 10px; font-size: 24px;">Game: ${gameId}</h2>
                <p style="color: rgba(255, 255, 255, 0.6); font-size: 16px;">Coming soon!</p>
            </div>
        `;
    }

    /**
     * Obtiene la instancia actual del GameContainer
     */
    getGameContainer() {
        return this.gameContainer;
    }
}

// Exportar para uso global
window.GameLoader = GameLoader;
