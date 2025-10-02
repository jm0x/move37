/**
 * GameUI - Funciones comunes de presentación y UI para juegos
 * Reutilizables por todos los juegos
 */

const GameUI = {
    /**
     * Crea el HTML del canvas con modal de game over
     */
    createGameCanvas(canvasSize, canvasId, modalConfig) {
        const {
            modalId = 'gameOver',
            titleId = 'gameOverTitle',
            messageId = 'gameOverMessage',
            buttonId = 'restartBtn',
            buttonText = 'Restart'
        } = modalConfig || {};

        return `
            <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: white; position: relative;">
                <div style="position: relative; width: ${canvasSize}px; height: ${canvasSize}px;">
                    <canvas id="${canvasId}" width="${canvasSize}" height="${canvasSize}"
                        style="${GameStyles.getCanvasStyle(canvasSize)}"></canvas>

                    <div id="${modalId}" style="${GameStyles.getResultModalStyle()}">
                        <h3 id="${titleId}" style="margin-bottom: 20px; font-size: 24px; color: white;"></h3>
                        <p id="${messageId}" style="margin-bottom: 25px; color: white;"></p>
                        <button id="${buttonId}" style="${GameStyles.getButtonStyle()}">${buttonText}</button>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Configura el modal de game over
     */
    setupGameOverModal(config) {
        const { titleId, titleText, messageId, messageText } = config;

        setTimeout(() => {
            const title = document.getElementById(titleId);
            const message = document.getElementById(messageId);

            if (title) title.innerHTML = titleText;
            if (message) message.innerHTML = messageText;
        }, 0);
    },

    /**
     * Muestra el modal de game over con título y mensaje
     */
    showGameOver(modalId, titleId, messageId, titleText, messageText) {
        const modal = document.getElementById(modalId);
        const title = document.getElementById(titleId);
        const message = document.getElementById(messageId);

        if (modal && title && message) {
            title.innerHTML = titleText;
            message.innerHTML = messageText;
            modal.style.display = 'block';
        }
    },

    /**
     * Oculta el modal de game over
     */
    hideGameOver(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
        }
    },

    /**
     * Calcula el tamaño óptimo del canvas según el dispositivo
     */
    calculateOptimalCanvasSize(desiredCellSize, gridCells) {
        const isMobile = Helpers.isMobile();

        if (isMobile) {
            const screenWidth = window.innerWidth;
            return Math.floor(screenWidth / gridCells) * gridCells;
        }

        return desiredCellSize * gridCells;
    },

    /**
     * Dibuja una grilla en el canvas (efecto retro)
     */
    drawGrid(ctx, canvasSize, gridSize, color = 'rgba(255, 255, 255, 0.05)') {
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;

        for (let i = 0; i < canvasSize; i += gridSize) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, canvasSize);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(canvasSize, i);
            ctx.stroke();
        }
    },

    /**
     * Dibuja texto centrado en el canvas
     */
    drawCenteredText(ctx, text, y, fontSize = 24, color = 'white', font = 'Arial') {
        ctx.fillStyle = color;
        ctx.font = `${fontSize}px ${font}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, ctx.canvas.width / 2, y);
    },

    /**
     * Dibuja un rectángulo con borde redondeado
     */
    drawRoundRect(ctx, x, y, width, height, radius, fillColor, strokeColor) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();

        if (fillColor) {
            ctx.fillStyle = fillColor;
            ctx.fill();
        }

        if (strokeColor) {
            ctx.strokeStyle = strokeColor;
            ctx.stroke();
        }
    },

    /**
     * Sistema de partículas genérico
     */
    createParticleSystem() {
        const particles = [];

        return {
            particles,

            /**
             * Crea partículas en una posición
             */
            emit(x, y, count, config = {}) {
                const {
                    speed = 3,
                    life = 15,
                    color = '#FFFFFF',
                    size = 4,
                    spread = Math.PI * 2
                } = config;

                for (let i = 0; i < count; i++) {
                    const angle = (spread * i) / count;
                    particles.push({
                        x,
                        y,
                        vx: Math.cos(angle) * speed,
                        vy: Math.sin(angle) * speed,
                        life,
                        maxLife: life,
                        color,
                        size
                    });
                }
            },

            /**
             * Actualiza todas las partículas
             */
            update() {
                for (let i = particles.length - 1; i >= 0; i--) {
                    const particle = particles[i];
                    particle.x += particle.vx;
                    particle.y += particle.vy;
                    particle.life--;

                    if (particle.life <= 0) {
                        particles.splice(i, 1);
                    }
                }
            },

            /**
             * Renderiza todas las partículas
             */
            render(ctx) {
                for (let particle of particles) {
                    const alpha = particle.life / particle.maxLife;
                    ctx.fillStyle = particle.color;
                    ctx.globalAlpha = alpha;
                    ctx.fillRect(
                        particle.x - particle.size / 2,
                        particle.y - particle.size / 2,
                        particle.size,
                        particle.size
                    );
                }
                ctx.globalAlpha = 1;
            },

            /**
             * Limpia todas las partículas
             */
            clear() {
                particles.length = 0;
            }
        };
    },

    /**
     * Efecto de shake para el canvas
     */
    createShakeEffect(element) {
        let shakeAmount = 0;
        let shakeInterval = null;

        return {
            /**
             * Inicia el efecto de shake
             */
            shake(intensity = 10, duration = 300) {
                shakeAmount = intensity;

                if (shakeInterval) clearInterval(shakeInterval);

                shakeInterval = setInterval(() => {
                    const x = (Math.random() - 0.5) * shakeAmount;
                    const y = (Math.random() - 0.5) * shakeAmount;
                    element.style.transform = `translate(${x}px, ${y}px)`;

                    shakeAmount *= 0.9;

                    if (shakeAmount < 0.5) {
                        clearInterval(shakeInterval);
                        element.style.transform = '';
                    }
                }, 16);

                setTimeout(() => {
                    if (shakeInterval) {
                        clearInterval(shakeInterval);
                        element.style.transform = '';
                    }
                }, duration);
            },

            /**
             * Detiene el shake
             */
            stop() {
                if (shakeInterval) {
                    clearInterval(shakeInterval);
                    element.style.transform = '';
                }
            }
        };
    },

    /**
     * Crea un efecto de fade in/out
     */
    fadeElement(element, fadeIn = true, duration = 300) {
        const start = fadeIn ? 0 : 1;
        const end = fadeIn ? 1 : 0;
        const startTime = performance.now();

        function animate(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            element.style.opacity = Helpers.lerp(start, end, progress);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        }

        requestAnimationFrame(animate);
    },

    /**
     * Calcula el tamaño de celda óptimo para móvil
     */
    calculateMobileCellSize(screenWidth, desiredCells) {
        return Math.floor(screenWidth / desiredCells);
    },

    /**
     * Convierte coordenadas de pantalla a coordenadas de grid
     */
    screenToGrid(screenX, screenY, cellSize, canvasBounds) {
        return {
            x: Math.floor((screenX - canvasBounds.left) / cellSize),
            y: Math.floor((screenY - canvasBounds.top) / cellSize)
        };
    },

    /**
     * Convierte coordenadas de grid a coordenadas de pantalla
     */
    gridToScreen(gridX, gridY, cellSize) {
        return {
            x: gridX * cellSize,
            y: gridY * cellSize
        };
    },

    /**
     * Dibuja un emoji en el canvas
     */
    drawEmoji(ctx, emoji, x, y, size = 20) {
        ctx.font = `${size}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(emoji, x, y);
    },

    /**
     * Crea un contador de FPS
     */
    createFPSCounter() {
        let lastTime = performance.now();
        let fps = 0;

        return {
            update() {
                const now = performance.now();
                const delta = now - lastTime;
                fps = Math.round(1000 / delta);
                lastTime = now;
                return fps;
            },

            render(ctx, x = 10, y = 20) {
                ctx.fillStyle = 'yellow';
                ctx.font = '14px monospace';
                ctx.textAlign = 'left';
                ctx.fillText(`FPS: ${fps}`, x, y);
            }
        };
    },

    /**
     * Pausa/reanuda el juego
     */
    createPauseOverlay(canvasSize) {
        return `
            <div id="pause-overlay" style="
                position: absolute;
                top: 0;
                left: 0;
                width: ${canvasSize}px;
                height: ${canvasSize}px;
                background: rgba(0, 0, 0, 0.8);
                display: none;
                align-items: center;
                justify-content: center;
                flex-direction: column;
                color: white;
                font-size: 32px;
                font-weight: bold;
                z-index: 10;
            ">
                <div>⏸️</div>
                <div style="font-size: 24px; margin-top: 20px;">PAUSED</div>
                <div style="font-size: 14px; margin-top: 10px; opacity: 0.7;">Press SPACE to continue</div>
            </div>
        `;
    }
};

// Exportar para uso global
window.GameUI = GameUI;
