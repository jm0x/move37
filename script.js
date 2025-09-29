// Configuración de juegos disponibles
const games = [
    {
        id: 'snake',
        name: 'Snake',
        icon: '🐍',
        color: '#4CAF50'
    },
    {
        id: 'settings',
        name: 'Ajustes',
        icon: '⚙️',
        color: '#607D8B'
    }
];

// Fondos de pantalla disponibles
const wallpapers = [
    {
        id: 'bliss',
        name: 'Bliss',
        image: 'assets/bliss.jpg'
    },
    {
        id: 'gradient-elegant',
        name: 'Elegante',
        image: null,
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
        id: 'gradient-sunset',
        name: 'Atardecer',
        image: null,
        gradient: 'linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%)'
    },
    {
        id: 'gradient-dark',
        name: 'Oscuro',
        image: null,
        gradient: 'linear-gradient(135deg, #2C3E50 0%, #34495E 100%)'
    }
];

// Variables globales
let currentGame = null;
let isDesktop = window.innerWidth >= 768;
let currentWallpaper = 'bliss'; // Fondo por defecto

// Elementos del DOM
const homeScreen = document.getElementById('home-screen');
const gameContainer = document.getElementById('game-container');
const gameContent = document.getElementById('game-content');
const closeGameBtn = document.getElementById('close-game');
const appsGrid = document.getElementById('apps-grid');

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Función principal de inicialización
function initializeApp() {
    createAppIcons();
    setupEventListeners();
    detectDeviceType();
    setWallpaper(currentWallpaper);
}

// Crear iconos de aplicaciones
function createAppIcons() {
    appsGrid.innerHTML = '';
    
    games.forEach((game, index) => {
        const appIcon = document.createElement('div');
        appIcon.className = 'app-icon';
        appIcon.style.animationDelay = `${index * 0.1}s`;
        
        appIcon.innerHTML = `
            <div class="icon">${game.icon}</div>
            <div class="name">${game.name}</div>
        `;
        
        // Agregar evento de clic
        appIcon.addEventListener('click', () => openGame(game));
        
        appsGrid.appendChild(appIcon);
    });
}

// Configurar event listeners
function setupEventListeners() {
    closeGameBtn.addEventListener('click', closeGame);
    
    // Detectar cambios de tamaño de ventana
    window.addEventListener('resize', () => {
        isDesktop = window.innerWidth >= 768;
        detectDeviceType();
    });
}

// Detectar tipo de dispositivo
function detectDeviceType() {
    const deviceContainer = document.querySelector('.device-container');
    
    if (isDesktop) {
        deviceContainer.style.maxWidth = '1200px';
        deviceContainer.style.height = '90vh';
        deviceContainer.style.margin = '5vh auto';
        deviceContainer.style.borderRadius = '20px';
        deviceContainer.style.border = '8px solid #1d1d1f';
    } else {
        deviceContainer.style.maxWidth = '414px';
        deviceContainer.style.height = '100vh';
        deviceContainer.style.margin = '0 auto';
        deviceContainer.style.borderRadius = '0';
        deviceContainer.style.border = 'none';
    }
}

// Abrir juego
function openGame(game) {
    if (game.id.startsWith('coming-soon')) {
        showComingSoonMessage();
        return;
    }
    
    currentGame = game;
    
    // Mostrar contenedor de juego
    gameContainer.classList.add('active');
    
    // Cargar contenido del juego
    loadGameContent(game);
    
    // En móvil, ocultar la pantalla principal
    if (!isDesktop) {
        homeScreen.style.display = 'none';
    }
}

// Cargar contenido del juego
function loadGameContent(game) {
    gameContent.innerHTML = '';
    
    switch (game.id) {
        case 'snake':
            loadSnakeGame();
            break;
        case 'settings':
            loadSettingsApp();
            break;
        default:
            loadPlaceholderGame(game);
    }
}

// Cerrar juego
function closeGame() {
    gameContainer.classList.remove('active');
    homeScreen.style.display = 'block';
    currentGame = null;
    
    // Limpiar contenido del juego
    setTimeout(() => {
        gameContent.innerHTML = '';
    }, 300);
}

// Mostrar mensaje de "próximamente"
function showComingSoonMessage() {
    const message = document.createElement('div');
    message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 20px 30px;
        border-radius: 15px;
        font-size: 18px;
        font-weight: 500;
        z-index: 1000;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
    `;
    message.textContent = '¡Próximamente disponible!';
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 2000);
}


// Función para establecer fondo de pantalla
function setWallpaper(wallpaperId) {
    const wallpaper = wallpapers.find(w => w.id === wallpaperId);
    if (!wallpaper) return;
    
    const wallpaperElement = document.querySelector('.wallpaper');
    
    if (wallpaper.image) {
        // Usar imagen
        wallpaperElement.style.backgroundImage = `url('${wallpaper.image}')`;
        wallpaperElement.style.backgroundSize = 'cover';
        wallpaperElement.style.backgroundPosition = 'center';
        wallpaperElement.style.backgroundRepeat = 'no-repeat';
    } else if (wallpaper.gradient) {
        // Usar gradiente personalizado
        wallpaperElement.style.backgroundImage = 'none';
        wallpaperElement.style.background = wallpaper.gradient;
    } else {
        // Usar degradado por defecto
        wallpaperElement.style.backgroundImage = 'none';
        wallpaperElement.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }
    
    currentWallpaper = wallpaperId;
}

// App de Ajustes
function loadSettingsApp() {
    gameContent.innerHTML = `
        <div style="padding: 20px; color: #333;">
            <h2 style="text-align: center; margin-bottom: 30px;">⚙️ Ajustes</h2>
            
            <div style="background: white; border-radius: 15px; padding: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <h3 style="margin-bottom: 15px;">Fondo de Pantalla</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px;">
                    ${wallpapers.map(wallpaper => `
                        <div style="display: flex; align-items: center; padding: 10px; border: 2px solid ${currentWallpaper === wallpaper.id ? '#4CAF50' : '#e0e0e0'}; border-radius: 10px; cursor: pointer; transition: all 0.3s ease;" 
                             onclick="selectWallpaper('${wallpaper.id}')">
                            <div style="width: 40px; height: 30px; border-radius: 5px; margin-right: 15px; ${wallpaper.image ? `background-image: url('${wallpaper.image}'); background-size: cover; background-position: center;` : `background: ${wallpaper.gradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};`}"></div>
                            <span style="font-weight: 500;">${wallpaper.name}</span>
                            ${currentWallpaper === wallpaper.id ? '<span style="margin-left: auto; color: #4CAF50;">✓</span>' : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

// Seleccionar fondo de pantalla
function selectWallpaper(wallpaperId) {
    setWallpaper(wallpaperId);
    // Recargar la app de ajustes para mostrar la selección actualizada
    loadSettingsApp();
}

// Juego Snake
function loadSnakeGame() {
    gameContent.innerHTML = `
        <div style="width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #1a1a1a; color: white;">
            <div style="text-align: center; margin-bottom: 20px;">
                <h2 style="margin: 0; color: #4CAF50;">🐍 Snake Game</h2>
                <p style="margin: 10px 0; color: #ccc;">Puntuación: <span id="score">0</span></p>
            </div>
            
            <div style="position: relative;">
                <canvas id="snakeCanvas" width="400" height="400" style="border: 2px solid #4CAF50; border-radius: 10px; background: #000;"></canvas>
                <div id="gameOver" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; display: none;">
                    <h3 style="color: #ff4444; margin-bottom: 20px;">Game Over!</h3>
                    <p style="margin-bottom: 20px;">Puntuación final: <span id="finalScore">0</span></p>
                    <button id="restartBtn" style="padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">Reiniciar</button>
                </div>
            </div>
            
            <div style="margin-top: 20px; text-align: center;">
                <p style="color: #ccc; margin-bottom: 10px;">Controles:</p>
                <p style="color: #999; font-size: 14px;">PC: Flechas del teclado</p>
                <p style="color: #999; font-size: 14px;">Móvil: Desliza en la dirección deseada</p>
            </div>
            
            <!-- Controles táctiles para móvil -->
            <div id="mobileControls" style="display: none; margin-top: 20px;">
                <div style="display: grid; grid-template-columns: repeat(3, 60px); gap: 10px; justify-content: center;">
                    <div></div>
                    <button class="control-btn" data-direction="up" style="width: 60px; height: 60px; background: #4CAF50; color: white; border: none; border-radius: 10px; font-size: 24px; cursor: pointer;">↑</button>
                    <div></div>
                    <button class="control-btn" data-direction="left" style="width: 60px; height: 60px; background: #4CAF50; color: white; border: none; border-radius: 10px; font-size: 24px; cursor: pointer;">←</button>
                    <div></div>
                    <button class="control-btn" data-direction="right" style="width: 60px; height: 60px; background: #4CAF50; color: white; border: none; border-radius: 10px; font-size: 24px; cursor: pointer;">→</button>
                    <div></div>
                    <button class="control-btn" data-direction="down" style="width: 60px; height: 60px; background: #4CAF50; color: white; border: none; border-radius: 10px; font-size: 24px; cursor: pointer;">↓</button>
                    <div></div>
                </div>
            </div>
        </div>
    `;
    
    // Inicializar el juego Snake
    initializeSnakeGame();
}

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
    touchStartY: 0
};

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


function loadPlaceholderGame(game) {
    gameContent.innerHTML = `
        <div style="text-align: center; color: #333;">
            <h2>${game.icon} ${game.name}</h2>
            <p>¡Próximamente con IA!</p>
            <div style="margin-top: 20px; padding: 20px; background: #e0e0e0; border-radius: 10px;">
                <p>Este juego estará disponible próximamente con inteligencia artificial.</p>
            </div>
        </div>
    `;
}

// Función para agregar nuevos juegos dinámicamente
function addNewGame(gameData) {
    games.push(gameData);
    createAppIcons();
}

// Función para actualizar un juego existente
function updateGame(gameId, newData) {
    const gameIndex = games.findIndex(game => game.id === gameId);
    if (gameIndex !== -1) {
        games[gameIndex] = { ...games[gameIndex], ...newData };
        createAppIcons();
    }
}

// Exportar funciones para uso futuro
window.GameHub = {
    addNewGame,
    updateGame,
    openGame,
    closeGame
};