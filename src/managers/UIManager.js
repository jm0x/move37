/**
 * UIManager - Maneja la interfaz de usuario
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
                // En móvil forzamos tamaño y no wrapping extremo
                if (Helpers.isMobile()) {
                    aiTextElement.style.fontSize = '11px';
                    aiTextElement.style.lineHeight = '1.25';
                    aiTextElement.style.whiteSpace = 'nowrap';
                    aiTextElement.style.textOverflow = 'ellipsis';
                    aiTextElement.style.overflow = 'hidden';
                }
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

    /**
     * Crea el contenido de la app de Settings
     */
    createSettingsContent(currentWallpaper, onWallpaperSelect) {
        return `
            <div style="padding: 20px; color: #fff; background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%); height: 100%;">
                <h2 style="text-align: center; margin-bottom: 30px; color: #fff;">⚙️ Settings</h2>

                <div style="background: rgba(255, 255, 255, 0.05); border-radius: 15px; padding: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.3); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.1);">
                    <h3 style="margin-bottom: 15px; color: #fff; font-size: 18px;">Wallpaper</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px;">
                        ${WALLPAPERS_CONFIG.map(wallpaper => `
                            <div style="display: flex; align-items: center; padding: 12px; background: rgba(255, 255, 255, 0.03); border: 2px solid ${currentWallpaper === wallpaper.id ? '#4CAF50' : 'rgba(255, 255, 255, 0.1)'}; border-radius: 10px; cursor: pointer; transition: all 0.3s ease;"
                                 onclick="window.StateManager.selectWallpaper('${wallpaper.id}')"
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

    /**
     * Crea el contenido de la app de Messages
     */
    createMessagesContent() {
        return `
            <div style="padding: 20px; color: #fff; background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%); height: 100%; display: flex; align-items: center; justify-content: center;">
                <div style="text-align: center;">
                    <div style="font-size: 60px; margin-bottom: 20px;">✉️</div>
                    <h2 style="margin-bottom: 10px;">Messages</h2>
                    <p style="color: rgba(255, 255, 255, 0.6);">Coming soon!</p>
                </div>
            </div>
        `;
    }

    /**
     * Crea el contenido de la app de Browser
     */
    createBrowserContent() {
        return `
            <div style="padding: 20px; color: #fff; background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%); height: 100%; display: flex; align-items: center; justify-content: center;">
                <div style="text-align: center;">
                    <div style="font-size: 60px; margin-bottom: 20px;">🦊</div>
                    <h2 style="margin-bottom: 10px;">Browser</h2>
                    <p style="color: rgba(255, 255, 255, 0.6);">Coming soon!</p>
                </div>
            </div>
        `;
    }

    /**
     * Crea el contenido de la app de Wallet
     */
    createWalletContent() {
        return `
            <div style="padding: 20px; color: #fff; background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%); height: 100%; display: flex; align-items: center; justify-content: center;">
                <div style="text-align: center;">
                    <div style="font-size: 60px; margin-bottom: 20px;">💰</div>
                    <h2 style="margin-bottom: 10px;">Wallet</h2>
                    <p style="color: rgba(255, 255, 255, 0.6);">Coming soon!</p>
                </div>
            </div>
        `;
    }
}

// Exportar instancia singleton
window.UIManager = new UIManager();
