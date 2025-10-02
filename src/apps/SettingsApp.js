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
            <div style="
                display: flex;
                flex-direction: column;
                background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
                color: #fff;
                width: 550px;
                height: 100%;
                border-radius: 0;
                overflow: hidden;
            ">
                <!-- Header fijo -->
                <div style="
                    padding: 20px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    background: rgba(0, 0, 0, 0.5);
                    backdrop-filter: blur(10px);
                    flex-shrink: 0;
                ">
                    <h2 style="
                        margin: 0 0 5px 0;
                        font-size: 28px;
                        font-weight: 600;
                    ">⚙️ Settings</h2>
                    <p style="
                        margin: 0;
                        color: rgba(255, 255, 255, 0.6);
                        font-size: 14px;
                    ">Customize your experience</p>
                </div>

                <!-- Contenido con scroll -->
                <div id="settings-scroll" style="
                    flex: 1;
                    overflow-y: scroll;
                    overflow-x: hidden;
                    padding: 20px;
                    -webkit-overflow-scrolling: touch;
                    min-height: 0;
                ">
                    <div style="
                        background: rgba(255, 255, 255, 0.05);
                        border-radius: 15px;
                        padding: 20px;
                        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                        backdrop-filter: blur(10px);
                        border: 1px solid rgba(255, 255, 255, 0.1);
                    ">
                        <h3 style="margin: 0 0 15px 0; color: #fff; font-size: 18px; font-weight: 600;">Wallpaper</h3>
                        <div style="display: flex; flex-direction: column; gap: 10px;">
                            ${WALLPAPERS_CONFIG.map(wallpaper => `
                                <div style="
                                    display: flex;
                                    align-items: center;
                                    padding: 12px;
                                    background: rgba(255, 255, 255, 0.03);
                                    border: 2px solid ${currentWallpaper === wallpaper.id ? '#4CAF50' : 'rgba(255, 255, 255, 0.1)'};
                                    border-radius: 10px;
                                    cursor: pointer;
                                    transition: all 0.3s ease;
                                "
                                onclick="window.StateManager.selectWallpaper('${wallpaper.id}')"
                                onmouseover="this.style.background='rgba(255, 255, 255, 0.08)'; this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 15px rgba(0,0,0,0.3)'"
                                onmouseout="this.style.background='rgba(255, 255, 255, 0.03)'; this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                                    <div style="
                                        width: 40px;
                                        height: 30px;
                                        border-radius: 5px;
                                        margin-right: 15px;
                                        ${wallpaper.image ? `background-image: url('${wallpaper.image}'); background-size: cover; background-position: center;` : `background: ${wallpaper.gradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};`}
                                    "></div>
                                    <span style="font-weight: 500; color: #fff; flex: 1;">${wallpaper.name}</span>
                                    ${currentWallpaper === wallpaper.id ? '<span style="color: #4CAF50; font-size: 18px;">✓</span>' : ''}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>

            <style>
                /* Scrollbar para Chrome/Safari/Edge */
                #settings-scroll::-webkit-scrollbar {
                    width: 10px;
                }

                #settings-scroll::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 5px;
                }

                #settings-scroll::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 5px;
                }

                #settings-scroll::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.5);
                }

                /* Scrollbar para Firefox */
                #settings-scroll {
                    scrollbar-width: thin;
                    scrollbar-color: rgba(255, 255, 255, 0.3) rgba(255, 255, 255, 0.05);
                }
            </style>
        `;
    }
}

// Exportar para uso global
window.SettingsApp = SettingsApp;
