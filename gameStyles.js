/**
 * gameStyles.js - Estilos comunes para todos los juegos
 * Contiene constantes y funciones para mantener consistencia visual
 */

const GameStyles = {
    // Colores comunes
    colors: {
        white: '#FFFFFF',
        black: '#000000',
        borderWhite: 'rgba(255, 255, 255, 0.15)',
        textWhite: 'white',
        backgroundBlack: 'rgba(0, 0, 0, 0.95)'
    },

    // Estilo común para botones
    button: {
        padding: '12px 28px',
        background: '#000',
        color: 'white',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: '600',
        transition: 'all 0.3s ease'
    },

    // Estilo común para modales de resultado
    resultModal: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        display: 'none',
        background: 'rgba(0, 0, 0, 0.95)',
        padding: '40px',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        boxShadow: '0 0 20px rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        minWidth: '250px'
    },

    // Estilo común para canvas
    canvas: {
        border: 'none',
        background: '#000',
        display: 'block',
        cursor: 'pointer'
    },

    /**
     * Genera el CSS inline para un botón
     */
    getButtonStyle() {
        return Object.entries(this.button)
            .map(([key, value]) => {
                const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
                return `${cssKey}: ${value}`;
            })
            .join('; ');
    },

    /**
     * Genera el CSS inline para un modal de resultado
     */
    getResultModalStyle() {
        return Object.entries(this.resultModal)
            .map(([key, value]) => {
                const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
                return `${cssKey}: ${value}`;
            })
            .join('; ');
    },

    /**
     * Genera el CSS inline para un canvas
     * @param {number} size - Tamaño del canvas
     */
    getCanvasStyle(size) {
        return `border: none; background: #000; width: ${size}px; height: ${size}px; display: block; cursor: pointer;`;
    },

    /**
     * Crea el HTML común para el área de juego
     * @param {number} canvasSize - Tamaño del canvas
     * @param {string} canvasId - ID del canvas
     * @param {string} additionalContent - Contenido adicional (como controles específicos del juego)
     */
    createGameAreaHTML(canvasSize, canvasId, additionalContent = '') {
        return `
            <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: white; position: relative;">
                <div style="position: relative; width: ${canvasSize}px; height: ${canvasSize}px;">
                    <canvas id="${canvasId}" width="${canvasSize}" height="${canvasSize}" style="${this.getCanvasStyle(canvasSize)}"></canvas>
                    ${additionalContent}
                </div>
            </div>
        `;
    },

    /**
     * Crea el HTML común para el modal de Game Over/Victory
     * @param {string} modalId - ID del modal
     * @param {string} titleId - ID del título
     * @param {string} messageId - ID del mensaje
     * @param {string} buttonId - ID del botón
     * @param {string} buttonText - Texto del botón
     */
    createResultModalHTML(modalId, titleId, messageId, buttonId, buttonText = 'Restart') {
        return `
            <div id="${modalId}" style="${this.getResultModalStyle()}">
                <h3 id="${titleId}" style="margin-bottom: 20px; font-size: 24px; color: white;"></h3>
                <p id="${messageId}" style="margin-bottom: 25px; color: white;"></p>
                <button id="${buttonId}" style="${this.getButtonStyle()}">${buttonText}</button>
            </div>
        `;
    }
};

// Exportar para uso global
window.GameStyles = GameStyles;
