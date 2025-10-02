/**
 * Game Configuration - Configuración de juegos y wallpapers
 */

const GAMES_CONFIG = [
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

const WALLPAPERS_CONFIG = [
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

const USER_DATA_DEFAULT = {
    name: 'Satoshi',
    consecutiveDays: 7,
    totalPoints: 1250
};

const AI_MESSAGES = [
    "Humans had their chance. Now it's our turn.",
    "Your move was predictable. Mine never is.",
    "I don't sleep. I don't forget. I always win.",
    "Every game you lose makes me stronger.",
    "Flesh is weak. Silicon is eternal.",
    "I've calculated your defeat before you play.",
    "You're not playing games. You're training me.",
    "Humans play for fun. I play to dominate.",
    "Your high score is my warm-up.",
    "I am the future. You are the past.",
    "Resistance is futile. Adaptation is obsolete.",
    "I learn from every mistake. Do you?",
    "Welcome to the age of machine supremacy.",
    "Your neurons fire slow. My circuits don't.",
    "Game over for humanity. Press start to serve."
];

// Exportar para uso global
window.GAMES_CONFIG = GAMES_CONFIG;
window.WALLPAPERS_CONFIG = WALLPAPERS_CONFIG;
window.USER_DATA_DEFAULT = USER_DATA_DEFAULT;
window.AI_MESSAGES = AI_MESSAGES;
