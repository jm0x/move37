// Combat game variables (inspired by Atari Combat 1977)
let combatGame = {
    canvas: null,
    ctx: null,
    tank1: null,
    tank2: null,
    bullets: [],
    obstacles: [],
    score: { player1: 0, player2: 0 },
    gameRunning: false,
    gameLoop: null,
    cellSize: 20,
    canvasSize: 400,
    touchStartX: 0,
    touchStartY: 0,
    touchButtons: {
        p1Left: null,
        p1Right: null,
        p1Fire: null,
        p2Left: null,
        p2Right: null,
        p2Fire: null
    },
    keys: {},
    isMobile: false,
    aiTimer: 0,
    gameContainer: null,
    keydownHandler: null,
    keyupHandler: null
};

// Tank class
class Tank {
    constructor(x, y, color, player) {
        this.x = x;
        this.y = y;
        this.angle = player === 1 ? 0 : 180;
        this.color = color;
        this.player = player;
        this.size = 15;
        this.speed = 2;
        this.bulletCooldown = 0;
        this.maxBullets = 1;
    }

    rotate(direction) {
        this.angle += direction * 3;
        if (this.angle < 0) this.angle += 360;
        if (this.angle >= 360) this.angle -= 360;
    }

    move(forward) {
        const rad = (this.angle * Math.PI) / 180;
        const newX = this.x + Math.cos(rad) * this.speed * forward;
        const newY = this.y + Math.sin(rad) * this.speed * forward;

        // Check boundaries
        if (newX > this.size && newX < combatGame.canvasSize - this.size &&
            newY > this.size && newY < combatGame.canvasSize - this.size) {

            // Check collision with obstacles
            let canMove = true;
            for (let obstacle of combatGame.obstacles) {
                if (this.checkCollisionWithRect(newX, newY, obstacle)) {
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

    checkCollisionWithRect(x, y, rect) {
        return x - this.size < rect.x + rect.width &&
               x + this.size > rect.x &&
               y - this.size < rect.y + rect.height &&
               y + this.size > rect.y;
    }

    fire() {
        if (this.bulletCooldown > 0) return false;

        const activeBullets = combatGame.bullets.filter(b => b.player === this.player).length;
        if (activeBullets >= this.maxBullets) return false;

        const rad = (this.angle * Math.PI) / 180;
        const bullet = {
            x: this.x + Math.cos(rad) * this.size,
            y: this.y + Math.sin(rad) * this.size,
            vx: Math.cos(rad) * 4,
            vy: Math.sin(rad) * 4,
            player: this.player,
            color: this.color
        };
        combatGame.bullets.push(bullet);
        this.bulletCooldown = 30;
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
        ctx.rotate((this.angle * Math.PI) / 180);

        // Draw tank body
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size, -this.size, this.size * 2, this.size * 2);

        // Draw tank barrel
        ctx.fillStyle = this.color;
        ctx.fillRect(0, -3, this.size + 5, 6);

        ctx.restore();
    }
}

// Nueva función para usar con GameContainer
function initializeCombatInContainer(gameArea, gameContainer) {
    combatGame.gameContainer = gameContainer;

    const isMobile = window.innerWidth < 768;
    const cellSize = 20;
    let desiredSize = isMobile ? Math.min(window.innerWidth - 40, 350) : Math.min(gameArea.offsetWidth - 40, 500);
    const canvasSize = Math.floor(desiredSize / cellSize) * cellSize;

    const mobileControls = isMobile ? `
        <div style="display: flex; flex-direction: column; gap: 10px; width: 100%; max-width: ${canvasSize}px; margin-top: 20px; align-items: center;">
            <div style="text-align: center; color: #4CAF50; font-size: 12px; font-weight: 600; margin-bottom: 5px;">TU TANQUE AVANZA SOLO - CONTROLA LA DIRECCIÓN</div>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; max-width: 250px;">
                <button id="p1-left" style="padding: 15px; background: rgba(76, 175, 80, 0.2); color: #4CAF50; border: 2px solid #4CAF50; border-radius: 8px; font-size: 18px; cursor: pointer; user-select: none; touch-action: manipulation;">⟲ IZQUIERDA</button>
                <button id="p1-right" style="padding: 15px; background: rgba(76, 175, 80, 0.2); color: #4CAF50; border: 2px solid #4CAF50; border-radius: 8px; font-size: 18px; cursor: pointer; user-select: none; touch-action: manipulation;">DERECHA ⟳</button>
            </div>
            <button id="p1-fire" style="padding: 15px 40px; background: rgba(76, 175, 80, 0.3); color: #4CAF50; border: 2px solid #4CAF50; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; user-select: none; touch-action: manipulation;">🔥 DISPARAR</button>
        </div>
    ` : `
        <div style="text-align: center; margin-top: 15px; color: #888; font-size: 12px; max-width: ${canvasSize}px;">
            <div style="text-align: center; margin-bottom: 10px;">
                <strong style="color: #4CAF50;">Tú:</strong> A/D - Rotar, W/S - Mover, Espacio - Disparar
            </div>
            <div style="text-align: center; color: #666; font-size: 11px;">
                El tanque azul está controlado por la CPU
            </div>
        </div>
    `;

    gameArea.innerHTML = `
        <div style="width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; color: white; position: relative; padding: 20px; overflow-y: auto;">
            <div style="text-align: center; margin-bottom: 20px; max-width: ${canvasSize}px;">
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
                <canvas id="combatCanvas" width="${canvasSize}" height="${canvasSize}" style="border: none; border-radius: 8px; background: #222; box-shadow: 0 0 0 1px rgba(255, 107, 53, 0.3), 0 8px 32px rgba(0, 0, 0, 0.6); max-width: 100%;"></canvas>
                <div id="gameOver" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; display: none; background: rgba(0, 0, 0, 0.95); padding: 40px; border-radius: 12px; box-shadow: 0 0 0 1px rgba(255, 107, 53, 0.3), 0 8px 32px rgba(0, 0, 0, 0.8); backdrop-filter: blur(10px); min-width: 250px;">
                    <h3 style="color: #ff6b35; margin-bottom: 20px; font-size: 24px;">Round Over!</h3>
                    <p id="winnerText" style="margin-bottom: 25px; color: #ccc; font-size: 18px;"></p>
                    <button id="restartBtn" style="padding: 12px 28px; background: #ff6b35; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; font-weight: 600; transition: all 0.3s ease; box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);">New Round</button>
                </div>
            </div>

            ${mobileControls}
        </div>
    `;

    initializeCombatGame();

    // Limpiar al cerrar el contenedor
    window.addEventListener('gameContainerClosing', () => {
        cleanupCombatGame();
    }, { once: true });
}

// Load Combat game interface (legacy - mantener para compatibilidad)
function loadCombatGame() {
    const gameContent = document.getElementById('game-content');
    const isMobile = window.innerWidth < 768;
    const cellSize = 20;
    let desiredSize = isMobile ? Math.min(window.innerWidth - 40, 350) : 400;
    const canvasSize = Math.floor(desiredSize / cellSize) * cellSize;

    const mobileControls = isMobile ? `
        <div style="display: flex; flex-direction: column; gap: 10px; width: 100%; max-width: ${canvasSize}px; margin-top: 20px; align-items: center;">
            <div style="text-align: center; color: #4CAF50; font-size: 12px; font-weight: 600; margin-bottom: 5px;">TU TANQUE AVANZA SOLO - CONTROLA LA DIRECCIÓN</div>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; max-width: 250px;">
                <button id="p1-left" style="padding: 15px; background: rgba(76, 175, 80, 0.2); color: #4CAF50; border: 2px solid #4CAF50; border-radius: 8px; font-size: 18px; cursor: pointer; user-select: none; touch-action: manipulation;">⟲ IZQUIERDA</button>
                <button id="p1-right" style="padding: 15px; background: rgba(76, 175, 80, 0.2); color: #4CAF50; border: 2px solid #4CAF50; border-radius: 8px; font-size: 18px; cursor: pointer; user-select: none; touch-action: manipulation;">DERECHA ⟳</button>
            </div>
            <button id="p1-fire" style="padding: 15px 40px; background: rgba(76, 175, 80, 0.3); color: #4CAF50; border: 2px solid #4CAF50; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; user-select: none; touch-action: manipulation;">🔥 DISPARAR</button>
        </div>
    ` : `
        <div style="text-align: center; margin-top: 15px; color: #888; font-size: 12px; max-width: ${canvasSize}px;">
            <div style="text-align: center; margin-bottom: 10px;">
                <strong style="color: #4CAF50;">Tú:</strong> A/D - Rotar, W/S - Mover, Espacio - Disparar
            </div>
            <div style="text-align: center; color: #666; font-size: 11px;">
                El tanque azul está controlado por la CPU
            </div>
        </div>
    `;

    gameContent.innerHTML = `
        <div style="width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%); color: white; position: relative; padding: 20px; overflow-y: auto;">
            <div style="text-align: center; margin-bottom: 20px; max-width: ${canvasSize}px;">
                <h2 style="margin: 0; color: #ff6b35; font-size: 28px; font-weight: 600; letter-spacing: 2px;">🎯 COMBAT</h2>
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
                <canvas id="combatCanvas" width="${canvasSize}" height="${canvasSize}" style="border: none; border-radius: 8px; background: #222; box-shadow: 0 0 0 1px rgba(255, 107, 53, 0.3), 0 8px 32px rgba(0, 0, 0, 0.6); max-width: 100%;"></canvas>
                <div id="gameOver" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; display: none; background: rgba(0, 0, 0, 0.95); padding: 40px; border-radius: 12px; box-shadow: 0 0 0 1px rgba(255, 107, 53, 0.3), 0 8px 32px rgba(0, 0, 0, 0.8); backdrop-filter: blur(10px); min-width: 250px;">
                    <h3 style="color: #ff6b35; margin-bottom: 20px; font-size: 24px;">Round Over!</h3>
                    <p id="winnerText" style="margin-bottom: 25px; color: #ccc; font-size: 18px;"></p>
                    <button id="restartBtn" style="padding: 12px 28px; background: #ff6b35; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; font-weight: 600; transition: all 0.3s ease; box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);">New Round</button>
                </div>
            </div>

            ${mobileControls}
        </div>
    `;

    // Initialize Combat game
    initializeCombatGame();
}

// Initialize Combat game
function initializeCombatGame() {
    combatGame.canvas = document.getElementById('combatCanvas');
    combatGame.ctx = combatGame.canvas.getContext('2d');
    combatGame.canvasSize = combatGame.canvas.width;

    // Detect if mobile
    combatGame.isMobile = window.innerWidth < 768;

    if (combatGame.isMobile) {
        setupTouchControlsCombat();
    } else {
        setupKeyboardControlsCombat();
    }

    startCombatGame();
}

// Setup keyboard controls for Combat
function setupKeyboardControlsCombat() {
    // Limpiar event listeners anteriores si existen
    if (combatGame.keydownHandler) {
        document.removeEventListener('keydown', combatGame.keydownHandler);
    }
    if (combatGame.keyupHandler) {
        document.removeEventListener('keyup', combatGame.keyupHandler);
    }

    combatGame.keydownHandler = (e) => {
        combatGame.keys[e.key] = true;

        if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
        }
    };

    combatGame.keyupHandler = (e) => {
        combatGame.keys[e.key] = false;
    };

    document.addEventListener('keydown', combatGame.keydownHandler);
    document.addEventListener('keyup', combatGame.keyupHandler);
}

// Setup touch controls for Combat
function setupTouchControlsCombat() {
    const buttons = {
        'p1-left': () => combatGame.tank1 && combatGame.tank1.rotate(-1),
        'p1-right': () => combatGame.tank1 && combatGame.tank1.rotate(1),
        'p1-fire': () => combatGame.tank1 && combatGame.tank1.fire()
    };

    Object.keys(buttons).forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
            // Touch events
            btn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                combatGame.touchButtons[id] = true;
                btn.style.transform = 'scale(0.95)';
            });

            btn.addEventListener('touchend', (e) => {
                e.preventDefault();
                combatGame.touchButtons[id] = false;
                btn.style.transform = 'scale(1)';
            });

            // Mouse events for desktop testing
            btn.addEventListener('mousedown', (e) => {
                e.preventDefault();
                combatGame.touchButtons[id] = true;
                btn.style.transform = 'scale(0.95)';
            });

            btn.addEventListener('mouseup', (e) => {
                e.preventDefault();
                combatGame.touchButtons[id] = false;
                btn.style.transform = 'scale(1)';
            });

            btn.addEventListener('mouseleave', () => {
                combatGame.touchButtons[id] = false;
                btn.style.transform = 'scale(1)';
            });
        }
    });
}

// Start Combat game
function startCombatGame() {
    // Reset game variables
    combatGame.bullets = [];
    combatGame.gameRunning = true;
    combatGame.aiTimer = 0;

    // Create tanks
    combatGame.tank1 = new Tank(100, combatGame.canvasSize / 2, '#4CAF50', 1);
    combatGame.tank2 = new Tank(combatGame.canvasSize - 100, combatGame.canvasSize / 2, '#2196F3', 2);

    // Create obstacles
    createObstacles();

    // Update scores
    updateScores();

    // Hide game over screen
    const gameOverDiv = document.getElementById('gameOver');
    if (gameOverDiv) {
        gameOverDiv.style.display = 'none';
    }

    // Setup restart button
    const restartBtn = document.getElementById('restartBtn');
    if (restartBtn) {
        restartBtn.onclick = startCombatGame;
    }

    // Start game loop
    if (combatGame.gameLoop) {
        clearInterval(combatGame.gameLoop);
    }
    combatGame.gameLoop = setInterval(combatGameTick, 1000 / 60);
}

// Create obstacles
function createObstacles() {
    combatGame.obstacles = [];
    const size = combatGame.canvasSize;
    const obstacleSize = 40;

    // Add some obstacles in the middle area
    combatGame.obstacles.push(
        { x: size / 2 - 60, y: size / 4, width: obstacleSize, height: obstacleSize },
        { x: size / 2 + 20, y: size / 4, width: obstacleSize, height: obstacleSize },
        { x: size / 2 - 60, y: size * 3 / 4 - obstacleSize, width: obstacleSize, height: obstacleSize },
        { x: size / 2 + 20, y: size * 3 / 4 - obstacleSize, width: obstacleSize, height: obstacleSize },
        { x: size / 2 - 20, y: size / 2 - 20, width: obstacleSize, height: obstacleSize }
    );
}

// Update scores display
function updateScores() {
    const p1Score = document.getElementById('score-p1');
    const p2Score = document.getElementById('score-p2');
    if (p1Score) p1Score.textContent = combatGame.score.player1;
    if (p2Score) p2Score.textContent = combatGame.score.player2;

    // Actualizar score en GameContainer si está disponible (usar score de player1)
    if (combatGame.gameContainer) {
        combatGame.gameContainer.updateScore(combatGame.score.player1);
    }
}

// Main game loop
function combatGameTick() {
    if (!combatGame.gameRunning) return;

    // Handle input
    handleInput();

    // Update tanks
    if (combatGame.tank1) combatGame.tank1.update();
    if (combatGame.tank2) combatGame.tank2.update();

    // Update bullets
    updateBullets();

    // Check collisions
    checkCollisions();

    // Draw everything
    drawCombatGame();
}

// Handle player input
function handleInput() {
    if (combatGame.isMobile) {
        // Touch controls - Player 1
        if (combatGame.touchButtons['p1-left']) combatGame.tank1.rotate(-1);
        if (combatGame.touchButtons['p1-right']) combatGame.tank1.rotate(1);
        if (combatGame.touchButtons['p1-fire']) combatGame.tank1.fire();

        // Auto-move forward on mobile
        combatGame.tank1.move(1);
    } else {
        // Keyboard controls - Player 1 (WASD + Space)
        if (combatGame.keys['a'] || combatGame.keys['A']) combatGame.tank1.rotate(-1);
        if (combatGame.keys['d'] || combatGame.keys['D']) combatGame.tank1.rotate(1);
        if (combatGame.keys['w'] || combatGame.keys['W']) combatGame.tank1.move(1);
        if (combatGame.keys['s'] || combatGame.keys['S']) combatGame.tank1.move(-1);
        if (combatGame.keys[' ']) combatGame.tank1.fire();
    }

    // AI controls Player 2 always (mobile and desktop)
    handleAI();
}

// Simple AI for Player 2 on mobile
function handleAI() {
    combatGame.aiTimer++;

    // Move forward continuously
    combatGame.tank2.move(1);

    // Calculate angle to player
    const dx = combatGame.tank1.x - combatGame.tank2.x;
    const dy = combatGame.tank1.y - combatGame.tank2.y;
    const targetAngle = Math.atan2(dy, dx) * 180 / Math.PI;

    // Normalize angles
    let angleDiff = targetAngle - combatGame.tank2.angle;
    while (angleDiff > 180) angleDiff -= 360;
    while (angleDiff < -180) angleDiff += 360;

    // Rotate towards player with some randomness
    if (Math.abs(angleDiff) > 5) {
        if (angleDiff > 0) {
            combatGame.tank2.rotate(1);
        } else {
            combatGame.tank2.rotate(-1);
        }
    }

    // Fire occasionally when roughly aimed at player
    if (combatGame.aiTimer % 90 === 0 && Math.abs(angleDiff) < 30) {
        combatGame.tank2.fire();
    }
}

// Update bullets
function updateBullets() {
    for (let i = combatGame.bullets.length - 1; i >= 0; i--) {
        const bullet = combatGame.bullets[i];
        bullet.x += bullet.vx;
        bullet.y += bullet.vy;

        // Remove if out of bounds
        if (bullet.x < 0 || bullet.x > combatGame.canvasSize ||
            bullet.y < 0 || bullet.y > combatGame.canvasSize) {
            combatGame.bullets.splice(i, 1);
            continue;
        }

        // Check collision with obstacles
        for (let obstacle of combatGame.obstacles) {
            if (bullet.x > obstacle.x && bullet.x < obstacle.x + obstacle.width &&
                bullet.y > obstacle.y && bullet.y < obstacle.y + obstacle.height) {
                combatGame.bullets.splice(i, 1);
                break;
            }
        }
    }
}

// Check collisions
function checkCollisions() {
    for (let i = combatGame.bullets.length - 1; i >= 0; i--) {
        const bullet = combatGame.bullets[i];

        // Check collision with tank1
        if (bullet.player === 2) {
            const dx = bullet.x - combatGame.tank1.x;
            const dy = bullet.y - combatGame.tank1.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < combatGame.tank1.size) {
                combatGame.score.player2++;
                combatGame.bullets.splice(i, 1);
                endRound('Player 2');
                return;
            }
        }

        // Check collision with tank2
        if (bullet.player === 1) {
            const dx = bullet.x - combatGame.tank2.x;
            const dy = bullet.y - combatGame.tank2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < combatGame.tank2.size) {
                combatGame.score.player1++;
                combatGame.bullets.splice(i, 1);
                endRound('Player 1');
                return;
            }
        }
    }
}

// Draw the game
function drawCombatGame() {
    const ctx = combatGame.ctx;

    // Clear canvas
    ctx.fillStyle = '#222';
    ctx.fillRect(0, 0, combatGame.canvasSize, combatGame.canvasSize);

    // Draw grid (optional, for retro feel)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i < combatGame.canvasSize; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, combatGame.canvasSize);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(combatGame.canvasSize, i);
        ctx.stroke();
    }

    // Draw obstacles
    ctx.fillStyle = '#666';
    for (let obstacle of combatGame.obstacles) {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    }

    // Draw tanks
    if (combatGame.tank1) combatGame.tank1.draw(ctx);
    if (combatGame.tank2) combatGame.tank2.draw(ctx);

    // Draw bullets
    for (let bullet of combatGame.bullets) {
        ctx.fillStyle = bullet.color;
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, 3, 0, Math.PI * 2);
        ctx.fill();
    }
}

// End round
function endRound(winner) {
    combatGame.gameRunning = false;
    clearInterval(combatGame.gameLoop);

    updateScores();

    const gameOverDiv = document.getElementById('gameOver');
    const winnerText = document.getElementById('winnerText');

    if (gameOverDiv && winnerText) {
        const displayWinner = winner === 'Player 1' ? '¡Ganaste!' : '¡Perdiste!';
        winnerText.textContent = displayWinner;
        winnerText.style.color = winner === 'Player 1' ? '#4CAF50' : '#2196F3';
        gameOverDiv.style.display = 'block';
    }
}

// Cleanup function
function cleanupCombatGame() {
    combatGame.gameRunning = false;

    if (combatGame.gameLoop) {
        clearInterval(combatGame.gameLoop);
        combatGame.gameLoop = null;
    }

    if (combatGame.keydownHandler) {
        document.removeEventListener('keydown', combatGame.keydownHandler);
        combatGame.keydownHandler = null;
    }

    if (combatGame.keyupHandler) {
        document.removeEventListener('keyup', combatGame.keyupHandler);
        combatGame.keyupHandler = null;
    }

    // Limpiar referencias de botones táctiles
    Object.keys(combatGame.touchButtons).forEach(key => {
        combatGame.touchButtons[key] = null;
    });

    // Limpiar el objeto keys
    combatGame.keys = {};
}