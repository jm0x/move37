/**
 * MinesweeperGame - Juego de buscaminas usando la nueva arquitectura
 * Extiende BaseGame para heredar funcionalidad común
 */

class MinesweeperGame extends BaseGame {
    constructor() {
        const config = {
            modalId: 'gameResult',
            titleId: 'resultTitle',
            messageId: 'resultMessage',
            restartBtnId: 'restartBtn'
        };

        super(config);

        // Estado del juego
        this.grid = [];
        this.rows = CONSTANTS.GRID_SIZE.MINESWEEPER.rows;
        this.cols = CONSTANTS.GRID_SIZE.MINESWEEPER.cols;
        this.mines = CONSTANTS.GRID_SIZE.MINESWEEPER.mines;
        this.cellSize = CONSTANTS.CELL_SIZE.MINESWEEPER;
        this.firstClick = true;
        this.flagsPlaced = 0;
        this.cellsRevealed = 0;
        this.startTime = null;
        this.timerInterval = null;
        this.longPressTimer = null;
        this.longPressTriggered = false;
    }

    /**
     * Crea el canvas del juego
     */
    createCanvas(gameArea) {
        const isMobile = Helpers.isMobile();
        const canvasSize = isMobile ? window.innerWidth : 450;

        // Ajustar cellSize para que quepa perfectamente
        this.cellSize = canvasSize / this.cols;

        gameArea.innerHTML = GameUI.createGameCanvas(canvasSize, 'minesweeperCanvas', {
            modalId: this.config.modalId,
            titleId: this.config.titleId,
            messageId: this.config.messageId,
            buttonId: this.config.restartBtnId,
            buttonText: 'New Game'
        });

        this.canvas = document.getElementById('minesweeperCanvas');
        this.ctx = this.canvas.getContext('2d');
    }

    /**
     * Configura los event listeners
     */
    setupEventListeners() {
        const isMobile = Helpers.isMobile();

        if (isMobile) {
            this.setupTouchControls();
        } else {
            this.setupDesktopControls();
        }

        // Botón restart
        const restartBtn = document.getElementById(this.config.restartBtnId);
        if (restartBtn) {
            restartBtn.addEventListener('click', () => this.reset());
        }

        // Limpiar al cerrar
        window.addEventListener('gameContainerClosing', () => {
            this.cleanup();
        }, { once: true });
    }

    /**
     * Configura controles de escritorio
     */
    setupDesktopControls() {
        // Click izquierdo - revelar celda
        const clickHandler = (e) => {
            if (!this.gameRunning) return;
            const coords = GameUI.screenToGrid(
                e.clientX,
                e.clientY,
                this.cellSize,
                this.canvas.getBoundingClientRect()
            );
            this.handleCellClick(coords.x, coords.y);
        };

        // Click derecho - bandera
        const contextHandler = (e) => {
            e.preventDefault();
            if (!this.gameRunning) return;
            const coords = GameUI.screenToGrid(
                e.clientX,
                e.clientY,
                this.cellSize,
                this.canvas.getBoundingClientRect()
            );
            this.toggleFlag(coords.x, coords.y);
        };

        this.registerEventHandler(this.canvas, 'click', clickHandler);
        this.registerEventHandler(this.canvas, 'contextmenu', contextHandler);
    }

    /**
     * Configura controles táctiles
     */
    setupTouchControls() {
        let touchStartTime = 0;
        let touchCoords = { x: 0, y: 0 };

        window.InputManager.setupTouchControls(this.canvas, {
            onTouchStart: (touch) => {
                if (!this.gameRunning) return;

                const coords = GameUI.screenToGrid(
                    touch.clientX,
                    touch.clientY,
                    this.cellSize,
                    this.canvas.getBoundingClientRect()
                );

                touchStartTime = Date.now();
                touchCoords = coords;
                this.longPressTriggered = false;

                // Long press para bandera
                this.longPressTimer = setTimeout(() => {
                    this.longPressTriggered = true;
                    this.toggleFlag(coords.x, coords.y);
                    Helpers.vibrate(50);
                }, CONSTANTS.TOUCH.LONG_PRESS_DURATION);
            },

            onTouchEnd: (touch) => {
                if (!this.gameRunning) return;

                clearTimeout(this.longPressTimer);

                // Si fue tap corto, revelar celda
                if (!this.longPressTriggered) {
                    const coords = GameUI.screenToGrid(
                        touch.clientX,
                        touch.clientY,
                        this.cellSize,
                        this.canvas.getBoundingClientRect()
                    );
                    this.handleCellClick(coords.x, coords.y);
                }
            },

            onTouchCancel: () => {
                clearTimeout(this.longPressTimer);
                this.longPressTriggered = false;
            }
        });
    }

    /**
     * Inicia el juego
     */
    start() {
        this.reset();
    }

    /**
     * Reinicia el juego
     */
    reset() {
        this.gameRunning = true;
        this.firstClick = true;
        this.flagsPlaced = 0;
        this.cellsRevealed = 0;
        this.startTime = null;

        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }

        this.createEmptyGrid();
        this.hideGameOver();
        this.render();
    }

    /**
     * Crea grid vacío
     */
    createEmptyGrid() {
        this.grid = [];
        for (let y = 0; y < this.rows; y++) {
            this.grid[y] = [];
            for (let x = 0; x < this.cols; x++) {
                this.grid[y][x] = {
                    isMine: false,
                    isRevealed: false,
                    isFlagged: false,
                    adjacentMines: 0
                };
            }
        }
    }

    /**
     * Coloca las minas (después del primer click)
     */
    placeMines(firstX, firstY) {
        let minesPlaced = 0;

        while (minesPlaced < this.mines) {
            const x = Helpers.randomInt(0, this.cols - 1);
            const y = Helpers.randomInt(0, this.rows - 1);

            const isFirstClick = (x === firstX && y === firstY);
            const isAdjacent = Math.abs(x - firstX) <= 1 && Math.abs(y - firstY) <= 1;

            if (!this.grid[y][x].isMine && !isFirstClick && !isAdjacent) {
                this.grid[y][x].isMine = true;
                minesPlaced++;
            }
        }

        this.calculateAdjacentMines();
    }

    /**
     * Calcula minas adyacentes
     */
    calculateAdjacentMines() {
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                if (!this.grid[y][x].isMine) {
                    let count = 0;
                    for (let dy = -1; dy <= 1; dy++) {
                        for (let dx = -1; dx <= 1; dx++) {
                            if (dx === 0 && dy === 0) continue;
                            const nx = x + dx;
                            const ny = y + dy;
                            if (nx >= 0 && nx < this.cols && ny >= 0 && ny < this.rows) {
                                if (this.grid[ny][nx].isMine) count++;
                            }
                        }
                    }
                    this.grid[y][x].adjacentMines = count;
                }
            }
        }
    }

    /**
     * Maneja click en celda
     */
    handleCellClick(x, y) {
        if (x < 0 || x >= this.cols || y < 0 || y >= this.rows) return;

        const cell = this.grid[y][x];
        if (cell.isFlagged || cell.isRevealed) return;

        // Primer click
        if (this.firstClick) {
            this.firstClick = false;
            this.placeMines(x, y);
            this.startTime = Date.now();
            this.startTimer();
        }

        this.revealCell(x, y);
        this.checkGameState();
    }

    /**
     * Revela una celda
     */
    revealCell(x, y) {
        if (x < 0 || x >= this.cols || y < 0 || y >= this.rows) return;

        const cell = this.grid[y][x];
        if (cell.isRevealed || cell.isFlagged) return;

        cell.isRevealed = true;
        this.cellsRevealed++;

        // Si es mina, game over
        if (cell.isMine) {
            this.endGame(false);
            return;
        }

        // Si no hay minas adyacentes, revelar vecinos
        if (cell.adjacentMines === 0) {
            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    if (dx === 0 && dy === 0) continue;
                    this.revealCell(x + dx, y + dy);
                }
            }
        }

        this.render();
    }

    /**
     * Alterna bandera
     */
    toggleFlag(x, y) {
        if (x < 0 || x >= this.cols || y < 0 || y >= this.rows) return;

        const cell = this.grid[y][x];
        if (cell.isRevealed) return;

        cell.isFlagged = !cell.isFlagged;
        this.flagsPlaced += cell.isFlagged ? 1 : -1;

        this.render();
        this.checkGameState();
    }

    /**
     * Verifica el estado del juego
     */
    checkGameState() {
        const totalCells = this.rows * this.cols;
        const safeCells = totalCells - this.mines;

        if (this.cellsRevealed === safeCells) {
            this.endGame(true);
        }
    }

    /**
     * Inicia el temporizador
     */
    startTimer() {
        this.timerInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            this.updateScore(elapsed);
        }, 1000);
    }

    /**
     * Termina el juego
     */
    endGame(won) {
        this.stopGameLoop();

        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }

        // Revelar todas las minas si perdió
        if (!won) {
            for (let y = 0; y < this.rows; y++) {
                for (let x = 0; x < this.cols; x++) {
                    if (this.grid[y][x].isMine) {
                        this.grid[y][x].isRevealed = true;
                    }
                }
            }
            this.render();
        }

        const time = Math.floor((Date.now() - this.startTime) / 1000);

        if (won) {
            GameUI.showGameOver(
                this.config.modalId,
                this.config.titleId,
                this.config.messageId,
                '<span style="color: #4CAF50;">🎉 Victory!</span>',
                `Completed in ${time} seconds!`
            );
        } else {
            GameUI.showGameOver(
                this.config.modalId,
                this.config.titleId,
                this.config.messageId,
                '<span style="color: #ff4444;">💥 Game Over</span>',
                'You hit a mine!'
            );
        }
    }

    /**
     * Actualiza el estado del juego (no usado en este juego)
     */
    update() {
        // Minesweeper no necesita update continuo
    }

    /**
     * Renderiza el juego
     */
    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                const cell = this.grid[y][x];
                const screenPos = GameUI.gridToScreen(x, y, this.cellSize);

                if (cell.isRevealed) {
                    if (cell.isMine) {
                        // Mina
                        this.ctx.fillStyle = CONSTANTS.COLORS.MINESWEEPER_MINE;
                        this.ctx.fillRect(screenPos.x, screenPos.y, this.cellSize, this.cellSize);
                        GameUI.drawEmoji(this.ctx, '💣', screenPos.x + this.cellSize / 2, screenPos.y + this.cellSize / 2);
                    } else {
                        // Celda segura
                        this.ctx.fillStyle = CONSTANTS.COLORS.MINESWEEPER_SAFE;
                        this.ctx.fillRect(screenPos.x, screenPos.y, this.cellSize, this.cellSize);

                        if (cell.adjacentMines > 0) {
                            this.ctx.fillStyle = MINESWEEPER_COLORS[cell.adjacentMines];
                            this.ctx.font = `bold ${Math.floor(this.cellSize * 0.5)}px Arial`;
                            this.ctx.textAlign = 'center';
                            this.ctx.textBaseline = 'middle';
                            this.ctx.fillText(
                                cell.adjacentMines,
                                screenPos.x + this.cellSize / 2,
                                screenPos.y + this.cellSize / 2
                            );
                        }
                    }
                } else {
                    // Celda oculta
                    this.ctx.fillStyle = CONSTANTS.COLORS.MINESWEEPER_HIDDEN;
                    this.ctx.fillRect(screenPos.x, screenPos.y, this.cellSize, this.cellSize);

                    if (cell.isFlagged) {
                        GameUI.drawEmoji(this.ctx, '🚩', screenPos.x + this.cellSize / 2, screenPos.y + this.cellSize / 2);
                    }
                }

                // Bordes
                this.ctx.strokeStyle = '#1a1a1a';
                this.ctx.lineWidth = 1;
                this.ctx.strokeRect(screenPos.x, screenPos.y, this.cellSize, this.cellSize);
            }
        }
    }

    /**
     * Limpieza
     */
    cleanup() {
        super.cleanup();
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        if (this.longPressTimer) {
            clearTimeout(this.longPressTimer);
        }
    }
}

// Función de inicialización para compatibilidad con GameLoader
function initializeMinesweeperInContainer(gameArea, gameContainer) {
    const game = new MinesweeperGame();
    game.initialize(gameArea, gameContainer);
}

// Exportar
window.MinesweeperGame = MinesweeperGame;
