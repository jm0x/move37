/**
 * BaseGame - Clase base abstracta para todos los juegos
 * Proporciona funcionalidad común y estructura para todos los juegos
 */

class BaseGame {
    constructor(config) {
        this.config = config;
        this.canvas = null;
        this.ctx = null;
        this.gameContainer = null;
        this.gameRunning = false;
        this.gameLoop = null;
        this.score = 0;
        this.eventHandlers = new Map();
    }

    /**
     * Inicializa el juego en el contenedor proporcionado
     */
    initialize(gameArea, gameContainer) {
        this.gameContainer = gameContainer;
        this.createCanvas(gameArea);
        this.setupEventListeners();
        this.start();
    }

    /**
     * Crea el canvas del juego
     * @abstract - Debe ser implementado por las clases hijas
     */
    createCanvas(gameArea) {
        throw new Error('createCanvas() debe ser implementado por la clase hija');
    }

    /**
     * Configura los event listeners
     * @abstract - Debe ser implementado por las clases hijas
     */
    setupEventListeners() {
        throw new Error('setupEventListeners() debe ser implementado por la clase hija');
    }

    /**
     * Inicia el juego
     * @abstract - Debe ser implementado por las clases hijas
     */
    start() {
        throw new Error('start() debe ser implementado por la clase hija');
    }

    /**
     * Actualiza el estado del juego
     * @abstract - Debe ser implementado por las clases hijas
     */
    update() {
        throw new Error('update() debe ser implementado por la clase hija');
    }

    /**
     * Renderiza el juego
     * @abstract - Debe ser implementado por las clases hijas
     */
    render() {
        throw new Error('render() debe ser implementado por la clase hija');
    }

    /**
     * Reinicia el juego
     * @abstract - Debe ser implementado por las clases hijas
     */
    reset() {
        throw new Error('reset() debe ser implementado por la clase hija');
    }

    /**
     * Actualiza el puntaje
     */
    updateScore(newScore) {
        this.score = newScore;
        if (this.gameContainer) {
            this.gameContainer.updateScore(newScore);
        }
    }

    /**
     * Registra un event handler para limpieza posterior
     */
    registerEventHandler(element, event, handler) {
        const key = `${element}_${event}`;
        if (this.eventHandlers.has(key)) {
            const oldHandler = this.eventHandlers.get(key);
            element.removeEventListener(event, oldHandler);
        }
        element.addEventListener(event, handler);
        this.eventHandlers.set(key, handler);
    }

    /**
     * Inicia el game loop
     */
    startGameLoop(fps = 60) {
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
        }

        this.gameLoop = setInterval(() => {
            if (this.gameRunning) {
                this.update();
                this.render();
            }
        }, 1000 / fps);
    }

    /**
     * Detiene el game loop
     */
    stopGameLoop() {
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
            this.gameLoop = null;
        }
        this.gameRunning = false;
    }

    /**
     * Limpia todos los recursos del juego
     */
    cleanup() {
        this.stopGameLoop();

        // Remover todos los event listeners registrados
        this.eventHandlers.forEach((handler, key) => {
            const [elementType, event] = key.split('_');
            if (elementType === 'document') {
                document.removeEventListener(event, handler);
            } else if (elementType === 'canvas' && this.canvas) {
                this.canvas.removeEventListener(event, handler);
            }
        });

        this.eventHandlers.clear();
        this.canvas = null;
        this.ctx = null;
        this.gameContainer = null;
    }

    /**
     * Muestra el modal de game over
     */
    showGameOver(title, message) {
        const modal = document.getElementById(this.config.modalId);
        const titleElement = document.getElementById(this.config.titleId);
        const messageElement = document.getElementById(this.config.messageId);

        if (modal && titleElement && messageElement) {
            titleElement.innerHTML = title;
            messageElement.innerHTML = message;
            modal.style.display = 'block';
        }
    }

    /**
     * Oculta el modal de game over
     */
    hideGameOver() {
        const modal = document.getElementById(this.config.modalId);
        if (modal) {
            modal.style.display = 'none';
        }
    }
}

// Exportar para uso global
window.BaseGame = BaseGame;
