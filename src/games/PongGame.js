/**
 * PaddleGame - Juego Paddle usando la nueva arquitectura
 * Extiende BaseGame para heredar funcionalidad común
 */

class PaddleGame extends BaseGame {
    constructor() {
        const config = {
            modalId: 'pongGameOver',
            titleId: 'pongGameOverTitle',
            messageId: 'pongGameOverMessage',
            restartBtnId: 'pongRestartBtn'
        };

        super(config);

        // Estado del juego
        this.canvasSize = 450;
        this.paddle1 = { x: 10, y: 0, width: 10, height: 80, speed: 0 };
        this.paddle2 = { x: 0, y: 0, width: 10, height: 80, speed: 0 };
        this.ball = { x: 0, y: 0, radius: 8, speedX: 0, speedY: 0 };
        this.scoreData = { player: 0, ai: 0 };
        this.touchStartY = 0;
    }

    /**
     * Crea el canvas del juego
     */
    createCanvas(gameArea) {
        const isMobile = Helpers.isMobile();
        this.canvasSize = isMobile ? window.innerWidth : 450;

        gameArea.innerHTML = GameUI.createGameCanvas(this.canvasSize, 'paddleCanvas', {
            modalId: this.config.modalId,
            titleId: this.config.titleId,
            messageId: this.config.messageId,
            buttonId: this.config.restartBtnId,
            buttonText: 'Play Again'
        });

        GameUI.setupGameOverModal({
            titleId: this.config.titleId,
            titleText: '<span style="color: #4CAF50;">Game Over!</span>',
            messageId: this.config.messageId,
            messageText: 'Final Score: <span id="pongFinalScore" style="color: white; font-weight: 600;">0 - 0</span>'
        });

        this.canvas = document.getElementById('paddleCanvas');
        this.ctx = this.canvas.getContext('2d');

        // Ajustar posiciones de paletas
        this.paddle2.x = this.canvasSize - 20;
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
        const keyDownHandler = (e) => {
            if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                e.preventDefault();
            }
        };

        this.registerEventHandler(document, 'keydown', keyDownHandler);
    }

    /**
     * Configura controles táctiles
     */
    setupTouchControls() {
        window.InputManager.setupTouchControls(this.canvas, {
            onTouchStart: (touch) => {
                this.touchStartY = touch.clientY;
            },

            onTouchMove: (touch) => {
                if (!this.gameRunning) return;

                const deltaY = touch.clientY - this.touchStartY;

                if (Math.abs(deltaY) > 5) {
                    this.paddle1.y += deltaY * 0.5;
                    this.touchStartY = touch.clientY;

                    // Limitar movimiento
                    this.paddle1.y = Helpers.clamp(
                        this.paddle1.y,
                        0,
                        this.canvasSize - this.paddle1.height
                    );
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
        // Resetear posiciones
        this.paddle1.y = this.canvasSize / 2 - this.paddle1.height / 2;
        this.paddle2.y = this.canvasSize / 2 - this.paddle2.height / 2;

        this.resetBall();

        // Resetear puntuación
        this.scoreData.player = 0;
        this.scoreData.ai = 0;

        this.gameRunning = true;
        this.hideGameOver();
        this.updateScore(0);

        this.startGameLoop(CONSTANTS.DEFAULT_FPS);
    }

    /**
     * Resetea la pelota
     */
    resetBall() {
        this.ball.x = this.canvasSize / 2;
        this.ball.y = this.canvasSize / 2;

        const angle = Helpers.randomFloat(-Math.PI / 4, Math.PI / 4);
        const direction = Math.random() < 0.5 ? 1 : -1;

        this.ball.speedX = Math.cos(angle) * CONSTANTS.PADDLE.BALL_SPEED_X * direction;
        this.ball.speedY = Math.sin(angle) * CONSTANTS.PADDLE.BALL_SPEED_Y;
    }

    /**
     * Actualiza el estado del juego
     */
    update() {
        if (!this.gameRunning) return;

        // Mover paddle del jugador (teclado)
        if (window.InputManager.isKeyPressed('ArrowUp')) {
            this.paddle1.y -= CONSTANTS.PADDLE.PADDLE_SPEED;
        }
        if (window.InputManager.isKeyPressed('ArrowDown')) {
            this.paddle1.y += CONSTANTS.PADDLE.PADDLE_SPEED;
        }

        // Limitar paddle del jugador
        this.paddle1.y = Helpers.clamp(
            this.paddle1.y,
            0,
            this.canvasSize - this.paddle1.height
        );

        // AI del paddle enemigo
        this.updateAI();

        // Mover pelota
        this.ball.x += this.ball.speedX;
        this.ball.y += this.ball.speedY;

        // Colisión con paredes superior e inferior
        if (this.ball.y - this.ball.radius <= 0 ||
            this.ball.y + this.ball.radius >= this.canvasSize) {
            this.ball.speedY *= -1;
        }

        // Colisión con paddle izquierdo (jugador)
        if (this.ball.x - this.ball.radius <= this.paddle1.x + this.paddle1.width &&
            this.ball.y >= this.paddle1.y &&
            this.ball.y <= this.paddle1.y + this.paddle1.height) {

            this.ball.speedX = Math.abs(this.ball.speedX);

            const hitPos = (this.ball.y - this.paddle1.y) / this.paddle1.height;
            this.ball.speedY = (hitPos - 0.5) * CONSTANTS.PADDLE.BALL_SPEED_Y * 2;
        }

        // Colisión con paddle derecho (AI)
        if (this.ball.x + this.ball.radius >= this.paddle2.x &&
            this.ball.y >= this.paddle2.y &&
            this.ball.y <= this.paddle2.y + this.paddle2.height) {

            this.ball.speedX = -Math.abs(this.ball.speedX);

            const hitPos = (this.ball.y - this.paddle2.y) / this.paddle2.height;
            this.ball.speedY = (hitPos - 0.5) * CONSTANTS.PADDLE.BALL_SPEED_Y * 2;
        }

        // Punto para AI
        if (this.ball.x - this.ball.radius <= 0) {
            this.scoreData.ai++;
            this.updateScore(this.scoreData.player);
            this.checkWinner();
            if (this.gameRunning) {
                this.resetBall();
            }
        }

        // Punto para jugador
        if (this.ball.x + this.ball.radius >= this.canvasSize) {
            this.scoreData.player++;
            this.updateScore(this.scoreData.player);
            this.checkWinner();
            if (this.gameRunning) {
                this.resetBall();
            }
        }
    }

    /**
     * Actualiza AI
     */
    updateAI() {
        const paddleCenter = this.paddle2.y + this.paddle2.height / 2;
        const ballY = this.ball.y;

        // La AI solo reacciona si la pelota se acerca
        if (this.ball.speedX > 0) {
            const diff = ballY - paddleCenter;

            if (Math.abs(diff) > 10) {
                const moveSpeed = CONSTANTS.PADDLE.PADDLE_SPEED * CONSTANTS.PADDLE.AI_DIFFICULTY;
                this.paddle2.y += diff > 0 ? moveSpeed : -moveSpeed;
            }
        }

        // Limitar paddle de AI
        this.paddle2.y = Helpers.clamp(
            this.paddle2.y,
            0,
            this.canvasSize - this.paddle2.height
        );
    }

    /**
     * Verifica ganador
     */
    checkWinner() {
        if (this.scoreData.player >= CONSTANTS.PADDLE.MAX_SCORE ||
            this.scoreData.ai >= CONSTANTS.PADDLE.MAX_SCORE) {
            this.endGame();
        }
    }

    /**
     * Termina el juego
     */
    endGame() {
        this.stopGameLoop();

        const finalScoreElement = document.getElementById('pongFinalScore');
        if (finalScoreElement) {
            finalScoreElement.textContent = `${this.scoreData.player} - ${this.scoreData.ai}`;
        }

        const won = this.scoreData.player > this.scoreData.ai;

        GameUI.showGameOver(
            this.config.modalId,
            this.config.titleId,
            this.config.messageId,
            won ? '<span style="color: #4CAF50;">You Win! 🎉</span>' : '<span style="color: #FF6B6B;">AI Wins! 🤖</span>',
            `Final Score: <span id="pongFinalScore" style="color: white; font-weight: 600;">${this.scoreData.player} - ${this.scoreData.ai}</span>`
        );
    }

    /**
     * Renderiza el juego
     */
    render() {
        // Limpiar canvas
        this.ctx.fillStyle = CONSTANTS.COLORS.BLACK;
        this.ctx.fillRect(0, 0, this.canvasSize, this.canvasSize);

        // Línea central
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([10, 10]);
        this.ctx.beginPath();
        this.ctx.moveTo(this.canvasSize / 2, 0);
        this.ctx.lineTo(this.canvasSize / 2, this.canvasSize);
        this.ctx.stroke();
        this.ctx.setLineDash([]);

        // Paddle jugador
        this.ctx.fillStyle = CONSTANTS.COLORS.PADDLE_PLAYER;
        this.ctx.fillRect(
            this.paddle1.x,
            this.paddle1.y,
            this.paddle1.width,
            this.paddle1.height
        );

        // Paddle AI
        this.ctx.fillStyle = CONSTANTS.COLORS.PADDLE_AI;
        this.ctx.fillRect(
            this.paddle2.x,
            this.paddle2.y,
            this.paddle2.width,
            this.paddle2.height
        );

        // Pelota
        this.ctx.fillStyle = CONSTANTS.COLORS.PADDLE_BALL;
        this.ctx.beginPath();
        this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
        this.ctx.fill();

        // Marcador
        GameUI.drawCenteredText(
            this.ctx,
            `${this.scoreData.player} - ${this.scoreData.ai}`,
            40,
            30,
            'rgba(255, 255, 255, 0.5)'
        );
    }
}

// Función de inicialización para compatibilidad con GameLoader
function initializePaddleInContainer(gameArea, gameContainer) {
    const game = new PaddleGame();
    game.initialize(gameArea, gameContainer);
}

// Exportar
window.PaddleGame = PaddleGame;
