/**
 * AppLoader - Sistema de carga dinámica de aplicaciones
 * Maneja la creación e inicialización de apps del sistema
 */

class AppLoader {
    constructor() {
        this.currentApp = null;
        this.appInstances = new Map();
    }

    /**
     * Carga una app según su ID
     */
    loadApp(appConfig, container) {
        // Limpiar app anterior si existe
        this.cleanup();

        // Obtener o crear instancia de la app
        const app = this.getAppInstance(appConfig.id);

        if (app) {
            this.currentApp = app;
            app.initialize(container);
        } else {
            console.error(`App '${appConfig.id}' no encontrada`);
        }

        return app;
    }

    /**
     * Obtiene o crea una instancia de la app
     */
    getAppInstance(appId) {
        // Si ya existe una instancia, reutilizarla
        if (this.appInstances.has(appId)) {
            return this.appInstances.get(appId);
        }

        // Crear nueva instancia según el ID
        let app = null;

        switch (appId) {
            case 'settings':
                app = new SettingsApp();
                break;
            case 'messages':
                app = new MessagesApp();
                break;
            case 'browser':
                app = new BrowserApp();
                break;
            case 'appstore':
            case 'wallet': // Mantener compatibilidad con el ID anterior
                app = new AppStoreApp();
                break;
            default:
                console.error(`App ID desconocido: ${appId}`);
                return null;
        }

        // Guardar instancia para reutilización
        if (app) {
            this.appInstances.set(appId, app);
        }

        return app;
    }

    /**
     * Limpia la app actual
     */
    cleanup() {
        if (this.currentApp) {
            this.currentApp.cleanup();
            this.currentApp = null;
        }
    }

    /**
     * Obtiene la app actual
     */
    getCurrentApp() {
        return this.currentApp;
    }

    /**
     * Limpia todas las instancias de apps
     */
    cleanupAll() {
        this.appInstances.forEach(app => app.cleanup());
        this.appInstances.clear();
        this.currentApp = null;
    }
}

// Exportar para uso global
window.AppLoader = AppLoader;
