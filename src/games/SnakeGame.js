/**
 * SnakeGame - Juego de la serpiente usando la nueva arquitectura
 * Extiende BaseGame para heredar funcionalidad común
 */

class SnakeGame extends BaseGame {
    constructor() {
        const config = {
            modalId: 'gameOver',
            titleId: 'gameOverTitle',
            messageId: 'gameOverMessage',
            restartBtnId: 'restartBtn'
        };

        super(config);

        // Estado del juego
        this.snake = [];
        this.food = {};
        this.direction = 'right';
        this.nextDirection = 'right';
        this.cellSize = 20;
        this.canvasSize = 400;
        this.currentFood = SNAKE_FOOD_TYPES[0];
        this.eatEffectParticles = [];
    }

    /**
     * Crea el canvas del juego
     */
    createCanvas(gameArea) {
        const isMobile = Helpers.isMobile();

        if (isMobile) {
            const screenWidth = window.innerWidth;
            this.canvasSize = screenWidth;
            this.cellSize = Math.floor(screenWidth / CONSTANTS.GRID_SIZE.SNAKE_CELLS);
        } else {
            this.cellSize = CONSTANTS.CELL_SIZE.SNAKE_DESKTOP;
            this.canvasSize = this.cellSize * CONSTANTS.GRID_SIZE.SNAKE_CELLS;
        }

        gameArea.innerHTML = GameUI.createGameCanvas(this.canvasSize, 'snakeCanvas', {
            modalId: this.config.modalId,
            titleId: this.config.titleId,
            messageId: this.config.messageId,
            buttonId: this.config.restartBtnId,
            buttonText: 'Restart'
        });

        GameUI.setupGameOverModal({
            titleId: this.config.titleId,
            titleText: '<span style="color: #ff4444;">Game Over!</span>',
            messageId: this.config.messageId,
            messageText: 'Final Score: <span id="finalScore" style="color: white; font-weight: 600;">0</span>'
        });

        this.canvas = document.getElementById('snakeCanvas');
        this.ctx = this.canvas.getContext('2d');
    }

    /**
     * Configura los event listeners
     */
    setupEventListeners() {
        const isMobile = Helpers.isMobile();

        if (isMobile) {
            this.setupTouchControls();
        } else {
            this.setupKeyboardControls();
        }

        // Botón restart
        const restartBtn = document.getElementById(this.config.restartBtnId);
        if (restartBtn) {
            restartBtn.addEventListener('click', () => this.reset());
        }

        // Limpiar al cerrar
        window.addEventListener('gameContainerClosing', () => {
            this.cleanup();
        }, { once: true });
    }

    /**
     * Configura controles de teclado
     */
    setupKeyboardControls() {
        const keyHandler = (e) => {
            if (!this.gameRunning) return;

            switch(e.key) {
                case 'ArrowUp':
                    if (this.direction !== 'down') this.nextDirection = 'up';
                    break;
                case 'ArrowDown':
                    if (this.direction !== 'up') this.nextDirection = 'down';
                    break;
                case 'ArrowLeft':
                    if (this.direction !== 'right') this.nextDirection = 'left';
                    break;
                case 'ArrowRight':
                    if (this.direction !== 'left') this.nextDirection = 'right';
                    break;
            }
        };

        this.registerEventHandler(document, 'keydown', keyHandler);
    }

    /**
     * Configura controles táctiles
     */
    setupTouchControls() {
        window.InputManager.setupSwipeControls(this.canvas, {
            onSwipeUp: () => {
                if (this.gameRunning && this.direction !== 'down') {
                    this.nextDirection = 'up';
                }
            },
            onSwipeDown: () => {
                if (this.gameRunning && this.direction !== 'up') {
                    this.nextDirection = 'down';
                }
            },
            onSwipeLeft: () => {
                if (this.gameRunning && this.direction !== 'right') {
                    this.nextDirection = 'left';
                }
            },
            onSwipeRight: () => {
                if (this.gameRunning && this.direction !== 'left') {
                    this.nextDirection = 'right';
                }
            }
        });
    }

    /**
     * Inicia el juego
     */
    start() {
        this.reset();
    }

    /**
     * Reinicia el juego
     */
    reset() {
        this.snake = [
            {x: 10, y: 10},
            {x: 9, y: 10},
            {x: 8, y: 10}
        ];
        this.direction = 'right';
        this.nextDirection = 'right';
        this.score = 0;
        this.eatEffectParticles = [];
        this.gameRunning = true;

        this.generateFood();
        this.updateScore(0);
        this.hideGameOver();
        this.startGameLoop(CONSTANTS.SNAKE_FPS);
    }

    /**
     * Genera comida aleatoria
     */
    generateFood() {
        const gridSize = this.canvasSize / this.cellSize;
        this.food = {
            x: Helpers.randomInt(0, gridSize - 1),
            y: Helpers.randomInt(0, gridSize - 1)
        };

        this.currentFood = Helpers.weightedRandom(SNAKE_FOOD_TYPES);

        // Asegurar que no aparezca sobre la serpiente
        for (let segment of this.snake) {
            if (segment.x === this.food.x && segment.y === this.food.y) {
                this.generateFood();
                return;
            }
        }
    }

    /**
     * Actualiza el estado del juego
     */
    update() {
        if (!this.gameRunning) return;

        this.direction = this.nextDirection;

        // Mover serpiente
        const head = {x: this.snake[0].x, y: this.snake[0].y};

        switch(this.direction) {
            case 'up': head.y--; break;
            case 'down': head.y++; break;
            case 'left': head.x--; break;
            case 'right': head.x++; break;
        }

        // Verificar colisión con bordes
        const gridSize = this.canvasSize / this.cellSize;
        if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
            this.gameOver();
            return;
        }

        // Verificar colisión con sí mismo
        for (let i = 0; i < this.snake.length; i++) {
            if (head.x === this.snake[i].x && head.y === this.snake[i].y) {
                this.gameOver();
                return;
            }
        }

        this.snake.unshift(head);

        // Verificar si come
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += this.currentFood.points;
            this.updateScore(this.score);
            this.createEatEffect(this.food.x, this.food.y);
            this.generateFood();
        } else {
            this.snake.pop();
        }

        // Actualizar partículas
        this.updateParticles();
    }

    /**
     * Renderiza el juego
     */
    render() {
        // Limpiar canvas
        this.ctx.fillStyle = CONSTANTS.COLORS.SNAKE_BG;
        this.ctx.fillRect(0, 0, this.canvasSize, this.canvasSize);

        // Dibujar serpiente
        this.ctx.fillStyle = CONSTANTS.COLORS.SNAKE_BODY;
        for (let segment of this.snake) {
            this.ctx.fillRect(
                segment.x * this.cellSize + 1,
                segment.y * this.cellSize + 1,
                this.cellSize - 2,
                this.cellSize - 2
            );
        }

        // Dibujar comida
        this.ctx.fillStyle = this.currentFood.color;
        this.ctx.fillRect(
            this.food.x * this.cellSize + 2,
            this.food.y * this.cellSize + 2,
            this.cellSize - 4,
            this.cellSize - 4
        );

        // Dibujar partículas
        this.renderParticles();
    }

    /**
     * Crea efecto de partículas al comer
     */
    createEatEffect(x, y) {
        const centerX = x * this.cellSize + this.cellSize / 2;
        const centerY = y * this.cellSize + this.cellSize / 2;

        for (let i = 0; i < 8; i++) {
            const angle = (Math.PI * 2 * i) / 8;
            this.eatEffectParticles.push({
                x: centerX,
                y: centerY,
                vx: Math.cos(angle) * 3,
                vy: Math.sin(angle) * 3,
                life: CONSTANTS.ANIMATION.PARTICLE_LIFE,
                color: this.currentFood.color
            });
        }
    }

    /**
     * Actualiza las partículas
     */
    updateParticles() {
        for (let i = this.eatEffectParticles.length - 1; i >= 0; i--) {
            const particle = this.eatEffectParticles[i];
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life--;

            if (particle.life <= 0) {
                this.eatEffectParticles.splice(i, 1);
            }
        }
    }

    /**
     * Renderiza las partículas
     */
    renderParticles() {
        for (let particle of this.eatEffectParticles) {
            const alpha = particle.life / CONSTANTS.ANIMATION.PARTICLE_LIFE;
            this.ctx.fillStyle = particle.color;
            this.ctx.globalAlpha = alpha;
            this.ctx.fillRect(particle.x - 2, particle.y - 2, 4, 4);
            this.ctx.globalAlpha = 1;
        }
    }

    /**
     * Game Over
     */
    gameOver() {
        this.stopGameLoop();

        const finalScoreElement = document.getElementById('finalScore');
        if (finalScoreElement) {
            finalScoreElement.textContent = this.score;
        }

        GameUI.showGameOver(
            this.config.modalId,
            this.config.titleId,
            this.config.messageId,
            '<span style="color: #ff4444;">Game Over!</span>',
            `Final Score: <span id="finalScore" style="color: white; font-weight: 600;">${this.score}</span>`
        );
    }
}

// Función de inicialización para compatibilidad con GameLoader
function initializeSnakeInContainer(gameArea, gameContainer) {
    const game = new SnakeGame();
    game.initialize(gameArea, gameContainer);
}

// Exportar
window.SnakeGame = SnakeGame;
