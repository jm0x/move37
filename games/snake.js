// Variables del juego Snake
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
    lastAccelerometerTime: 0
};

// Cargar interfaz del juego Snake
function loadSnakeGame() {
    const gameContent = document.getElementById('game-content');
    gameContent.innerHTML = `
        <div style="width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%); color: white; position: relative; padding: 20px;">
            <div style="text-align: center; margin-bottom: 20px; width: 400px;">
                <h2 style="margin: 0; color: #4CAF50; font-size: 28px; font-weight: 600; letter-spacing: 2px;">🐍 SNAKE</h2>
                <p style="margin: 12px 0 0 0; color: #888; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Puntuación: <span id="score" style="color: #4CAF50; font-weight: 600;">0</span></p>
            </div>

            <div style="position: relative;">
                <canvas id="snakeCanvas" width="400" height="400" style="border: none; border-radius: 8px; background: #000; box-shadow: 0 0 0 1px rgba(76, 175, 80, 0.3), 0 8px 32px rgba(0, 0, 0, 0.6);"></canvas>
                <div id="gameOver" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; display: none; background: rgba(0, 0, 0, 0.95); padding: 40px; border-radius: 12px; box-shadow: 0 0 0 1px rgba(255, 68, 68, 0.3), 0 8px 32px rgba(0, 0, 0, 0.8); backdrop-filter: blur(10px);">
                    <h3 style="color: #ff4444; margin-bottom: 20px; font-size: 24px;">Game Over!</h3>
                    <p style="margin-bottom: 25px; color: #ccc;">Puntuación final: <span id="finalScore" style="color: #4CAF50; font-weight: 600;">0</span></p>
                    <button id="restartBtn" style="padding: 12px 28px; background: #4CAF50; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; font-weight: 600; transition: all 0.3s ease; box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);">Reiniciar</button>
                </div>
            </div>

            <!-- Controles táctiles para móvil -->
            <div id="mobileControls" style="display: none; position: fixed; bottom: 20px; right: 20px; z-index: 1000;">
                <div style="display: grid; grid-template-columns: repeat(3, 45px); gap: 6px; justify-content: center;">
                    <div></div>
                    <button class="control-btn" data-direction="up" style="width: 45px; height: 45px; background: rgba(76, 175, 80, 0.15); color: rgba(76, 175, 80, 0.8); border: 1px solid rgba(76, 175, 80, 0.25); border-radius: 8px; font-size: 20px; cursor: pointer; transition: all 0.2s ease; backdrop-filter: blur(8px);">↑</button>
                    <div></div>
                    <button class="control-btn" data-direction="left" style="width: 45px; height: 45px; background: rgba(76, 175, 80, 0.15); color: rgba(76, 175, 80, 0.8); border: 1px solid rgba(76, 175, 80, 0.25); border-radius: 8px; font-size: 20px; cursor: pointer; transition: all 0.2s ease; backdrop-filter: blur(8px);">←</button>
                    <div></div>
                    <button class="control-btn" data-direction="right" style="width: 45px; height: 45px; background: rgba(76, 175, 80, 0.15); color: rgba(76, 175, 80, 0.8); border: 1px solid rgba(76, 175, 80, 0.25); border-radius: 8px; font-size: 20px; cursor: pointer; transition: all 0.2s ease; backdrop-filter: blur(8px);">→</button>
                    <div></div>
                    <button class="control-btn" data-direction="down" style="width: 45px; height: 45px; background: rgba(76, 175, 80, 0.15); color: rgba(76, 175, 80, 0.8); border: 1px solid rgba(76, 175, 80, 0.25); border-radius: 8px; font-size: 20px; cursor: pointer; transition: all 0.2s ease; backdrop-filter: blur(8px);">↓</button>
                    <div></div>
                </div>
            </div>
        </div>
    `;

    // Inicializar el juego Snake
    initializeSnakeGame();
}

// Inicializar el juego Snake
function initializeSnakeGame() {
    snakeGame.canvas = document.getElementById('snakeCanvas');
    snakeGame.ctx = snakeGame.canvas.getContext('2d');

    // Detectar si es móvil
    const isMobile = window.innerWidth < 768;
    const mobileControls = document.getElementById('mobileControls');

    if (isMobile) {
        mobileControls.style.display = 'block';
        setupMobileControls();
        setupTouchControls();
    } else {
        mobileControls.style.display = 'none';
        setupKeyboardControls();
    }

    startSnakeGame();
}

// Configurar controles de teclado
function setupKeyboardControls() {
    document.addEventListener('keydown', (e) => {
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
    });
}

// Configurar controles táctiles móviles
function setupMobileControls() {
    const controlBtns = document.querySelectorAll('.control-btn');
    controlBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const direction = btn.getAttribute('data-direction');
            if (!snakeGame.gameRunning) return;

            switch(direction) {
                case 'up':
                    if (snakeGame.direction !== 'down') snakeGame.nextDirection = 'up';
                    break;
                case 'down':
                    if (snakeGame.direction !== 'up') snakeGame.nextDirection = 'down';
                    break;
                case 'left':
                    if (snakeGame.direction !== 'right') snakeGame.nextDirection = 'left';
                    break;
                case 'right':
                    if (snakeGame.direction !== 'left') snakeGame.nextDirection = 'right';
                    break;
            }
        });
    });
}

// Configurar controles de deslizamiento táctil
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
            // Deslizamiento horizontal
            if (deltaX > minSwipeDistance && snakeGame.direction !== 'left') {
                snakeGame.nextDirection = 'right';
            } else if (deltaX < -minSwipeDistance && snakeGame.direction !== 'right') {
                snakeGame.nextDirection = 'left';
            }
        } else {
            // Deslizamiento vertical
            if (deltaY > minSwipeDistance && snakeGame.direction !== 'up') {
                snakeGame.nextDirection = 'down';
            } else if (deltaY < -minSwipeDistance && snakeGame.direction !== 'down') {
                snakeGame.nextDirection = 'up';
            }
        }
    });
}


// Iniciar el juego Snake
function startSnakeGame() {
    // Reiniciar variables del juego
    snakeGame.snake = [
        {x: 10, y: 10},
        {x: 9, y: 10},
        {x: 8, y: 10}
    ];
    snakeGame.direction = 'right';
    snakeGame.nextDirection = 'right';
    snakeGame.score = 0;
    snakeGame.gameRunning = true;

    // Generar comida inicial
    generateFood();

    // Actualizar puntuación
    updateScore();

    // Ocultar pantalla de game over
    document.getElementById('gameOver').style.display = 'none';

    // Configurar botón de reinicio
    document.getElementById('restartBtn').addEventListener('click', startSnakeGame);

    // Iniciar bucle del juego
    snakeGame.gameLoop = setInterval(gameTick, 150);
}

// Generar comida aleatoria
function generateFood() {
    const gridSize = snakeGame.canvasSize / snakeGame.cellSize;
    snakeGame.food = {
        x: Math.floor(Math.random() * gridSize),
        y: Math.floor(Math.random() * gridSize)
    };

    // Asegurar que la comida no aparezca en la serpiente
    for (let segment of snakeGame.snake) {
        if (segment.x === snakeGame.food.x && segment.y === snakeGame.food.y) {
            generateFood();
            return;
        }
    }
}

// Actualizar puntuación
function updateScore() {
    document.getElementById('score').textContent = snakeGame.score;
}

// Ciclo principal del juego
function gameTick() {
    if (!snakeGame.gameRunning) return;

    // Actualizar dirección
    snakeGame.direction = snakeGame.nextDirection;

    // Mover serpiente
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

    // Verificar colisiones con bordes
    const gridSize = snakeGame.canvasSize / snakeGame.cellSize;
    if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
        gameOver();
        return;
    }

    // Verificar colisión consigo misma
    for (let segment of snakeGame.snake) {
        if (head.x === segment.x && head.y === segment.y) {
            gameOver();
            return;
        }
    }

    snakeGame.snake.unshift(head);

    // Verificar si come comida
    if (head.x === snakeGame.food.x && head.y === snakeGame.food.y) {
        snakeGame.score += 10;
        updateScore();
        generateFood();
    } else {
        snakeGame.snake.pop();
    }

    // Dibujar el juego
    drawGame();
}

// Dibujar el juego
function drawGame() {
    // Limpiar canvas
    snakeGame.ctx.fillStyle = '#000';
    snakeGame.ctx.fillRect(0, 0, snakeGame.canvasSize, snakeGame.canvasSize);

    // Dibujar serpiente
    snakeGame.ctx.fillStyle = '#4CAF50';
    for (let i = 0; i < snakeGame.snake.length; i++) {
        const segment = snakeGame.snake[i];
        snakeGame.ctx.fillRect(
            segment.x * snakeGame.cellSize + 1,
            segment.y * snakeGame.cellSize + 1,
            snakeGame.cellSize - 2,
            snakeGame.cellSize - 2
        );
    }

    // Dibujar comida
    snakeGame.ctx.fillStyle = '#ff4444';
    snakeGame.ctx.fillRect(
        snakeGame.food.x * snakeGame.cellSize + 2,
        snakeGame.food.y * snakeGame.cellSize + 2,
        snakeGame.cellSize - 4,
        snakeGame.cellSize - 4
    );
}

// Game Over
function gameOver() {
    snakeGame.gameRunning = false;
    clearInterval(snakeGame.gameLoop);

    document.getElementById('finalScore').textContent = snakeGame.score;
    document.getElementById('gameOver').style.display = 'block';
}