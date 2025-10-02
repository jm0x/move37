/**
 * AppStoreApp - Aplicación de tienda de aplicaciones
 * Permite descargar/acceder a nuevas apps y juegos (antes Upgrade/Wallet)
 */

class AppStoreApp extends BaseApp {
    constructor() {
        super({
            id: 'appstore',
            name: 'App Store',
            icon: '🏪'
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
        return `
            <div style="padding: 20px; color: #fff; background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%); height: 100%; display: flex; align-items: center; justify-content: center;">
                <div style="text-align: center;">
                    <div style="font-size: 60px; margin-bottom: 20px;">🏪</div>
                    <h2 style="margin-bottom: 10px;">App Store</h2>
                    <p style="color: rgba(255, 255, 255, 0.6);">Discover new games and apps</p>
                    <p style="color: rgba(255, 255, 255, 0.4); margin-top: 10px; font-size: 14px;">Coming soon!</p>
                </div>
            </div>
        `;
    }
}

// Exportar para uso global
window.AppStoreApp = AppStoreApp;
