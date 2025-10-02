/**
 * CombatGame - Juego de tanques usando la nueva arquitectura
 * Extiende BaseGame para heredar funcionalidad común
 */

class Tank {
    constructor(x, y, color, player, canvasSize) {
        this.x = x;
        this.y = y;
        this.angle = player === 1 ? 0 : 180;
        this.color = color;
        this.player = player;
        this.size = CONSTANTS.COMBAT.TANK_SIZE;
        this.speed = CONSTANTS.COMBAT.TANK_SPEED;
        this.bulletCooldown = 0;
        this.maxBullets = CONSTANTS.COMBAT.MAX_BULLETS;
        this.canvasSize = canvasSize;
    }

    rotate(direction) {
        this.angle += direction * 3;
        if (this.angle < 0) this.angle += 360;
        if (this.angle >= 360) this.angle -= 360;
    }

    move(forward, obstacles) {
        const rad = Helpers.toRadians(this.angle);
        const newX = this.x + Math.cos(rad) * this.speed * forward;
        const newY = this.y + Math.sin(rad) * this.speed * forward;

        // Verificar límites
        if (newX > this.size && newX < this.canvasSize - this.size &&
            newY > this.size && newY < this.canvasSize - this.size) {

            // Verificar colisión con obstáculos
            let canMove = true;
            for (let obstacle of obstacles) {
                if (Helpers.checkRectCollision(
                    { x: newX - this.size, y: newY - this.size, width: this.size * 2, height: this.size * 2 },
                    obstacle
                )) {
                    canMove = false;
                    break;
                }
            }

            if (canMove) {
                this.x = newX;
                this.y = newY;
            }
        }
    }

    fire(bullets) {
        if (this.bulletCooldown > 0) return false;

        const activeBullets = bullets.filter(b => b.player === this.player).length;
        if (activeBullets >= this.maxBullets) return false;

        const rad = Helpers.toRadians(this.angle);
        bullets.push({
            x: this.x + Math.cos(rad) * this.size,
            y: this.y + Math.sin(rad) * this.size,
            vx: Math.cos(rad) * CONSTANTS.COMBAT.BULLET_SPEED,
            vy: Math.sin(rad) * CONSTANTS.COMBAT.BULLET_SPEED,
            player: this.player,
            color: this.color
        });

        this.bulletCooldown = CONSTANTS.COMBAT.BULLET_COOLDOWN;
        return true;
    }

    update() {
        if (this.bulletCooldown > 0) {
            this.bulletCooldown--;
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(Helpers.toRadians(this.angle));

        // Cuerpo del tanque
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size, -this.size, this.size * 2, this.size * 2);

        // Cañón
        ctx.fillStyle = this.color;
        ctx.fillRect(0, -3, this.size + 5, 6);

        ctx.restore();
    }
}

class CombatGame extends BaseGame {
    constructor() {
        const config = {
            modalId: 'combatGameOver',
            titleId: 'combatGameOverTitle',
            messageId: 'combatGameOverMessage',
            restartBtnId: 'combatRestartBtn'
        };

        super(config);

        // Estado del juego
        this.canvasSize = 400;
        this.tank1 = null;
        this.tank2 = null;
        this.bullets = [];
        this.obstacles = [];
        this.scoreData = { player1: 0, player2: 0 };
        this.aiTimer = 0;
        this.touchButtons = {};
    }

    /**
     * Crea el canvas del juego
     */
    createCanvas(gameArea) {
        const isMobile = Helpers.isMobile();
        const cellSize = CONSTANTS.CELL_SIZE.COMBAT;
        const desiredSize = isMobile ? Math.min(window.innerWidth - 40, 350) : 500;
        this.canvasSize = Math.floor(desiredSize / cellSize) * cellSize;

        const mobileControls = isMobile ? `
            <div style="display: flex; flex-direction: column; gap: 10px; width: 100%; max-width: ${this.canvasSize}px; margin-top: 20px; align-items: center;">
                <div style="text-align: center; color: #4CAF50; font-size: 12px; font-weight: 600; margin-bottom: 5px;">TU TANQUE AVANZA SOLO - CONTROLA LA DIRECCIÓN</div>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; max-width: 250px;">
                    <button id="p1-left" style="${GameStyles.getButtonStyle()}">⟲ IZQUIERDA</button>
                    <button id="p1-right" style="${GameStyles.getButtonStyle()}">DERECHA ⟳</button>
                </div>
                <button id="p1-fire" style="${GameStyles.getButtonStyle()} padding: 15px 40px;">🔥 DISPARAR</button>
            </div>
        ` : `
            <div style="text-align: center; margin-top: 15px; color: #888; font-size: 12px; max-width: ${this.canvasSize}px;">
                <div style="margin-bottom: 10px;">
                    <strong style="color: #4CAF50;">Tú:</strong> A/D - Rotar, W/S - Mover, Espacio - Disparar
                </div>
                <div style="color: #666; font-size: 11px;">
                    El tanque azul está controlado por la CPU
                </div>
            </div>
        `;

        gameArea.innerHTML = `
            <div style="width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; color: white; position: relative; padding: 20px; overflow-y: auto;">
                <div style="text-align: center; margin-bottom: 20px; max-width: ${this.canvasSize}px;">
                    <div style="margin: 12px 0 0 0; display: flex; justify-content: space-around; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
                        <div>
                            <span style="color: #4CAF50;">Tú:</span>
                            <span id="score-p1" style="color: #4CAF50; font-weight: 600; margin-left: 5px;">0</span>
                        </div>
                        <div>
                            <span style="color: #2196F3;">CPU:</span>
                            <span id="score-p2" style="color: #2196F3; font-weight: 600; margin-left: 5px;">0</span>
                        </div>
                    </div>
                </div>

                <div style="position: relative;">
                    ${GameUI.createGameCanvas(this.canvasSize, 'combatCanvas', {
                        modalId: this.config.modalId,
                        titleId: this.config.titleId,
                        messageId: this.config.messageId,
                        buttonId: this.config.restartBtnId,
                        buttonText: 'New Round'
                    })}
                </div>

                ${mobileControls}
            </div>
        `;

        this.canvas = document.getElementById('combatCanvas');
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
            if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
            }
        };

        this.registerEventHandler(document, 'keydown', keyHandler);
    }

    /**
     * Configura controles táctiles
     */
    setupTouchControls() {
        window.InputManager.setupTouchButtons({
            'p1-left': (pressed) => { this.touchButtons['p1-left'] = pressed; },
            'p1-right': (pressed) => { this.touchButtons['p1-right'] = pressed; },
            'p1-fire': (pressed) => {
                this.touchButtons['p1-fire'] = pressed;
                if (pressed && this.tank1) {
                    this.tank1.fire(this.bullets);
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
        this.bullets = [];
        this.aiTimer = 0;
        this.gameRunning = true;

        // Crear tanques
        this.tank1 = new Tank(
            100,
            this.canvasSize / 2,
            CONSTANTS.COLORS.COMBAT_PLAYER1,
            1,
            this.canvasSize
        );

        this.tank2 = new Tank(
            this.canvasSize - 100,
            this.canvasSize / 2,
            CONSTANTS.COLORS.COMBAT_PLAYER2,
            2,
            this.canvasSize
        );

        this.createObstacles();
        this.updateScoreDisplay();
        this.hideGameOver();

        this.startGameLoop(CONSTANTS.DEFAULT_FPS);
    }

    /**
     * Crea obstáculos
     */
    createObstacles() {
        this.obstacles = [];
        const size = this.canvasSize;
        const obstacleSize = CONSTANTS.COMBAT.OBSTACLE_SIZE;

        this.obstacles.push(
            { x: size / 2 - 60, y: size / 4, width: obstacleSize, height: obstacleSize },
            { x: size / 2 + 20, y: size / 4, width: obstacleSize, height: obstacleSize },
            { x: size / 2 - 60, y: size * 3 / 4 - obstacleSize, width: obstacleSize, height: obstacleSize },
            { x: size / 2 + 20, y: size * 3 / 4 - obstacleSize, width: obstacleSize, height: obstacleSize },
            { x: size / 2 - 20, y: size / 2 - 20, width: obstacleSize, height: obstacleSize }
        );
    }

    /**
     * Actualiza display de puntaje
     */
    updateScoreDisplay() {
        const p1Score = document.getElementById('score-p1');
        const p2Score = document.getElementById('score-p2');
        if (p1Score) p1Score.textContent = this.scoreData.player1;
        if (p2Score) p2Score.textContent = this.scoreData.player2;

        this.updateScore(this.scoreData.player1);
    }

    /**
     * Actualiza el estado del juego
     */
    update() {
        if (!this.gameRunning) return;

        this.handleInput();

        // Actualizar tanques
        if (this.tank1) this.tank1.update();
        if (this.tank2) this.tank2.update();

        // Actualizar balas
        this.updateBullets();

        // Verificar colisiones
        this.checkCollisions();
    }

    /**
     * Maneja input del jugador
     */
    handleInput() {
        const isMobile = Helpers.isMobile();

        if (isMobile) {
            // Touch controls
            if (this.touchButtons['p1-left']) this.tank1.rotate(-1);
            if (this.touchButtons['p1-right']) this.tank1.rotate(1);
            this.tank1.move(1, this.obstacles);
        } else {
            // Keyboard controls
            if (window.InputManager.isAnyKeyPressed('a', 'A')) this.tank1.rotate(-1);
            if (window.InputManager.isAnyKeyPressed('d', 'D')) this.tank1.rotate(1);
            if (window.InputManager.isAnyKeyPressed('w', 'W')) this.tank1.move(1, this.obstacles);
            if (window.InputManager.isAnyKeyPressed('s', 'S')) this.tank1.move(-1, this.obstacles);
            if (window.InputManager.isKeyPressed(' ')) this.tank1.fire(this.bullets);
        }

        // AI
        this.handleAI();
    }

    /**
     * Maneja AI del tanque 2
     */
    handleAI() {
        this.aiTimer++;

        this.tank2.move(1, this.obstacles);

        // Calcular ángulo hacia el jugador
        const dx = this.tank1.x - this.tank2.x;
        const dy = this.tank1.y - this.tank2.y;
        const targetAngle = Helpers.toDegrees(Math.atan2(dy, dx));

        // Normalizar diferencia de ángulo
        let angleDiff = Helpers.normalizeAngle(targetAngle - this.tank2.angle);

        // Rotar hacia el jugador
        if (Math.abs(angleDiff) > 5) {
            this.tank2.rotate(angleDiff > 0 ? 1 : -1);
        }

        // Disparar ocasionalmente
        if (this.aiTimer % 90 === 0 && Math.abs(angleDiff) < 30) {
            this.tank2.fire(this.bullets);
        }
    }

    /**
     * Actualiza balas
     */
    updateBullets() {
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            bullet.x += bullet.vx;
            bullet.y += bullet.vy;

            // Remover si está fuera de límites
            if (bullet.x < 0 || bullet.x > this.canvasSize ||
                bullet.y < 0 || bullet.y > this.canvasSize) {
                this.bullets.splice(i, 1);
                continue;
            }

            // Verificar colisión con obstáculos
            for (let obstacle of this.obstacles) {
                if (Helpers.checkPointInRect({ x: bullet.x, y: bullet.y }, obstacle)) {
                    this.bullets.splice(i, 1);
                    break;
                }
            }
        }
    }

    /**
     * Verifica colisiones
     */
    checkCollisions() {
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];

            // Colisión con tank1
            if (bullet.player === 2) {
                const dist = Helpers.distance(bullet.x, bullet.y, this.tank1.x, this.tank1.y);
                if (dist < this.tank1.size) {
                    this.scoreData.player2++;
                    this.bullets.splice(i, 1);
                    this.endRound('Player 2');
                    return;
                }
            }

            // Colisión con tank2
            if (bullet.player === 1) {
                const dist = Helpers.distance(bullet.x, bullet.y, this.tank2.x, this.tank2.y);
                if (dist < this.tank2.size) {
                    this.scoreData.player1++;
                    this.bullets.splice(i, 1);
                    this.endRound('Player 1');
                    return;
                }
            }
        }
    }

    /**
     * Termina la ronda
     */
    endRound(winner) {
        this.stopGameLoop();
        this.updateScoreDisplay();

        const displayWinner = winner === 'Player 1' ? '¡Ganaste!' : '¡Perdiste!';
        const color = winner === 'Player 1' ? '#4CAF50' : '#2196F3';

        GameUI.showGameOver(
            this.config.modalId,
            this.config.titleId,
            this.config.messageId,
            `<span style="color: ${color};">Round Over!</span>`,
            displayWinner
        );
    }

    /**
     * Renderiza el juego
     */
    render() {
        // Limpiar canvas
        this.ctx.fillStyle = '#222';
        this.ctx.fillRect(0, 0, this.canvasSize, this.canvasSize);

        // Dibujar grid
        GameUI.drawGrid(this.ctx, this.canvasSize, 20);

        // Dibujar obstáculos
        this.ctx.fillStyle = '#666';
        for (let obstacle of this.obstacles) {
            this.ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        }

        // Dibujar tanques
        if (this.tank1) this.tank1.draw(this.ctx);
        if (this.tank2) this.tank2.draw(this.ctx);

        // Dibujar balas
        for (let bullet of this.bullets) {
            this.ctx.fillStyle = bullet.color;
            this.ctx.beginPath();
            this.ctx.arc(bullet.x, bullet.y, 3, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    /**
     * Limpieza
     */
    cleanup() {
        super.cleanup();
        this.touchButtons = {};
    }
}

// Función de inicialización para compatibilidad con GameLoader
function initializeCombatInContainer(gameArea, gameContainer) {
    const game = new CombatGame();
    game.initialize(gameArea, gameContainer);
}

// Exportar
window.CombatGame = CombatGame;
