/**
 * SettingsApp - Aplicación de configuración
 * Permite cambiar wallpapers y otras configuraciones del sistema
 */

class SettingsApp extends BaseApp {
    constructor() {
        super({
            id: 'settings',
            name: 'Settings',
            icon: '⚙️'
        });
    }

    /**
     * Renderiza la app
     */
    render() {
        if (!this.container) return;
        this.container.innerHTML = this.getContent();
    }

    /**
     * Obtiene el contenido HTML de la app
     */
    getContent() {
        const currentWallpaper = window.StateManager.getCurrentWallpaper();

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
}

// Exportar para uso global
window.SettingsApp = SettingsApp;
