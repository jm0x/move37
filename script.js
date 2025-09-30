// Game configuration
const games = [
    {
        id: 'snake',
        name: 'Snake',
        icon: '🐍',
        color: '#4CAF50'
    },
    {
        id: 'minesweeper',
        name: 'Minesweeper',
        icon: '💣',
        color: '#2196F3'
    },
    {
        id: 'combat',
        name: 'Combat',
        icon: '🎯',
        color: '#ff6b35'
    },
    {
        id: 'settings',
        name: 'Settings',
        icon: '⚙️',
        color: '#607D8B'
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
    name: 'Player',
    consecutiveDays: 7,
    totalPoints: 1250
};

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
    createUserWidget();
    createAppIcons();
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

    const widget = document.createElement('div');
    widget.className = 'user-widget';
    widget.innerHTML = `
        <div class="widget-header">
            <span class="user-name">${userData.name}</span>
        </div>
        <div class="widget-stats">
            <div class="stat-item">
                <div class="stat-icon">🔥</div>
                <div class="stat-info">
                    <div class="stat-value">${userData.consecutiveDays}</div>
                    <div class="stat-label">days</div>
                </div>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
                <div class="stat-icon">⭐</div>
                <div class="stat-info">
                    <div class="stat-value">${userData.totalPoints}</div>
                    <div class="stat-label">points</div>
                </div>
            </div>
        </div>
    `;

    const wallpaper = document.querySelector('.wallpaper');
    wallpaper.insertBefore(widget, wallpaper.firstChild);
}

// Create app icons
function createAppIcons() {
    appsGrid.innerHTML = '';

    games.forEach((game, index) => {
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
}

// Setup event listeners
function setupEventListeners() {
    closeGameBtn.addEventListener('click', closeGame);

    // Detect window size changes
    window.addEventListener('resize', () => {
        isDesktop = window.innerWidth >= 768;
        detectDeviceType();
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

    // Show game container
    gameContainer.classList.add('active');

    // Load game content
    loadGameContent(game);

    // On mobile, hide home screen using visibility
    if (!isDesktop) {
        homeScreen.style.visibility = 'hidden';
        homeScreen.style.opacity = '0';
    }
}

// Load game content
function loadGameContent(game) {
    gameContent.innerHTML = '';

    switch (game.id) {
        case 'snake':
            loadSnakeGame();
            break;
        case 'minesweeper':
            loadMinesweeperGame();
            break;
        case 'combat':
            loadCombatGame();
            break;
        case 'settings':
            loadSettingsApp();
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