// Variables del juego Buscaminas
let minesweeperGame = {
    canvas: null,
    ctx: null,
    grid: [],
    rows: 10,
    cols: 10,
    mines: 15,
    cellSize: 35,
    gameRunning: false,
    firstClick: true,
    flagsPlaced: 0,
    cellsRevealed: 0,
    startTime: null,
    timerInterval: null,
    touchStartTime: 0,
    touchTimer: null,
    longPressTriggered: false
};

// Cargar interfaz del juego Buscaminas
function loadMinesweeperGame() {
    const gameContent = document.getElementById('game-content');
    gameContent.innerHTML = `
        <div style="width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%); color: white; position: relative; padding: 20px;">
            <div style="text-align: center; margin-bottom: 20px; width: 100%; max-width: 400px;">
                <h2 style="margin: 0; color: #2196F3; font-size: 28px; font-weight: 600; letter-spacing: 2px;">💣 BUSCAMINAS</h2>
                <div style="display: flex; justify-content: space-between; margin: 12px 0 0 0; color: #888; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
                    <span>🚩 <span id="flags-count" style="color: #2196F3; font-weight: 600;">0</span>/<span id="total-mines">15</span></span>
                    <span>⏱️ <span id="timer" style="color: #2196F3; font-weight: 600;">0</span>s</span>
                </div>
            </div>

            <div style="position: relative;">
                <canvas id="minesweeperCanvas" width="350" height="350" style="border: none; border-radius: 8px; background: #1a1a1a; box-shadow: 0 0 0 1px rgba(33, 150, 243, 0.3), 0 8px 32px rgba(0, 0, 0, 0.6); cursor: pointer;"></canvas>
                <div id="gameResult" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; display: none; background: rgba(0, 0, 0, 0.95); padding: 40px; border-radius: 12px; box-shadow: 0 0 0 1px rgba(33, 150, 243, 0.3), 0 8px 32px rgba(0, 0, 0, 0.8); backdrop-filter: blur(10px); min-width: 250px;">
                    <h3 id="resultTitle" style="margin-bottom: 20px; font-size: 24px;"></h3>
                    <p id="resultMessage" style="margin-bottom: 25px; color: #ccc;"></p>
                    <button id="restartBtn" style="padding: 12px 28px; background: #2196F3; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; font-weight: 600; transition: all 0.3s ease; box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);">Nuevo Juego</button>
                </div>
            </div>

            <div style="margin-top: 20px; text-align: center; color: #666; font-size: 12px;">
                <p>Click izquierdo: Revelar | Click derecho: Bandera</p>
            </div>
        </div>
    `;

    // Inicializar el juego Buscaminas
    initializeMinesweeperGame();
}

// Inicializar el juego Buscaminas
function initializeMinesweeperGame() {
    minesweeperGame.canvas = document.getElementById('minesweeperCanvas');
    minesweeperGame.ctx = minesweeperGame.canvas.getContext('2d');

    // Actualizar contador de minas
    document.getElementById('total-mines').textContent = minesweeperGame.mines;

    // Configurar eventos
    setupMinesweeperControls();

    // Iniciar nuevo juego
    startMinesweeperGame();
}

// Configurar controles
function setupMinesweeperControls() {
    const canvas = minesweeperGame.canvas;

    // Click izquierdo - revelar celda (desktop)
    canvas.addEventListener('click', (e) => {
        if (!minesweeperGame.gameRunning) return;
        // Evitar que el click se dispare después de un long press en móvil
        if (minesweeperGame.longPressTriggered) {
            minesweeperGame.longPressTriggered = false;
            return;
        }
        const rect = canvas.getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left) / minesweeperGame.cellSize);
        const y = Math.floor((e.clientY - rect.top) / minesweeperGame.cellSize);
        handleCellClick(x, y);
    });

    // Click derecho - colocar/quitar bandera (desktop)
    canvas.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        if (!minesweeperGame.gameRunning) return;
        const rect = canvas.getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left) / minesweeperGame.cellSize);
        const y = Math.floor((e.clientY - rect.top) / minesweeperGame.cellSize);
        toggleFlag(x, y);
    });

    // Touch start - iniciar temporizador para long press (móvil)
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (!minesweeperGame.gameRunning) return;

        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        const x = Math.floor((touch.clientX - rect.left) / minesweeperGame.cellSize);
        const y = Math.floor((touch.clientY - rect.top) / minesweeperGame.cellSize);

        minesweeperGame.touchStartTime = Date.now();
        minesweeperGame.longPressTriggered = false;

        // Timer para long press (500ms)
        minesweeperGame.touchTimer = setTimeout(() => {
            minesweeperGame.longPressTriggered = true;
            toggleFlag(x, y);
            // Vibración táctil si está disponible
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
        }, 500);
    });

    // Touch end - ejecutar acción según duración (móvil)
    canvas.addEventListener('touchend', (e) => {
        e.preventDefault();
        if (!minesweeperGame.gameRunning) return;

        clearTimeout(minesweeperGame.touchTimer);

        // Si fue un tap corto, revelar celda
        if (!minesweeperGame.longPressTriggered) {
            const touch = e.changedTouches[0];
            const rect = canvas.getBoundingClientRect();
            const x = Math.floor((touch.clientX - rect.left) / minesweeperGame.cellSize);
            const y = Math.floor((touch.clientY - rect.top) / minesweeperGame.cellSize);
            handleCellClick(x, y);
        }
    });

    // Touch cancel - cancelar temporizador
    canvas.addEventListener('touchcancel', () => {
        clearTimeout(minesweeperGame.touchTimer);
        minesweeperGame.longPressTriggered = false;
    });

    // Botón de reinicio
    document.getElementById('restartBtn').addEventListener('click', startMinesweeperGame);
}

// Iniciar nuevo juego
function startMinesweeperGame() {
    // Reiniciar variables
    minesweeperGame.gameRunning = true;
    minesweeperGame.firstClick = true;
    minesweeperGame.flagsPlaced = 0;
    minesweeperGame.cellsRevealed = 0;
    minesweeperGame.startTime = null;

    // Detener temporizador anterior
    if (minesweeperGame.timerInterval) {
        clearInterval(minesweeperGame.timerInterval);
    }

    // Resetear timer
    document.getElementById('timer').textContent = '0';
    document.getElementById('flags-count').textContent = '0';

    // Crear grid vacío
    createEmptyGrid();

    // Ocultar resultado
    document.getElementById('gameResult').style.display = 'none';

    // Dibujar grid
    drawGrid();
}

// Crear grid vacío
function createEmptyGrid() {
    minesweeperGame.grid = [];
    for (let y = 0; y < minesweeperGame.rows; y++) {
        minesweeperGame.grid[y] = [];
        for (let x = 0; x < minesweeperGame.cols; x++) {
            minesweeperGame.grid[y][x] = {
                isMine: false,
                isRevealed: false,
                isFlagged: false,
                adjacentMines: 0
            };
        }
    }
}

// Colocar minas (después del primer click)
function placeMines(firstX, firstY) {
    let minesPlaced = 0;
    while (minesPlaced < minesweeperGame.mines) {
        const x = Math.floor(Math.random() * minesweeperGame.cols);
        const y = Math.floor(Math.random() * minesweeperGame.rows);

        // No colocar mina en la primera celda clickeada ni en celdas adyacentes
        const isFirstClick = (x === firstX && y === firstY);
        const isAdjacent = Math.abs(x - firstX) <= 1 && Math.abs(y - firstY) <= 1;

        if (!minesweeperGame.grid[y][x].isMine && !isFirstClick && !isAdjacent) {
            minesweeperGame.grid[y][x].isMine = true;
            minesPlaced++;
        }
    }

    // Calcular números adyacentes
    calculateAdjacentMines();
}

// Calcular minas adyacentes
function calculateAdjacentMines() {
    for (let y = 0; y < minesweeperGame.rows; y++) {
        for (let x = 0; x < minesweeperGame.cols; x++) {
            if (!minesweeperGame.grid[y][x].isMine) {
                let count = 0;
                for (let dy = -1; dy <= 1; dy++) {
                    for (let dx = -1; dx <= 1; dx++) {
                        if (dx === 0 && dy === 0) continue;
                        const nx = x + dx;
                        const ny = y + dy;
                        if (nx >= 0 && nx < minesweeperGame.cols && ny >= 0 && ny < minesweeperGame.rows) {
                            if (minesweeperGame.grid[ny][nx].isMine) count++;
                        }
                    }
                }
                minesweeperGame.grid[y][x].adjacentMines = count;
            }
        }
    }
}

// Manejar click en celda
function handleCellClick(x, y) {
    if (x < 0 || x >= minesweeperGame.cols || y < 0 || y >= minesweeperGame.rows) return;

    const cell = minesweeperGame.grid[y][x];

    // No revelar celdas con bandera
    if (cell.isFlagged) return;

    // Primer click - colocar minas y empezar timer
    if (minesweeperGame.firstClick) {
        minesweeperGame.firstClick = false;
        placeMines(x, y);
        minesweeperGame.startTime = Date.now();
        startTimer();
    }

    // Si ya está revelada, ignorar
    if (cell.isRevealed) return;

    // Revelar celda
    revealCell(x, y);

    // Verificar estado del juego
    checkGameState();
}

// Revelar celda
function revealCell(x, y) {
    if (x < 0 || x >= minesweeperGame.cols || y < 0 || y >= minesweeperGame.rows) return;

    const cell = minesweeperGame.grid[y][x];

    if (cell.isRevealed || cell.isFlagged) return;

    cell.isRevealed = true;
    minesweeperGame.cellsRevealed++;

    // Si es mina, game over
    if (cell.isMine) {
        gameOver(false);
        return;
    }

    // Si no tiene minas adyacentes, revelar celdas vecinas
    if (cell.adjacentMines === 0) {
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                if (dx === 0 && dy === 0) continue;
                revealCell(x + dx, y + dy);
            }
        }
    }

    drawGrid();
}

// Alternar bandera
function toggleFlag(x, y) {
    if (x < 0 || x >= minesweeperGame.cols || y < 0 || y >= minesweeperGame.rows) return;

    const cell = minesweeperGame.grid[y][x];

    if (cell.isRevealed) return;

    cell.isFlagged = !cell.isFlagged;
    minesweeperGame.flagsPlaced += cell.isFlagged ? 1 : -1;

    document.getElementById('flags-count').textContent = minesweeperGame.flagsPlaced;

    drawGrid();
    checkGameState();
}

// Verificar estado del juego
function checkGameState() {
    const totalCells = minesweeperGame.rows * minesweeperGame.cols;
    const safeCells = totalCells - minesweeperGame.mines;

    // Victoria: todas las celdas seguras reveladas
    if (minesweeperGame.cellsRevealed === safeCells) {
        gameOver(true);
    }
}

// Empezar temporizador
function startTimer() {
    minesweeperGame.timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - minesweeperGame.startTime) / 1000);
        document.getElementById('timer').textContent = elapsed;
    }, 1000);
}

// Game Over
function gameOver(won) {
    minesweeperGame.gameRunning = false;

    if (minesweeperGame.timerInterval) {
        clearInterval(minesweeperGame.timerInterval);
    }

    // Revelar todas las minas
    if (!won) {
        for (let y = 0; y < minesweeperGame.rows; y++) {
            for (let x = 0; x < minesweeperGame.cols; x++) {
                if (minesweeperGame.grid[y][x].isMine) {
                    minesweeperGame.grid[y][x].isRevealed = true;
                }
            }
        }
        drawGrid();
    }

    // Mostrar resultado
    const resultDiv = document.getElementById('gameResult');
    const resultTitle = document.getElementById('resultTitle');
    const resultMessage = document.getElementById('resultMessage');

    if (won) {
        const time = document.getElementById('timer').textContent;
        resultTitle.textContent = '🎉 ¡Victoria!';
        resultTitle.style.color = '#4CAF50';
        resultMessage.textContent = `¡Completado en ${time} segundos!`;
    } else {
        resultTitle.textContent = '💥 Game Over';
        resultTitle.style.color = '#ff4444';
        resultMessage.textContent = '¡Has pisado una mina!';
    }

    resultDiv.style.display = 'block';
}

// Dibujar grid
function drawGrid() {
    const ctx = minesweeperGame.ctx;
    const cellSize = minesweeperGame.cellSize;

    ctx.clearRect(0, 0, minesweeperGame.canvas.width, minesweeperGame.canvas.height);

    for (let y = 0; y < minesweeperGame.rows; y++) {
        for (let x = 0; x < minesweeperGame.cols; x++) {
            const cell = minesweeperGame.grid[y][x];
            const px = x * cellSize;
            const py = y * cellSize;

            if (cell.isRevealed) {
                // Celda revelada
                if (cell.isMine) {
                    // Mina
                    ctx.fillStyle = '#ff4444';
                    ctx.fillRect(px, py, cellSize, cellSize);
                    ctx.fillStyle = '#000';
                    ctx.font = '20px Arial';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText('💣', px + cellSize / 2, py + cellSize / 2);
                } else {
                    // Celda segura
                    ctx.fillStyle = '#2a2a2a';
                    ctx.fillRect(px, py, cellSize, cellSize);

                    if (cell.adjacentMines > 0) {
                        const colors = ['', '#2196F3', '#4CAF50', '#ff4444', '#9C27B0', '#FF9800', '#00BCD4', '#E91E63', '#795548'];
                        ctx.fillStyle = colors[cell.adjacentMines];
                        ctx.font = 'bold 18px Arial';
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillText(cell.adjacentMines, px + cellSize / 2, py + cellSize / 2);
                    }
                }
            } else {
                // Celda no revelada
                ctx.fillStyle = '#3a3a3a';
                ctx.fillRect(px, py, cellSize, cellSize);

                // Bandera
                if (cell.isFlagged) {
                    ctx.fillStyle = '#ff4444';
                    ctx.font = '20px Arial';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText('🚩', px + cellSize / 2, py + cellSize / 2);
                }
            }

            // Bordes
            ctx.strokeStyle = '#1a1a1a';
            ctx.lineWidth = 1;
            ctx.strokeRect(px, py, cellSize, cellSize);
        }
    }
}