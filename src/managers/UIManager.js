/**
 * UIManager - Maneja la interfaz de usuario
 * Responsable de la gestión de iconos de apps, widgets y wallpapers
 */

class UIManager {
    constructor() {
        this.appsGrid = null;
        this.homeScreen = null;
        this.wallpaperElement = null;
    }

    /**
     * Inicializa el UIManager
     */
    initialize() {
        this.appsGrid = document.getElementById('apps-grid');
        this.homeScreen = document.getElementById('home-screen');
        this.wallpaperElement = document.querySelector('.wallpaper');
    }

    /**
     * Crea los iconos de las aplicaciones
     */
    createAppIcons(games, onAppClick) {
        if (!this.appsGrid) return;

        // Limpiar intervalo de AI widget si existe
        this.cleanupAIWidget();

        this.appsGrid.innerHTML = '';

        const isMobile = Helpers.isMobile();
        const regularApps = games.filter(game => !game.isDock);
        const dockApps = games.filter(game => game.isDock);

        const totalRows = isMobile ? 6 : 4;
        const totalCols = 4; // Siempre 4 columnas
        // En desktop: widget unificado (1 espacio)
        // En mobile: widget unificado (4 espacios - 1 fila completa)
        const widgetSpaces = isMobile ? 4 : 1;

        // Añadir apps regulares
        regularApps.forEach((game) => {
            const appIcon = this.createAppIcon(game, onAppClick);
            this.appsGrid.appendChild(appIcon);
        });

        // Calcular espacios vacíos
        const regularAppsCount = regularApps.length;
        const availableSpacesBeforeDock = (totalCols * (totalRows - 1)) - widgetSpaces;
        const emptySpaces = availableSpacesBeforeDock - regularAppsCount;

        // Añadir espacios vacíos
        for (let i = 0; i < emptySpaces; i++) {
            const emptySpace = document.createElement('div');
            emptySpace.className = 'app-icon-spacer';
            emptySpace.style.visibility = 'hidden';
            this.appsGrid.appendChild(emptySpace);
        }

        // Añadir apps del dock
        dockApps.forEach((game) => {
            const appIcon = this.createAppIcon(game, onAppClick);
            appIcon.classList.add('dock-app');
            this.appsGrid.appendChild(appIcon);
        });
    }

    /**
     * Crea un icono de aplicación
     */
    createAppIcon(game, onClick) {
        const appIcon = document.createElement('div');
        appIcon.className = 'app-icon';
        appIcon.innerHTML = `
            <div class="icon">${game.icon}</div>
            <div class="name">${game.name}</div>
        `;
        appIcon.addEventListener('click', () => onClick(game));
        return appIcon;
    }

    /**
     * Crea el widget de usuario con AI integrado
     */
    createUserWidget(userData) {
        if (!this.appsGrid) return;

        // Limpiar intervalo de AI widget si existe
        this.cleanupAIWidget();

        const existingWidget = document.querySelector('.user-widget');
        if (existingWidget) existingWidget.remove();

        const widget = document.createElement('div');
        widget.className = 'user-widget';
        widget.innerHTML = `
            <div class="widget-left">
                <div class="user-name">${userData.name}</div>
                <div class="widget-stats-vertical">
                    <div class="stat-row">
                        <span class="stat-icon">🔥</span>
                        <span class="stat-value">${userData.consecutiveDays}</span>
                        <span class="stat-label">GM</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-icon">⭐</span>
                        <span class="stat-value">${userData.totalPoints}</span>
                        <span class="stat-label">Total</span>
                    </div>
                </div>
            </div>
            <div class="widget-right">
                <div class="ai-message">
                    <div class="ai-icon">🤖</div>
                    <div class="ai-text" id="ai-message-text"></div>
                </div>
            </div>
        `;

        this.appsGrid.appendChild(widget);

        // Mostrar primer mensaje de AI
        this.updateAIMessage();

        // Rotar mensaje cada 30 segundos
        this.aiMessageInterval = setInterval(() => {
            this.updateAIMessage();
        }, 30000);
    }


    /**
     * Actualiza el mensaje del AI widget
     */
    updateAIMessage() {
        const aiTextElement = document.getElementById('ai-message-text');
        if (aiTextElement) {
            const useShort = Helpers.isMobile();
            const pool = useShort && typeof AI_MESSAGES_SHORT !== 'undefined' ? AI_MESSAGES_SHORT : AI_MESSAGES;
            const randomMessage = Helpers.randomElement(pool);

            // Fade out
            aiTextElement.style.opacity = '0';

            setTimeout(() => {
                aiTextElement.textContent = randomMessage;
                // Fade in
                aiTextElement.style.opacity = '1';
            }, 300);
        }
    }

    /**
     * Limpia el intervalo de mensajes AI
     */
    cleanupAIWidget() {
        if (this.aiMessageInterval) {
            clearInterval(this.aiMessageInterval);
            this.aiMessageInterval = null;
        }
    }

    /**
     * Establece el wallpaper
     */
    setWallpaper(wallpaperId) {
        const wallpaper = WALLPAPERS_CONFIG.find(w => w.id === wallpaperId);
        if (!wallpaper || !this.wallpaperElement) return;

        if (wallpaper.image) {
            this.wallpaperElement.style.backgroundImage = `url('${wallpaper.image}')`;
            this.wallpaperElement.style.backgroundSize = 'cover';
            this.wallpaperElement.style.backgroundPosition = 'center';
            this.wallpaperElement.style.backgroundRepeat = 'no-repeat';
        } else if (wallpaper.gradient) {
            this.wallpaperElement.style.backgroundImage = 'none';
            this.wallpaperElement.style.background = wallpaper.gradient;
        }
    }

    /**
     * Muestra la pantalla de inicio
     */
    showHomeScreen() {
        if (this.homeScreen) {
            this.homeScreen.style.visibility = 'visible';
            this.homeScreen.style.opacity = '1';
        }
    }

    /**
     * Oculta la pantalla de inicio
     */
    hideHomeScreen() {
        if (this.homeScreen && Helpers.isMobile()) {
            this.homeScreen.style.visibility = 'hidden';
            this.homeScreen.style.opacity = '0';
        }
    }

    /**
     * Muestra un mensaje temporal
     */
    showMessage(text, duration = 2000) {
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
        message.textContent = text;

        document.body.appendChild(message);

        setTimeout(() => {
            message.remove();
        }, duration);
    }

    /**
     * Actualiza el estilo del dispositivo
     */
    updateDeviceStyle() {
        const deviceContainer = document.querySelector('.device-container');
        if (!deviceContainer) return;

        const isMobile = Helpers.isMobile();

        if (isMobile) {
            deviceContainer.style.maxWidth = '414px';
            deviceContainer.style.height = '100vh';
            deviceContainer.style.margin = '0 auto';
            deviceContainer.style.borderRadius = '0';
            deviceContainer.style.border = 'none';
        } else {
            deviceContainer.style.maxWidth = '1200px';
            deviceContainer.style.height = '90vh';
            deviceContainer.style.margin = '5vh auto';
            deviceContainer.style.borderRadius = '20px';
            deviceContainer.style.border = '8px solid #1d1d1f';
        }
    }
}

// Exportar instancia singleton
window.UIManager = new UIManager();
