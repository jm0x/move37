/**
 * InputManager - Gestor centralizado de entrada (teclado, táctil, etc.)
 * Maneja todos los inputs del usuario de manera unificada
 */

class InputManager {
    constructor() {
        this.keys = {};
        this.touches = {};
        this.handlers = {
            keydown: [],
            keyup: [],
            touchstart: [],
            touchend: [],
            touchmove: [],
            touchcancel: []
        };
        this.isInitialized = false;
    }

    /**
     * Inicializa el gestor de inputs
     */
    initialize() {
        if (this.isInitialized) return;

        // Keyboard events
        this.keydownHandler = (e) => {
            this.keys[e.key] = true;
            this.handlers.keydown.forEach(handler => handler(e));
        };

        this.keyupHandler = (e) => {
            this.keys[e.key] = false;
            this.handlers.keyup.forEach(handler => handler(e));
        };

        document.addEventListener('keydown', this.keydownHandler);
        document.addEventListener('keyup', this.keyupHandler);

        this.isInitialized = true;
    }

    /**
     * Verifica si una tecla está presionada
     */
    isKeyPressed(key) {
        return !!this.keys[key];
    }

    /**
     * Verifica si alguna de las teclas está presionada
     */
    isAnyKeyPressed(...keys) {
        return keys.some(key => this.keys[key]);
    }

    /**
     * Registra un handler para un evento de teclado
     */
    onKeyDown(handler) {
        this.handlers.keydown.push(handler);
        return () => this.removeHandler('keydown', handler);
    }

    /**
     * Registra un handler para un evento de tecla liberada
     */
    onKeyUp(handler) {
        this.handlers.keyup.push(handler);
        return () => this.removeHandler('keyup', handler);
    }

    /**
     * Configura controles táctiles para un elemento
     */
    setupTouchControls(element, callbacks) {
        const { onTouchStart, onTouchMove, onTouchEnd, onTouchCancel } = callbacks;

        if (onTouchStart) {
            const handler = (e) => {
                e.preventDefault();
                const touch = e.touches[0];
                this.touches.startX = touch.clientX;
                this.touches.startY = touch.clientY;
                onTouchStart(touch, e);
            };
            element.addEventListener('touchstart', handler);
            this.handlers.touchstart.push({ element, handler });
        }

        if (onTouchMove) {
            const handler = (e) => {
                e.preventDefault();
                const touch = e.touches[0];
                onTouchMove(touch, e);
            };
            element.addEventListener('touchmove', handler);
            this.handlers.touchmove.push({ element, handler });
        }

        if (onTouchEnd) {
            const handler = (e) => {
                e.preventDefault();
                const touch = e.changedTouches[0];
                onTouchEnd(touch, e);
            };
            element.addEventListener('touchend', handler);
            this.handlers.touchend.push({ element, handler });
        }

        if (onTouchCancel) {
            const handler = (e) => {
                e.preventDefault();
                onTouchCancel(e);
            };
            element.addEventListener('touchcancel', handler);
            this.handlers.touchcancel.push({ element, handler });
        }
    }

    /**
     * Configura controles de swipe
     */
    setupSwipeControls(element, callbacks, options = {}) {
        const minSwipeDistance = options.minSwipeDistance || 50;
        let startX = 0;
        let startY = 0;

        this.setupTouchControls(element, {
            onTouchStart: (touch) => {
                startX = touch.clientX;
                startY = touch.clientY;
            },
            onTouchEnd: (touch) => {
                const deltaX = touch.clientX - startX;
                const deltaY = touch.clientY - startY;

                if (Math.abs(deltaX) > Math.abs(deltaY)) {
                    // Horizontal swipe
                    if (deltaX > minSwipeDistance && callbacks.onSwipeRight) {
                        callbacks.onSwipeRight(deltaX, deltaY);
                    } else if (deltaX < -minSwipeDistance && callbacks.onSwipeLeft) {
                        callbacks.onSwipeLeft(deltaX, deltaY);
                    }
                } else {
                    // Vertical swipe
                    if (deltaY > minSwipeDistance && callbacks.onSwipeDown) {
                        callbacks.onSwipeDown(deltaX, deltaY);
                    } else if (deltaY < -minSwipeDistance && callbacks.onSwipeUp) {
                        callbacks.onSwipeUp(deltaX, deltaY);
                    }
                }
            }
        });
    }

    /**
     * Configura botones táctiles
     */
    setupTouchButtons(buttons) {
        Object.entries(buttons).forEach(([id, callback]) => {
            const button = document.getElementById(id);
            if (!button) return;

            const pressHandler = (e) => {
                e.preventDefault();
                button.style.transform = 'scale(0.95)';
                callback(true);
            };

            const releaseHandler = (e) => {
                e.preventDefault();
                button.style.transform = 'scale(1)';
                callback(false);
            };

            // Touch events
            button.addEventListener('touchstart', pressHandler);
            button.addEventListener('touchend', releaseHandler);

            // Mouse events (for desktop testing)
            button.addEventListener('mousedown', pressHandler);
            button.addEventListener('mouseup', releaseHandler);
            button.addEventListener('mouseleave', releaseHandler);

            this.handlers.touchstart.push({ element: button, handler: pressHandler });
            this.handlers.touchend.push({ element: button, handler: releaseHandler });
        });
    }

    /**
     * Remueve un handler específico
     */
    removeHandler(type, handler) {
        const index = this.handlers[type].indexOf(handler);
        if (index > -1) {
            this.handlers[type].splice(index, 1);
        }
    }

    /**
     * Limpia todos los handlers de un elemento
     */
    cleanupElement(element) {
        Object.entries(this.handlers).forEach(([event, handlers]) => {
            handlers.forEach(({ element: el, handler }, index) => {
                if (el === element) {
                    el.removeEventListener(event, handler);
                    handlers.splice(index, 1);
                }
            });
        });
    }

    /**
     * Limpia todos los handlers y recursos
     */
    cleanup() {
        // Remover keyboard listeners
        if (this.keydownHandler) {
            document.removeEventListener('keydown', this.keydownHandler);
        }
        if (this.keyupHandler) {
            document.removeEventListener('keyup', this.keyupHandler);
        }

        // Remover touch listeners
        Object.entries(this.handlers).forEach(([event, handlers]) => {
            handlers.forEach(({ element, handler }) => {
                element.removeEventListener(event, handler);
            });
        });

        // Limpiar estado
        this.keys = {};
        this.touches = {};
        this.handlers = {
            keydown: [],
            keyup: [],
            touchstart: [],
            touchend: [],
            touchmove: [],
            touchcancel: []
        };
        this.isInitialized = false;
    }

    /**
     * Resetea el estado de las teclas
     */
    reset() {
        this.keys = {};
        this.touches = {};
    }
}

// Exportar instancia singleton
window.InputManager = new InputManager();
