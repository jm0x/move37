// Pong game variables
let pongGame = {
    canvas: null,
    ctx: null,
    canvasSize: 400,
    paddle1: { x: 10, y: 0, width: 10, height: 80, speed: 0 },
    paddle2: { x: 0, y: 0, width: 10, height: 80, speed: 0 },
    ball: { x: 0, y: 0, radius: 8, speedX: 0, speedY: 0 },
    score: { player: 0, ai: 0 },
    gameRunning: false,
    gameLoop: null,
    gameContainer: null,
    keyboardHandler: null,
    keys: {},
    touchStartY: 0,
    aiDifficulty: 0.85, // 0-1, mayor = más difícil
    maxScore: 5,
    paddleSpeed: 6,
    ballSpeedX: 5,
    ballSpeedY: 5
};

// Inicializar Pong en el GameContainer
function initializePongInContainer(gameArea, gameContainer) {
    pongGame.gameContainer = gameContainer;

    const isMobile = window.innerWidth < 768;
    let canvasSize = isMobile ? window.innerWidth : 450;

    const gameOverModal = GameStyles.createResultModalHTML(
        'pongGameOver',
        'pongGameOverTitle',
        'pongGameOverMessage',
        'pongRestartBtn',
        'Play Again'
    );

    gameArea.innerHTML = GameStyles.createGameAreaHTML(canvasSize, 'pongCanvas', gameOverModal);

    // Configurar contenido del modal de Game Over
    setTimeout(() => {
        document.getElementById('pongGameOverTitle').innerHTML = '<span style="color: #4CAF50;">Game Over!</span>';
        document.getElementById('pongGameOverMessage').innerHTML = 'Final Score: <span id="pongFinalScore" style="color: white; font-weight: 600;">0 - 0</span>';
    }, 0);

    pongGame.canvasSize = canvasSize;
    initializePongGame();
}

// Inicializar el juego
function initializePongGame() {
    pongGame.canvas = document.getElementById('pongCanvas');
    pongGame.ctx = pongGame.canvas.getContext('2d');

    const isMobile = window.innerWidth < 768;

    if (isMobile) {
        setupPongTouchControls();
    } else {
        setupPongKeyboardControls();
    }

    startPongGame();
}

// Configurar controles de teclado
function setupPongKeyboardControls() {
    pongGame.keyboardHandler = (e) => {
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            e.preventDefault();
        }
        pongGame.keys[e.key] = true;
    };

    const keyUpHandler = (e) => {
        pongGame.keys[e.key] = false;
    };

    document.addEventListener('keydown', pongGame.keyboardHandler);
    document.addEventListener('keyup', keyUpHandler);

    // Limpiar al cerrar el contenedor
    window.addEventListener('gameContainerClosing', () => {
        document.removeEventListener('keydown', pongGame.keyboardHandler);
        document.removeEventListener('keyup', keyUpHandler);
        cleanupPongGame();
    }, { once: true });
}

// Configurar controles táctiles (swipe)
function setupPongTouchControls() {
    pongGame.canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        pongGame.touchStartY = touch.clientY;
    });

    pongGame.canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        if (!pongGame.gameRunning) return;

        const touch = e.touches[0];
        const deltaY = touch.clientY - pongGame.touchStartY;

        // Mover la paleta según el movimiento
        if (Math.abs(deltaY) > 5) {
            pongGame.paddle1.y += deltaY * 0.5;
            pongGame.touchStartY = touch.clientY;

            // Limitar movimiento
            if (pongGame.paddle1.y < 0) pongGame.paddle1.y = 0;
            if (pongGame.paddle1.y + pongGame.paddle1.height > pongGame.canvasSize) {
                pongGame.paddle1.y = pongGame.canvasSize - pongGame.paddle1.height;
            }
        }
    });

    // Limpiar al cerrar
    window.addEventListener('gameContainerClosing', () => {
        cleanupPongGame();
    }, { once: true });
}

// Iniciar el juego
function startPongGame() {
    // Resetear posiciones
    pongGame.paddle1.y = pongGame.canvasSize / 2 - pongGame.paddle1.height / 2;
    pongGame.paddle2.x = pongGame.canvasSize - 20;
    pongGame.paddle2.y = pongGame.canvasSize / 2 - pongGame.paddle2.height / 2;

    // Resetear pelota
    resetBall();

    // Resetear puntuación
    pongGame.score.player = 0;
    pongGame.score.ai = 0;

    pongGame.gameRunning = true;

    // Ocultar modal de game over
    document.getElementById('pongGameOver').style.display = 'none';

    // Configurar botón restart
    document.getElementById('pongRestartBtn').addEventListener('click', startPongGame);

    // Actualizar puntuación
    updatePongScore();

    // Iniciar game loop
    pongGame.gameLoop = setInterval(pongGameTick, 1000 / 60); // 60 FPS
}

// Resetear la pelota
function resetBall() {
    pongGame.ball.x = pongGame.canvasSize / 2;
    pongGame.ball.y = pongGame.canvasSize / 2;

    // Dirección aleatoria
    const angle = (Math.random() * Math.PI / 2) - Math.PI / 4; // ±45 grados
    const direction = Math.random() < 0.5 ? 1 : -1;

    pongGame.ball.speedX = Math.cos(angle) * pongGame.ballSpeedX * direction;
    pongGame.ball.speedY = Math.sin(angle) * pongGame.ballSpeedY;
}

// Actualizar puntuación
function updatePongScore() {
    if (pongGame.gameContainer) {
        pongGame.gameContainer.updateScore(pongGame.score.player);
    }
}

// Game loop principal
function pongGameTick() {
    if (!pongGame.gameRunning) return;

    // Mover paddle del jugador (teclado)
    if (pongGame.keys['ArrowUp']) {
        pongGame.paddle1.y -= pongGame.paddleSpeed;
    }
    if (pongGame.keys['ArrowDown']) {
        pongGame.paddle1.y += pongGame.paddleSpeed;
    }

    // Limitar paddle del jugador
    if (pongGame.paddle1.y < 0) pongGame.paddle1.y = 0;
    if (pongGame.paddle1.y + pongGame.paddle1.height > pongGame.canvasSize) {
        pongGame.paddle1.y = pongGame.canvasSize - pongGame.paddle1.height;
    }

    // AI del paddle enemigo
    updateAI();

    // Mover pelota
    pongGame.ball.x += pongGame.ball.speedX;
    pongGame.ball.y += pongGame.ball.speedY;

    // Colisión con paredes superior e inferior
    if (pongGame.ball.y - pongGame.ball.radius <= 0 ||
        pongGame.ball.y + pongGame.ball.radius >= pongGame.canvasSize) {
        pongGame.ball.speedY *= -1;
    }

    // Colisión con paddle izquierdo (jugador)
    if (pongGame.ball.x - pongGame.ball.radius <= pongGame.paddle1.x + pongGame.paddle1.width &&
        pongGame.ball.y >= pongGame.paddle1.y &&
        pongGame.ball.y <= pongGame.paddle1.y + pongGame.paddle1.height) {

        // Cambiar dirección
        pongGame.ball.speedX = Math.abs(pongGame.ball.speedX);

        // Añadir efecto según donde golpea
        const hitPos = (pongGame.ball.y - pongGame.paddle1.y) / pongGame.paddle1.height;
        pongGame.ball.speedY = (hitPos - 0.5) * pongGame.ballSpeedY * 2;
    }

    // Colisión con paddle derecho (AI)
    if (pongGame.ball.x + pongGame.ball.radius >= pongGame.paddle2.x &&
        pongGame.ball.y >= pongGame.paddle2.y &&
        pongGame.ball.y <= pongGame.paddle2.y + pongGame.paddle2.height) {

        // Cambiar dirección
        pongGame.ball.speedX = -Math.abs(pongGame.ball.speedX);

        // Añadir efecto según donde golpea
        const hitPos = (pongGame.ball.y - pongGame.paddle2.y) / pongGame.paddle2.height;
        pongGame.ball.speedY = (hitPos - 0.5) * pongGame.ballSpeedY * 2;
    }

    // Punto para AI (pelota sale por la izquierda)
    if (pongGame.ball.x - pongGame.ball.radius <= 0) {
        pongGame.score.ai++;
        updatePongScore();
        checkWinner();
        if (pongGame.gameRunning) {
            resetBall();
        }
    }

    // Punto para jugador (pelota sale por la derecha)
    if (pongGame.ball.x + pongGame.ball.radius >= pongGame.canvasSize) {
        pongGame.score.player++;
        updatePongScore();
        checkWinner();
        if (pongGame.gameRunning) {
            resetBall();
        }
    }

    // Dibujar
    drawPongGame();
}

// Actualizar AI
function updateAI() {
    const paddleCenter = pongGame.paddle2.y + pongGame.paddle2.height / 2;
    const ballY = pongGame.ball.y;

    // La AI solo reacciona si la pelota se acerca
    if (pongGame.ball.speedX > 0) {
        const diff = ballY - paddleCenter;

        // Movimiento con algo de error para que no sea perfecta
        if (Math.abs(diff) > 10) {
            const moveSpeed = pongGame.paddleSpeed * pongGame.aiDifficulty;
            if (diff > 0) {
                pongGame.paddle2.y += moveSpeed;
            } else {
                pongGame.paddle2.y -= moveSpeed;
            }
        }
    }

    // Limitar paddle de AI
    if (pongGame.paddle2.y < 0) pongGame.paddle2.y = 0;
    if (pongGame.paddle2.y + pongGame.paddle2.height > pongGame.canvasSize) {
        pongGame.paddle2.y = pongGame.canvasSize - pongGame.paddle2.height;
    }
}

// Verificar ganador
function checkWinner() {
    if (pongGame.score.player >= pongGame.maxScore || pongGame.score.ai >= pongGame.maxScore) {
        pongGameOver();
    }
}

// Dibujar el juego
function drawPongGame() {
    const ctx = pongGame.ctx;

    // Limpiar canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, pongGame.canvasSize, pongGame.canvasSize);

    // Línea central
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(pongGame.canvasSize / 2, 0);
    ctx.lineTo(pongGame.canvasSize / 2, pongGame.canvasSize);
    ctx.stroke();
    ctx.setLineDash([]);

    // Paddle jugador (izquierda - verde)
    ctx.fillStyle = '#4CAF50';
    ctx.fillRect(
        pongGame.paddle1.x,
        pongGame.paddle1.y,
        pongGame.paddle1.width,
        pongGame.paddle1.height
    );

    // Paddle AI (derecha - rojo)
    ctx.fillStyle = '#FF6B6B';
    ctx.fillRect(
        pongGame.paddle2.x,
        pongGame.paddle2.y,
        pongGame.paddle2.width,
        pongGame.paddle2.height
    );

    // Pelota
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(pongGame.ball.x, pongGame.ball.y, pongGame.ball.radius, 0, Math.PI * 2);
    ctx.fill();

    // Marcador en el canvas
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(
        `${pongGame.score.player} - ${pongGame.score.ai}`,
        pongGame.canvasSize / 2,
        40
    );
}

// Game Over
function pongGameOver() {
    pongGame.gameRunning = false;
    clearInterval(pongGame.gameLoop);

    const finalScoreElement = document.getElementById('pongFinalScore');
    if (finalScoreElement) {
        finalScoreElement.textContent = `${pongGame.score.player} - ${pongGame.score.ai}`;
    }

    const gameOverElement = document.getElementById('pongGameOver');
    const titleElement = document.getElementById('pongGameOverTitle');

    if (gameOverElement && titleElement) {
        if (pongGame.score.player > pongGame.score.ai) {
            titleElement.innerHTML = '<span style="color: #4CAF50;">You Win! 🎉</span>';
        } else {
            titleElement.innerHTML = '<span style="color: #FF6B6B;">AI Wins! 🤖</span>';
        }
        gameOverElement.style.display = 'block';
    }
}

// Limpiar el juego
function cleanupPongGame() {
    pongGame.gameRunning = false;
    if (pongGame.gameLoop) {
        clearInterval(pongGame.gameLoop);
    }
    if (pongGame.keyboardHandler) {
        document.removeEventListener('keydown', pongGame.keyboardHandler);
    }
}
