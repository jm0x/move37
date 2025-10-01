/**
 * GameContainer - Componente común para todos los juegos
 * Maneja la UI del contenedor: navbar, área de juego, loading animation
 */

class GameContainer {
    constructor() {
        this.currentGame = null;
        this.container = null;
        this.navbar = null;
        this.gameArea = null;
        this.spacer = null;
        this.score = 0;
        this.bestScore = 0;
        this.isDesktop = window.innerWidth >= 768;
    }

    /**
     * Crea el contenedor del juego con todos sus elementos
     */
    create(gameConfig) {
        this.currentGame = gameConfig;
        this.loadBestScore(gameConfig.id);

        // Remover contenedor existente si existe
        const existingContainer = document.getElementById('game-container-custom');
        if (existingContainer) {
            existingContainer.remove();
        }

        // Crear estructura del contenedor
        this.container = document.createElement('div');
        this.container.id = 'game-container-custom';
        this.container.className = 'game-container-custom';

        // Crear navbar
        this.navbar = this.createNavbar(gameConfig);

        // Crear área de juego
        this.gameArea = document.createElement('div');
        this.gameArea.id = 'game-area';
        this.gameArea.className = 'game-area';

        // Ensamblar estructura
        this.container.appendChild(this.navbar);
        this.container.appendChild(this.gameArea);

        // Crear spacer para móvil (completa el cuadrado hasta la navbar)
        if (!this.isDesktop) {
            this.spacer = document.createElement('div');
            this.spacer.className = 'game-spacer';
            this.container.appendChild(this.spacer);

            // Calcular posición del spacer en móvil
            this.calculateSpacerPosition();
        }

        // Añadir al DOM
        document.body.appendChild(this.container);

        // Mostrar loading animation
        this.showLoadingAnimation(gameConfig);

        // Aplicar estilos
        this.applyStyles();

        // Hacer visible el contenedor con animación
        requestAnimationFrame(() => {
            this.container.classList.add('visible');
        });

        return this.gameArea;
    }

    /**
     * Crea la navbar superior con emoji, nombre, scores y botón cerrar
     */
    createNavbar(gameConfig) {
        const navbar = document.createElement('div');
        navbar.className = 'game-navbar';

        navbar.innerHTML = `
            <div class="game-navbar-left">
                <span class="game-emoji">${gameConfig.icon}</span>
                <span class="game-name">${gameConfig.name}</span>
            </div>
            <div class="game-navbar-right">
                <div class="game-scores">
                    <span class="score-label">Score: <span id="current-score">0</span></span>
                    <span class="score-divider">|</span>
                    <span class="score-label">Best: <span id="best-score">${this.bestScore}</span></span>
                </div>
                <button class="game-close-btn" id="game-close-btn">✕</button>
            </div>
        `;

        // Event listener para cerrar
        const closeBtn = navbar.querySelector('#game-close-btn');
        closeBtn.addEventListener('click', () => this.close());

        return navbar;
    }

    /**
     * Muestra animación de loading simulando carga del cart
     */
    showLoadingAnimation(gameConfig) {
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'game-loading';
        loadingDiv.innerHTML = `
            <div class="cart-animation">
                <div class="cart-emoji">${gameConfig.icon}</div>
                <div class="loading-bar">
                    <div class="loading-progress"></div>
                </div>
                <div class="loading-text">Loading...</div>
            </div>
        `;

        this.gameArea.appendChild(loadingDiv);

        // Simular progreso de carga
        const progressBar = loadingDiv.querySelector('.loading-progress');
        let progress = 0;
        const loadingInterval = setInterval(() => {
            progress += Math.random() * 30;
            if (progress >= 100) {
                progress = 100;
                progressBar.style.width = '100%';
                clearInterval(loadingInterval);

                // Remover loading después de completar
                setTimeout(() => {
                    loadingDiv.remove();
                    // Disparar evento de que el juego está listo para cargar
                    window.dispatchEvent(new CustomEvent('gameContainerReady', {
                        detail: {
                            gameArea: this.gameArea,
                            gameId: gameConfig.id
                        }
                    }));
                }, 300);
            } else {
                progressBar.style.width = progress + '%';
            }
        }, 200);
    }

    /**
     * Actualiza el score actual
     */
    updateScore(newScore) {
        this.score = newScore;
        const scoreElement = document.getElementById('current-score');
        if (scoreElement) {
            scoreElement.textContent = newScore;
        }

        // Actualizar best score si es necesario
        if (newScore > this.bestScore) {
            this.bestScore = newScore;
            this.saveBestScore(this.currentGame.id, newScore);
            const bestScoreElement = document.getElementById('best-score');
            if (bestScoreElement) {
                bestScoreElement.textContent = newScore;
            }
        }
    }

    /**
     * Resetea el score actual
     */
    resetScore() {
        this.score = 0;
        const scoreElement = document.getElementById('current-score');
        if (scoreElement) {
            scoreElement.textContent = '0';
        }
    }

    /**
     * Carga el mejor score desde localStorage
     */
    loadBestScore(gameId) {
        const saved = localStorage.getItem(`bestScore_${gameId}`);
        this.bestScore = saved ? parseInt(saved) : 0;
    }

    /**
     * Guarda el mejor score en localStorage
     */
    saveBestScore(gameId, score) {
        localStorage.setItem(`bestScore_${gameId}`, score);
    }

    /**
     * Cierra el contenedor del juego y vuelve a la pantalla principal
     */
    close() {
        // Limpiar cualquier interval o evento del juego
        window.dispatchEvent(new CustomEvent('gameContainerClosing'));

        // Animación de salida
        this.container.classList.remove('visible');

        setTimeout(() => {
            if (this.container && this.container.parentNode) {
                this.container.remove();
            }

            // Mostrar pantalla principal
            const homeScreen = document.getElementById('home-screen');
            if (homeScreen) {
                homeScreen.style.visibility = 'visible';
                homeScreen.style.opacity = '1';
            }

            this.currentGame = null;
        }, 300);
    }

    /**
     * Aplica estilos CSS al contenedor
     */
    applyStyles() {
        // Los estilos están en un archivo CSS separado (gameContainer.css)
        // Todos los juegos tendrán el mismo tamaño fijo definido en CSS
    }

    /**
     * Calcula la posición del spacer en móvil para completar el cuadrado
     */
    calculateSpacerPosition() {
        // El spacer ahora usa flex: 1 en CSS para llenar automáticamente el espacio restante
    }

    /**
     * Obtiene el área de juego
     */
    getGameArea() {
        return this.gameArea;
    }

    /**
     * Obtiene el contenedor completo
     */
    getContainer() {
        return this.container;
    }
}

// Exportar para uso global
window.GameContainer = GameContainer;
