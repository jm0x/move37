/**
 * Constants - Constantes globales de la aplicación
 */

const CONSTANTS = {
    // Feature Flags
    GAMES_ENABLED: false, // Set to true to enable games (after copyright verification)

    // Device
    MOBILE_BREAKPOINT: 768,

    // Game Settings
    DEFAULT_FPS: 60,
    SERPENT_FPS: 6.67, // ~150ms interval

    // Canvas Sizes
    CANVAS_SIZE: {
        MOBILE_MAX: 400,
        DESKTOP_DEFAULT: 450
    },

    // Cell Sizes
    CELL_SIZE: {
        SERPENT: 20,
        SERPENT_DESKTOP: 24,
        BOMB_HUNT: 35,
        COMBAT: 20
    },

    // Grid Sizes
    GRID_SIZE: {
        SERPENT_CELLS: 18,
        BOMB_HUNT: {
            rows: 10,
            cols: 10,
            mines: 15
        }
    },

    // Colors
    COLORS: {
        BLACK: '#000000',
        WHITE: '#FFFFFF',
        TRANSPARENT_WHITE: 'rgba(255, 255, 255, 0.15)',
        TRANSPARENT_BLACK: 'rgba(0, 0, 0, 0.95)',

        // Game specific
        SERPENT_BODY: '#9B59B6',
        SERPENT_BG: '#000',

        BOMB_HUNT_MINE: '#ff4444',
        BOMB_HUNT_SAFE: '#2a2a2a',
        BOMB_HUNT_HIDDEN: '#3a3a3a',
        BOMB_HUNT_FLAG: '#ff4444',

        PADDLE_PLAYER: '#4CAF50',
        PADDLE_AI: '#FF6B6B',
        PADDLE_BALL: '#FFFFFF',

        COMBAT_PLAYER1: '#4CAF50',
        COMBAT_PLAYER2: '#2196F3'
    },

    // Gradients
    GRADIENTS: {
        ELEGANT: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        SUNSET: 'linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%)',
        DARK: 'linear-gradient(135deg, #2C3E50 0%, #34495E 100%)',
        GAME_BG: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)'
    },

    // Animation
    ANIMATION: {
        TRANSITION_DURATION: 300,
        LOADING_INTERVAL: 200,
        PARTICLE_LIFE: 15
    },

    // Touch/Swipe
    TOUCH: {
        MIN_SWIPE_DISTANCE: 50,
        LONG_PRESS_DURATION: 500
    },

    // Game Specific
    PADDLE: {
        MAX_SCORE: 5,
        PADDLE_SPEED: 6,
        BALL_SPEED_X: 5,
        BALL_SPEED_Y: 5,
        AI_DIFFICULTY: 0.85,
        PADDLE_WIDTH: 10,
        PADDLE_HEIGHT: 80,
        BALL_RADIUS: 8
    },

    COMBAT: {
        TANK_SIZE: 15,
        TANK_SPEED: 2,
        BULLET_SPEED: 4,
        BULLET_COOLDOWN: 30,
        MAX_BULLETS: 1,
        OBSTACLE_SIZE: 40
    },

    // Storage Keys
    STORAGE_KEYS: {
        BEST_SCORE: 'bestScore_',
        WALLPAPER: 'currentWallpaper',
        USER_DATA: 'userData'
    }
};

// Serpent Food Types
const SERPENT_FOOD_TYPES = [
    { color: '#4ECDC4', points: 5, weight: 50 },    // Turquesa - común
    { color: '#45B7D1', points: 5, weight: 50 },    // Azul claro - común
    { color: '#FFA07A', points: 10, weight: 30 },   // Naranja - poco común
    { color: '#F7DC6F', points: 10, weight: 30 },   // Amarillo - poco común
    { color: '#98D8C8', points: 15, weight: 15 },   // Verde agua - raro
    { color: '#BB8FCE', points: 15, weight: 15 },   // Morado claro - raro
    { color: '#FF6B6B', points: 25, weight: 5 },    // Rojo - muy raro
    { color: '#FFD700', points: 50, weight: 2 }     // Dorado - épico
];

// Bomb Hunt Number Colors
const BOMB_HUNT_COLORS = [
    '',           // 0 - no color
    '#2196F3',    // 1 - azul
    '#4CAF50',    // 2 - verde
    '#ff4444',    // 3 - rojo
    '#9C27B0',    // 4 - morado
    '#FF9800',    // 5 - naranja
    '#00BCD4',    // 6 - cyan
    '#E91E63',    // 7 - rosa
    '#795548'     // 8 - marrón
];

// Exportar para uso global
window.CONSTANTS = CONSTANTS;
window.SERPENT_FOOD_TYPES = SERPENT_FOOD_TYPES;
window.BOMB_HUNT_COLORS = BOMB_HUNT_COLORS;
