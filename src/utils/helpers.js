/**
 * Helpers - Funciones de utilidad compartidas
 */

const Helpers = {
    /**
     * Verifica si el dispositivo es móvil
     */
    isMobile() {
        return window.innerWidth < CONSTANTS.MOBILE_BREAKPOINT;
    },

    /**
     * Genera un número aleatorio entre min y max
     */
    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    /**
     * Genera un número aleatorio flotante entre min y max
     */
    randomFloat(min, max) {
        return Math.random() * (max - min) + min;
    },

    /**
     * Selecciona un elemento aleatorio de un array
     */
    randomElement(array) {
        return array[this.randomInt(0, array.length - 1)];
    },

    /**
     * Selecciona un elemento basado en pesos
     */
    weightedRandom(items) {
        const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
        let random = Math.random() * totalWeight;

        for (let item of items) {
            random -= item.weight;
            if (random <= 0) {
                return item;
            }
        }

        return items[0];
    },

    /**
     * Clamp - Limita un valor entre min y max
     */
    clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    },

    /**
     * Interpola linealmente entre dos valores
     */
    lerp(start, end, t) {
        return start + (end - start) * t;
    },

    /**
     * Calcula la distancia entre dos puntos
     */
    distance(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    },

    /**
     * Normaliza un ángulo entre -180 y 180
     */
    normalizeAngle(angle) {
        while (angle > 180) angle -= 360;
        while (angle < -180) angle += 360;
        return angle;
    },

    /**
     * Convierte grados a radianes
     */
    toRadians(degrees) {
        return degrees * Math.PI / 180;
    },

    /**
     * Convierte radianes a grados
     */
    toDegrees(radians) {
        return radians * 180 / Math.PI;
    },

    /**
     * Verifica colisión entre dos rectángulos
     */
    checkRectCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    },

    /**
     * Verifica colisión entre un punto y un rectángulo
     */
    checkPointInRect(point, rect) {
        return point.x >= rect.x &&
               point.x <= rect.x + rect.width &&
               point.y >= rect.y &&
               point.y <= rect.y + rect.height;
    },

    /**
     * Verifica colisión entre dos círculos
     */
    checkCircleCollision(circle1, circle2) {
        const dist = this.distance(circle1.x, circle1.y, circle2.x, circle2.y);
        return dist < circle1.radius + circle2.radius;
    },

    /**
     * Debounce - Retrasa la ejecución de una función
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Throttle - Limita la frecuencia de ejecución de una función
     */
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    /**
     * Formatea un número con separador de miles
     */
    formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },

    /**
     * Formatea tiempo en segundos a mm:ss
     */
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    },

    /**
     * Crea un delay asíncrono
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    /**
     * Aplica vibración si está disponible
     */
    vibrate(duration = 50) {
        if (navigator.vibrate) {
            navigator.vibrate(duration);
        }
    },

    /**
     * Copia un objeto profundamente
     */
    deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    },

    /**
     * Mezcla un array (Fisher-Yates shuffle)
     */
    shuffleArray(array) {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    },

    /**
     * Calcula el tamaño de canvas basado en el dispositivo
     */
    calculateCanvasSize(cellSize, gridCells) {
        if (this.isMobile()) {
            const screenWidth = window.innerWidth;
            const maxSize = CONSTANTS.CANVAS_SIZE.MOBILE_MAX;
            return Math.min(screenWidth, maxSize, Math.floor(screenWidth / cellSize) * cellSize);
        }
        return cellSize * gridCells;
    },

    /**
     * Crea un elemento HTML desde un string
     */
    createElementFromHTML(htmlString) {
        const div = document.createElement('div');
        div.innerHTML = htmlString.trim();
        return div.firstChild;
    },

    /**
     * Obtiene las coordenadas del canvas desde un evento
     */
    getCanvasCoordinates(event, canvas) {
        const rect = canvas.getBoundingClientRect();
        const touch = event.touches ? event.touches[0] : event;
        return {
            x: touch.clientX - rect.left,
            y: touch.clientY - rect.top
        };
    }
};

// Exportar para uso global
window.Helpers = Helpers;
