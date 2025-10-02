/**
 * BaseApp - Clase base abstracta para todas las aplicaciones del sistema
 * Proporciona funcionalidad común y estructura para todas las apps
 */

class BaseApp {
    constructor(config) {
        this.config = config;
        this.container = null;
        this.isActive = false;
    }

    /**
     * Inicializa la app en el contenedor proporcionado
     */
    initialize(container) {
        this.container = container;
        this.isActive = true;
        this.render();
        this.setupEventListeners();
    }

    /**
     * Renderiza la app
     * @abstract - Debe ser implementado por las clases hijas
     */
    render() {
        throw new Error('render() debe ser implementado por la clase hija');
    }

    /**
     * Configura los event listeners
     * @abstract - Puede ser sobrescrito por las clases hijas si es necesario
     */
    setupEventListeners() {
        // Override si es necesario
    }

    /**
     * Limpia todos los recursos de la app
     */
    cleanup() {
        this.isActive = false;
        if (this.container) {
            this.container.innerHTML = '';
        }
        this.container = null;
    }

    /**
     * Actualiza el contenido de la app
     */
    update() {
        if (this.isActive) {
            this.render();
        }
    }

    /**
     * Obtiene el contenido HTML de la app
     * @abstract - Debe ser implementado por las clases hijas
     */
    getContent() {
        throw new Error('getContent() debe ser implementado por la clase hija');
    }
}

// Exportar para uso global
window.BaseApp = BaseApp;
