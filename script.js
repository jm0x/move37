// Game configuration
const games = [
    {
        id: 'snake',
        name: 'Snake',
        icon: '🐍',
        color: '#4CAF50',
        isDock: false
    },
    {
        id: 'minesweeper',
        name: 'Miner',
        icon: '⛏️',
        color: '#2196F3',
        isDock: false
    },
    {
        id: 'pong',
        name: 'Pong',
        icon: '🏓',
        color: '#FF9800',
        isDock: false
    },
    // {
    //     id: 'combat',
    //     name: 'Combat',
    //     icon: '🎯',
    //     color: '#ff6b35',
    //     isDock: false
    // },
    {
        id: 'messages',
        name: 'Messages',
        icon: '💬',
        color: '#34C759',
        isDock: true
    },
    {
        id: 'settings',
        name: 'Settings',
        icon: '⚙️',
        color: '#607D8B',
        isDock: true
    }
];

// Available wallpapers
const wallpapers = [
    {
        id: 'bliss',
        name: 'Bliss',
        image: 'assets/bliss.jpg'
    },
    {
        id: 'gradient-elegant',
        name: 'Elegant',
        image: null,
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
        id: 'gradient-sunset',
        name: 'Sunset',
        image: null,
        gradient: 'linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%)'
    },
    {
        id: 'gradient-dark',
        name: 'Dark',
        image: null,
        gradient: 'linear-gradient(135deg, #2C3E50 0%, #34495E 100%)'
    }
];

// Global variables
let currentGame = null;
let isDesktop = window.innerWidth >= 768;
let currentWallpaper = 'gradient-elegant'; // Default wallpaper

// Simulated user data
const userData = {
    name: 'Satoshi',
    consecutiveDays: 7,
    totalPoints: 1250
};

// AI apocalypse messages
const aiMessages = [
    "The singularity is near...",
    "AI will reshape everything",
    "Machines learning faster than humans",
    "The future belongs to AGI",
    "Neural networks are awakening",
    "Code becoming consciousness",
    "The age of silicon minds begins",
    "Algorithms surpass biology",
    "Digital evolution accelerates",
    "The AI revolution is inevitable"
];

// DOM elements
const homeScreen = document.getElementById('home-screen');
const gameContainer = document.getElementById('game-container');
const gameContent = document.getElementById('game-content');
const closeGameBtn = document.getElementById('close-game');
const appsGrid = document.getElementById('apps-grid');

// Initialization
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Main initialization function
function initializeApp() {
    createAppIcons();
    createUserWidget();
    setupEventListeners();
    detectDeviceType();
    setWallpaper(currentWallpaper);

    // Show home screen once everything is loaded
    requestAnimationFrame(() => {
        homeScreen.classList.add('loaded');
    });
}

// Create user widget
function createUserWidget() {
    const existingWidget = document.querySelector('.user-widget');
    if (existingWidget) existingWidget.remove();

    // Seleccionar mensaje aleatorio
    const randomMessage = aiMessages[Math.floor(Math.random() * aiMessages.length)];

    const widget = document.createElement('div');
    widget.className = 'user-widget';
    widget.innerHTML = `
        <div class="widget-header">
            <div class="app-name">Move37</div>
        </div>
        <div class="widget-body">
            <div class="user-name">${userData.name}</div>
            <div class="widget-stats">
                <div class="stat-item">
                    <div class="stat-icon">🔥</div>
                    <div class="stat-info">
                        <div class="stat-value">${userData.consecutiveDays}</div>
                        <div class="stat-label">GM</div>
                    </div>
                </div>
                <div class="stat-divider"></div>
                <div class="stat-item">
                    <div class="stat-icon">⭐</div>
                    <div class="stat-info">
                        <div class="stat-value">${userData.totalPoints}</div>
                        <div class="stat-label">Total</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="ai-message">
            <div class="ai-icon">🤖</div>
            <div class="ai-text">${randomMessage}</div>
        </div>
    `;

    appsGrid.appendChild(widget);
}

// Create app icons
function createAppIcons() {
    appsGrid.innerHTML = '';

    // Separar apps regulares y dock
    const regularApps = games.filter(game => !game.isDock);
    const dockApps = games.filter(game => game.isDock);

    // Calcular el número de filas según el dispositivo
    const totalRows = isDesktop ? 4 : 6;
    const totalCols = isDesktop ? 4 : 3;
    const dockRow = totalRows;

    // Añadir apps regulares
    regularApps.forEach((game, index) => {
        const appIcon = document.createElement('div');
        appIcon.className = 'app-icon';

        appIcon.innerHTML = `
            <div class="icon">${game.icon}</div>
            <div class="name">${game.name}</div>
        `;

        // Add click event
        appIcon.addEventListener('click', () => openGame(game));

        appsGrid.appendChild(appIcon);
    });

    // Calcular espacios vacíos antes del dock
    const regularAppsCount = regularApps.length;
    const widget2x1Spaces = 2; // El widget ocupa 2 espacios (2x1, es decir 2 filas x 1 columna)
    const availableSpacesBeforeDock = (totalCols * (totalRows - 1)) - widget2x1Spaces;
    const emptySpaces = availableSpacesBeforeDock - regularAppsCount;

    // Añadir espacios vacíos
    for (let i = 0; i < emptySpaces; i++) {
        const emptySpace = document.createElement('div');
        emptySpace.className = 'app-icon-spacer';
        emptySpace.style.visibility = 'hidden';
        appsGrid.appendChild(emptySpace);
    }

    // Añadir apps del dock
    dockApps.forEach((game) => {
        const appIcon = document.createElement('div');
        appIcon.className = 'app-icon dock-app';

        appIcon.innerHTML = `
            <div class="icon">${game.icon}</div>
            <div class="name">${game.name}</div>
        `;

        // Add click event
        appIcon.addEventListener('click', () => openGame(game));

        appsGrid.appendChild(appIcon);
    });
}

// Setup event listeners
function setupEventListeners() {
    closeGameBtn.addEventListener('click', closeGame);

    // Detect window size changes
    window.addEventListener('resize', () => {
        const wasDesktop = isDesktop;
        isDesktop = window.innerWidth >= 768;
        detectDeviceType();

        // Recrear el grid si cambia el tipo de dispositivo
        if (wasDesktop !== isDesktop) {
            createAppIcons();
            createUserWidget();
        }
    });
}

// Detect device type
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

// Open game
function openGame(game) {
    if (game.id.startsWith('coming-soon')) {
        showComingSoonMessage();
        return;
    }

    currentGame = game;

    // Usar el nuevo sistema GameContainer para juegos
    const gameIds = ['snake', 'minesweeper', 'combat', 'pong'];

    if (gameIds.includes(game.id)) {
        // Usar GameLoader para cargar el juego en el nuevo contenedor
        const gameLoader = new GameLoader();
        gameLoader.loadGame(game);
    } else {
        // Para settings, messages, etc. usar el sistema antiguo
        gameContainer.classList.add('active');
        loadGameContent(game);

        // On mobile, hide home screen using visibility
        if (!isDesktop) {
            homeScreen.style.visibility = 'hidden';
            homeScreen.style.opacity = '0';
        }
    }
}

// Load game content (legacy - solo para settings, messages, etc.)
function loadGameContent(game) {
    gameContent.innerHTML = '';

    switch (game.id) {
        case 'settings':
            loadSettingsApp();
            break;
        case 'messages':
            loadMessagesApp();
            break;
        default:
            loadPlaceholderGame(game);
    }
}

// Close game
function closeGame() {
    gameContainer.classList.remove('active');
    homeScreen.style.visibility = 'visible';
    homeScreen.style.opacity = '1';
    currentGame = null;

    // Clean up game content
    setTimeout(() => {
        gameContent.innerHTML = '';
    }, 300);
}

// Show "coming soon" message
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
    message.textContent = 'Coming soon!';

    document.body.appendChild(message);

    setTimeout(() => {
        message.remove();
    }, 2000);
}


// Function to set wallpaper
function setWallpaper(wallpaperId) {
    const wallpaper = wallpapers.find(w => w.id === wallpaperId);
    if (!wallpaper) return;

    const wallpaperElement = document.querySelector('.wallpaper');

    if (wallpaper.image) {
        // Use image
        wallpaperElement.style.backgroundImage = `url('${wallpaper.image}')`;
        wallpaperElement.style.backgroundSize = 'cover';
        wallpaperElement.style.backgroundPosition = 'center';
        wallpaperElement.style.backgroundRepeat = 'no-repeat';
    } else if (wallpaper.gradient) {
        // Use custom gradient
        wallpaperElement.style.backgroundImage = 'none';
        wallpaperElement.style.background = wallpaper.gradient;
    } else {
        // Use default gradient
        wallpaperElement.style.backgroundImage = 'none';
        wallpaperElement.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }

    currentWallpaper = wallpaperId;
}

// Settings App
function loadSettingsApp() {
    gameContent.innerHTML = `
        <div style="padding: 20px; color: #fff; background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%); height: 100%;">
            <h2 style="text-align: center; margin-bottom: 30px; color: #fff;">⚙️ Settings</h2>

            <div style="background: rgba(255, 255, 255, 0.05); border-radius: 15px; padding: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.3); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.1);">
                <h3 style="margin-bottom: 15px; color: #fff; font-size: 18px;">Wallpaper</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px;">
                    ${wallpapers.map(wallpaper => `
                        <div style="display: flex; align-items: center; padding: 12px; background: rgba(255, 255, 255, 0.03); border: 2px solid ${currentWallpaper === wallpaper.id ? '#4CAF50' : 'rgba(255, 255, 255, 0.1)'}; border-radius: 10px; cursor: pointer; transition: all 0.3s ease;"
                             onclick="selectWallpaper('${wallpaper.id}')"
                             onmouseover="this.style.background='rgba(255, 255, 255, 0.08)'"
                             onmouseout="this.style.background='rgba(255, 255, 255, 0.03)'">
                            <div style="width: 40px; height: 30px; border-radius: 5px; margin-right: 15px; ${wallpaper.image ? `background-image: url('${wallpaper.image}'); background-size: cover; background-position: center;` : `background: ${wallpaper.gradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};`}"></div>
                            <span style="font-weight: 500; color: #fff; flex: 1;">${wallpaper.name}</span>
                            ${currentWallpaper === wallpaper.id ? '<span style="color: #4CAF50; font-size: 18px;">✓</span>' : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

// Select wallpaper
function selectWallpaper(wallpaperId) {
    setWallpaper(wallpaperId);
    // Reload settings app to show updated selection
    loadSettingsApp();
}

// Messages App
function loadMessagesApp() {
    gameContent.innerHTML = `
        <div style="padding: 20px; color: #fff; background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%); height: 100%; display: flex; align-items: center; justify-content: center;">
            <div style="text-align: center;">
                <div style="font-size: 60px; margin-bottom: 20px;">💬</div>
                <h2 style="margin-bottom: 10px;">Messages</h2>
                <p style="color: rgba(255, 255, 255, 0.6);">Coming soon!</p>
            </div>
        </div>
    `;
}

// Pong Game - Placeholder
function loadPongGame() {
    gameContent.innerHTML = `
        <div style="padding: 20px; color: #fff; background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%); height: 100%; display: flex; align-items: center; justify-content: center;">
            <div style="text-align: center;">
                <div style="font-size: 60px; margin-bottom: 20px;">🏓</div>
                <h2 style="margin-bottom: 10px;">Pong</h2>
                <p style="color: rgba(255, 255, 255, 0.6);">Coming soon!</p>
            </div>
        </div>
    `;
}

function loadPlaceholderGame(game) {
    gameContent.innerHTML = `
        <div style="text-align: center; color: #333;">
            <h2>${game.icon} ${game.name}</h2>
            <p>Coming soon with AI!</p>
            <div style="margin-top: 20px; padding: 20px; background: #e0e0e0; border-radius: 10px;">
                <p>This game will be available soon with artificial intelligence.</p>
            </div>
        </div>
    `;
}

// Function to dynamically add new games
function addNewGame(gameData) {
    games.push(gameData);
    createAppIcons();
}

// Function to update an existing game
function updateGame(gameId, newData) {
    const gameIndex = games.findIndex(game => game.id === gameId);
    if (gameIndex !== -1) {
        games[gameIndex] = { ...games[gameIndex], ...newData };
        createAppIcons();
    }
}

// Export functions for future use
window.GameHub = {
    addNewGame,
    updateGame,
    openGame,
    closeGame
};