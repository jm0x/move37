// Snake game variables
let snakeGame = {
    canvas: null,
    ctx: null,
    snake: [],
    food: {},
    direction: 'right',
    nextDirection: 'right',
    score: 0,
    gameRunning: false,
    gameLoop: null,
    cellSize: 20,
    canvasSize: 400,
    touchStartX: 0,
    touchStartY: 0,
    lastAccelerometerTime: 0,
    gameContainer: null,
    keyboardHandler: null,
    touchStartHandler: null,
    touchEndHandler: null,
    foodTypes: [
        { color: '#4ECDC4', points: 5, weight: 50 },    // Turquesa - común (50%)
        { color: '#45B7D1', points: 5, weight: 50 },    // Azul claro - común (50%)
        { color: '#FFA07A', points: 10, weight: 30 },   // Naranja - poco común (30%)
        { color: '#F7DC6F', points: 10, weight: 30 },   // Amarillo - poco común (30%)
        { color: '#98D8C8', points: 15, weight: 15 },   // Verde agua - raro (15%)
        { color: '#BB8FCE', points: 15, weight: 15 },   // Morado claro - raro (15%)
        { color: '#FF6B6B', points: 25, weight: 5 },    // Rojo - muy raro (5%)
        { color: '#FFD700', points: 50, weight: 2 }     // Dorado - épico (2%)
    ],
    currentFood: { color: '#4ECDC4', points: 5 },
    eatEffectParticles: []
};

// Nueva función para usar con GameContainer
function initializeSnakeInContainer(gameArea, gameContainer) {
    snakeGame.gameContainer = gameContainer;

    const isMobile = window.innerWidth < 768;

    // Ajustar cellSize para que quepa perfectamente
    const cellSize = 24;

    // El canvas debe ser múltiplo exacto de cellSize tanto en móvil como desktop
    let canvasSize;
    if (isMobile) {
        const screenWidth = window.innerWidth;
        canvasSize = Math.floor(screenWidth / cellSize) * cellSize;
    } else {
        // Desktop: ajustar 450 al múltiplo más cercano de cellSize
        // 450 / 24 = 18.75, entonces usamos 18 * 24 = 432
        canvasSize = Math.floor(450 / cellSize) * cellSize;
    }

    const gameOverModal = GameStyles.createResultModalHTML('gameOver', 'gameOverTitle', 'gameOverMessage', 'restartBtn', 'Restart');

    gameArea.innerHTML = GameStyles.createGameAreaHTML(canvasSize, 'snakeCanvas', gameOverModal);

    // Configurar contenido del modal de Game Over
    setTimeout(() => {
        document.getElementById('gameOverTitle').innerHTML = '<span style="color: #ff4444;">Game Over!</span>';
        document.getElementById('gameOverMessage').innerHTML = 'Final Score: <span id="finalScore" style="color: white; font-weight: 600;">0</span>';
    }, 0);

    // Actualizar cellSize en el objeto del juego
    snakeGame.cellSize = cellSize;

    initializeSnakeGame();
}

// Load Snake game interface (legacy - mantener para compatibilidad)
function loadSnakeGame() {
    const gameContent = document.getElementById('game-content');
    const isMobile = window.innerWidth < 768;
    const cellSize = 20;
    let desiredSize = isMobile ? Math.min(window.innerWidth - 40, 400) : 400;
    const canvasSize = Math.floor(desiredSize / cellSize) * cellSize;

    gameContent.innerHTML = `
        <div style="width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%); color: white; position: relative; padding: 20px;">
            <div style="text-align: center; margin-bottom: 20px; max-width: ${canvasSize}px;">
                <h2 style="margin: 0; color: #4CAF50; font-size: 28px; font-weight: 600; letter-spacing: 2px;">🐍 SNAKE</h2>
                <p style="margin: 12px 0 0 0; color: #888; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Score: <span id="score" style="color: #4CAF50; font-weight: 600;">0</span></p>
            </div>

            <div style="position: relative;">
                <canvas id="snakeCanvas" width="${canvasSize}" height="${canvasSize}" style="border: none; border-radius: 8px; background: #000; box-shadow: 0 0 0 1px rgba(76, 175, 80, 0.3), 0 8px 32px rgba(0, 0, 0, 0.6); max-width: 100%;"></canvas>
                <div id="gameOver" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; display: none; background: rgba(0, 0, 0, 0.95); padding: 40px; border-radius: 12px; box-shadow: 0 0 0 1px rgba(255, 68, 68, 0.3), 0 8px 32px rgba(0, 0, 0, 0.8); backdrop-filter: blur(10px);">
                    <h3 style="color: #ff4444; margin-bottom: 20px; font-size: 24px;">Game Over!</h3>
                    <p style="margin-bottom: 25px; color: #ccc;">Final Score: <span id="finalScore" style="color: #4CAF50; font-weight: 600;">0</span></p>
                    <button id="restartBtn" style="padding: 12px 28px; background: #4CAF50; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; font-weight: 600; transition: all 0.3s ease; box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);">Restart</button>
                </div>
            </div>
        </div>
    `;

    initializeSnakeGame();
}

// Initialize Snake game
function initializeSnakeGame() {
    snakeGame.canvas = document.getElementById('snakeCanvas');
    snakeGame.ctx = snakeGame.canvas.getContext('2d');

    // Update canvas size in game variables
    snakeGame.canvasSize = snakeGame.canvas.width;

    // Detect if mobile
    const isMobile = window.innerWidth < 768;

    if (isMobile) {
        setupTouchControls();
    } else {
        setupKeyboardControls();
    }

    startSnakeGame();
}

// Setup keyboard controls
function setupKeyboardControls() {
    // Remover event listener anterior si existe
    if (snakeGame.keyboardHandler) {
        document.removeEventListener('keydown', snakeGame.keyboardHandler);
    }

    snakeGame.keyboardHandler = (e) => {
        if (!snakeGame.gameRunning) return;

        switch(e.key) {
            case 'ArrowUp':
                if (snakeGame.direction !== 'down') snakeGame.nextDirection = 'up';
                break;
            case 'ArrowDown':
                if (snakeGame.direction !== 'up') snakeGame.nextDirection = 'down';
                break;
            case 'ArrowLeft':
                if (snakeGame.direction !== 'right') snakeGame.nextDirection = 'left';
                break;
            case 'ArrowRight':
                if (snakeGame.direction !== 'left') snakeGame.nextDirection = 'right';
                break;
        }
    };

    document.addEventListener('keydown', snakeGame.keyboardHandler);

    // Limpiar al cerrar el contenedor
    window.addEventListener('gameContainerClosing', () => {
        if (snakeGame.keyboardHandler) {
            document.removeEventListener('keydown', snakeGame.keyboardHandler);
        }
        cleanupSnakeGame();
    }, { once: true });
}

// Setup touch swipe controls
function setupTouchControls() {
    snakeGame.canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        snakeGame.touchStartX = touch.clientX;
        snakeGame.touchStartY = touch.clientY;
    });

    snakeGame.canvas.addEventListener('touchend', (e) => {
        e.preventDefault();
        if (!snakeGame.gameRunning) return;

        const touch = e.changedTouches[0];
        const deltaX = touch.clientX - snakeGame.touchStartX;
        const deltaY = touch.clientY - snakeGame.touchStartY;

        const minSwipeDistance = 50;

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // Horizontal swipe
            if (deltaX > minSwipeDistance && snakeGame.direction !== 'left') {
                snakeGame.nextDirection = 'right';
            } else if (deltaX < -minSwipeDistance && snakeGame.direction !== 'right') {
                snakeGame.nextDirection = 'left';
            }
        } else {
            // Vertical swipe
            if (deltaY > minSwipeDistance && snakeGame.direction !== 'up') {
                snakeGame.nextDirection = 'down';
            } else if (deltaY < -minSwipeDistance && snakeGame.direction !== 'down') {
                snakeGame.nextDirection = 'up';
            }
        }
    });
}


// Start Snake game
function startSnakeGame() {
    // Reset game variables
    snakeGame.snake = [
        {x: 10, y: 10},
        {x: 9, y: 10},
        {x: 8, y: 10}
    ];
    snakeGame.direction = 'right';
    snakeGame.nextDirection = 'right';
    snakeGame.score = 0;
    snakeGame.gameRunning = true;

    // Generate initial food
    generateFood();

    // Update score
    updateScore();

    // Hide game over screen
    document.getElementById('gameOver').style.display = 'none';

    // Setup restart button
    document.getElementById('restartBtn').addEventListener('click', startSnakeGame);

    // Start game loop
    snakeGame.gameLoop = setInterval(gameTick, 150);
}

// Seleccionar tipo de comida basado en probabilidades
function selectFoodType() {
    // Calcular peso total
    const totalWeight = snakeGame.foodTypes.reduce((sum, type) => sum + type.weight, 0);

    // Generar número aleatorio
    let random = Math.random() * totalWeight;

    // Seleccionar tipo basado en peso
    for (let type of snakeGame.foodTypes) {
        random -= type.weight;
        if (random <= 0) {
            return type;
        }
    }

    // Fallback al primer tipo
    return snakeGame.foodTypes[0];
}

// Generate random food
function generateFood() {
    const gridSize = snakeGame.canvasSize / snakeGame.cellSize;
    snakeGame.food = {
        x: Math.floor(Math.random() * gridSize),
        y: Math.floor(Math.random() * gridSize)
    };

    // Seleccionar tipo de comida con probabilidad
    snakeGame.currentFood = selectFoodType();

    // Ensure food doesn't appear on snake
    for (let segment of snakeGame.snake) {
        if (segment.x === snakeGame.food.x && segment.y === snakeGame.food.y) {
            generateFood();
            return;
        }
    }
}

// Update score
function updateScore() {
    const scoreElement = document.getElementById('score');
    if (scoreElement) {
        scoreElement.textContent = snakeGame.score;
    }

    // Actualizar score en GameContainer si está disponible
    if (snakeGame.gameContainer) {
        snakeGame.gameContainer.updateScore(snakeGame.score);
    }
}

// Main game loop
function gameTick() {
    if (!snakeGame.gameRunning) return;

    // Update direction
    snakeGame.direction = snakeGame.nextDirection;

    // Move snake
    const head = {x: snakeGame.snake[0].x, y: snakeGame.snake[0].y};

    switch(snakeGame.direction) {
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
        case 'left':
            head.x--;
            break;
        case 'right':
            head.x++;
            break;
    }

    // Check collision with edges
    const gridSize = snakeGame.canvasSize / snakeGame.cellSize;
    if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
        snakeGameOver();
        return;
    }

    // Check collision with itself
    for (let i = 0; i < snakeGame.snake.length; i++) {
        if (head.x === snakeGame.snake[i].x && head.y === snakeGame.snake[i].y) {
            snakeGameOver();
            return;
        }
    }

    snakeGame.snake.unshift(head);

    // Check if eating food
    if (head.x === snakeGame.food.x && head.y === snakeGame.food.y) {
        // Sumar puntos según el tipo de comida
        snakeGame.score += snakeGame.currentFood.points;
        updateScore();

        // Crear efecto de partículas cuando come
        createEatEffect(snakeGame.food.x, snakeGame.food.y);

        generateFood();
    } else {
        snakeGame.snake.pop();
    }

    // Draw the game
    drawGame();
}

// Draw the game
function drawGame() {
    // Clear canvas
    snakeGame.ctx.fillStyle = '#000';
    snakeGame.ctx.fillRect(0, 0, snakeGame.canvasSize, snakeGame.canvasSize);

    // Draw snake (morada)
    snakeGame.ctx.fillStyle = '#9B59B6'; // Morado
    for (let i = 0; i < snakeGame.snake.length; i++) {
        const segment = snakeGame.snake[i];
        snakeGame.ctx.fillRect(
            segment.x * snakeGame.cellSize + 1,
            segment.y * snakeGame.cellSize + 1,
            snakeGame.cellSize - 2,
            snakeGame.cellSize - 2
        );
    }

    // Draw food con color según tipo y puntos
    snakeGame.ctx.fillStyle = snakeGame.currentFood.color;
    snakeGame.ctx.fillRect(
        snakeGame.food.x * snakeGame.cellSize + 2,
        snakeGame.food.y * snakeGame.cellSize + 2,
        snakeGame.cellSize - 4,
        snakeGame.cellSize - 4
    );

    // Draw particles effect
    drawEatEffect();
}

// Crear efecto de partículas cuando come
function createEatEffect(x, y) {
    const centerX = x * snakeGame.cellSize + snakeGame.cellSize / 2;
    const centerY = y * snakeGame.cellSize + snakeGame.cellSize / 2;

    // Crear 8 partículas
    for (let i = 0; i < 8; i++) {
        const angle = (Math.PI * 2 * i) / 8;
        snakeGame.eatEffectParticles.push({
            x: centerX,
            y: centerY,
            vx: Math.cos(angle) * 3,
            vy: Math.sin(angle) * 3,
            life: 15,
            color: snakeGame.currentFood.color
        });
    }
}

// Dibujar efecto de partículas
function drawEatEffect() {
    for (let i = snakeGame.eatEffectParticles.length - 1; i >= 0; i--) {
        const particle = snakeGame.eatEffectParticles[i];

        // Actualizar posición
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life--;

        // Dibujar partícula
        const alpha = particle.life / 15;
        snakeGame.ctx.fillStyle = particle.color;
        snakeGame.ctx.globalAlpha = alpha;
        snakeGame.ctx.fillRect(particle.x - 2, particle.y - 2, 4, 4);
        snakeGame.ctx.globalAlpha = 1;

        // Eliminar si murió
        if (particle.life <= 0) {
            snakeGame.eatEffectParticles.splice(i, 1);
        }
    }
}

// Game Over
function snakeGameOver() {
    snakeGame.gameRunning = false;
    clearInterval(snakeGame.gameLoop);

    const finalScoreElement = document.getElementById('finalScore');
    if (finalScoreElement) {
        finalScoreElement.textContent = snakeGame.score;
    }

    const gameOverElement = document.getElementById('gameOver');
    if (gameOverElement) {
        gameOverElement.style.display = 'block';
    }
}

// Cleanup function
function cleanupSnakeGame() {
    snakeGame.gameRunning = false;
    if (snakeGame.gameLoop) {
        clearInterval(snakeGame.gameLoop);
    }
    if (snakeGame.keyboardHandler) {
        document.removeEventListener('keydown', snakeGame.keyboardHandler);
    }
}