// Minesweeper game variables
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

// Load Minesweeper game interface
function loadMinesweeperGame() {
    const gameContent = document.getElementById('game-content');
    gameContent.innerHTML = `
        <div style="width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%); color: white; position: relative; padding: 20px;">
            <div style="text-align: center; margin-bottom: 20px; width: 100%; max-width: 400px;">
                <h2 style="margin: 0; color: #2196F3; font-size: 28px; font-weight: 600; letter-spacing: 2px;">💣 MINESWEEPER</h2>
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
                    <button id="restartBtn" style="padding: 12px 28px; background: #2196F3; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; font-weight: 600; transition: all 0.3s ease; box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);">New Game</button>
                </div>
            </div>

            <div style="margin-top: 20px; text-align: center; color: #666; font-size: 12px;">
                <p>Left click: Reveal | Right click / Long press: Flag</p>
            </div>
        </div>
    `;

    // Initialize Minesweeper game
    initializeMinesweeperGame();
}

// Initialize Minesweeper game
function initializeMinesweeperGame() {
    minesweeperGame.canvas = document.getElementById('minesweeperCanvas');
    minesweeperGame.ctx = minesweeperGame.canvas.getContext('2d');

    // Update mines counter
    document.getElementById('total-mines').textContent = minesweeperGame.mines;

    // Setup events
    setupMinesweeperControls();

    // Start new game
    startMinesweeperGame();
}

// Setup controls
function setupMinesweeperControls() {
    const canvas = minesweeperGame.canvas;

    // Left click - reveal cell (desktop)
    canvas.addEventListener('click', (e) => {
        if (!minesweeperGame.gameRunning) return;
        // Prevent click from firing after long press on mobile
        if (minesweeperGame.longPressTriggered) {
            minesweeperGame.longPressTriggered = false;
            return;
        }
        const rect = canvas.getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left) / minesweeperGame.cellSize);
        const y = Math.floor((e.clientY - rect.top) / minesweeperGame.cellSize);
        handleCellClick(x, y);
    });

    // Right click - place/remove flag (desktop)
    canvas.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        if (!minesweeperGame.gameRunning) return;
        const rect = canvas.getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left) / minesweeperGame.cellSize);
        const y = Math.floor((e.clientY - rect.top) / minesweeperGame.cellSize);
        toggleFlag(x, y);
    });

    // Touch start - start timer for long press (mobile)
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (!minesweeperGame.gameRunning) return;

        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        const x = Math.floor((touch.clientX - rect.left) / minesweeperGame.cellSize);
        const y = Math.floor((touch.clientY - rect.top) / minesweeperGame.cellSize);

        minesweeperGame.touchStartTime = Date.now();
        minesweeperGame.longPressTriggered = false;

        // Timer for long press (500ms)
        minesweeperGame.touchTimer = setTimeout(() => {
            minesweeperGame.longPressTriggered = true;
            toggleFlag(x, y);
            // Haptic feedback if available
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
        }, 500);
    });

    // Touch end - execute action based on duration (mobile)
    canvas.addEventListener('touchend', (e) => {
        e.preventDefault();
        if (!minesweeperGame.gameRunning) return;

        clearTimeout(minesweeperGame.touchTimer);

        // If it was a short tap, reveal cell
        if (!minesweeperGame.longPressTriggered) {
            const touch = e.changedTouches[0];
            const rect = canvas.getBoundingClientRect();
            const x = Math.floor((touch.clientX - rect.left) / minesweeperGame.cellSize);
            const y = Math.floor((touch.clientY - rect.top) / minesweeperGame.cellSize);
            handleCellClick(x, y);
        }
    });

    // Touch cancel - cancel timer
    canvas.addEventListener('touchcancel', () => {
        clearTimeout(minesweeperGame.touchTimer);
        minesweeperGame.longPressTriggered = false;
    });

    // Restart button
    document.getElementById('restartBtn').addEventListener('click', startMinesweeperGame);
}

// Start new game
function startMinesweeperGame() {
    // Reset variables
    minesweeperGame.gameRunning = true;
    minesweeperGame.firstClick = true;
    minesweeperGame.flagsPlaced = 0;
    minesweeperGame.cellsRevealed = 0;
    minesweeperGame.startTime = null;

    // Stop previous timer
    if (minesweeperGame.timerInterval) {
        clearInterval(minesweeperGame.timerInterval);
    }

    // Reset timer
    document.getElementById('timer').textContent = '0';
    document.getElementById('flags-count').textContent = '0';

    // Create empty grid
    createEmptyGrid();

    // Hide result
    document.getElementById('gameResult').style.display = 'none';

    // Draw grid
    drawGrid();
}

// Create empty grid
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

// Place mines (after first click)
function placeMines(firstX, firstY) {
    let minesPlaced = 0;
    while (minesPlaced < minesweeperGame.mines) {
        const x = Math.floor(Math.random() * minesweeperGame.cols);
        const y = Math.floor(Math.random() * minesweeperGame.rows);

        // Don't place mine on first clicked cell or adjacent cells
        const isFirstClick = (x === firstX && y === firstY);
        const isAdjacent = Math.abs(x - firstX) <= 1 && Math.abs(y - firstY) <= 1;

        if (!minesweeperGame.grid[y][x].isMine && !isFirstClick && !isAdjacent) {
            minesweeperGame.grid[y][x].isMine = true;
            minesPlaced++;
        }
    }

    // Calculate adjacent numbers
    calculateAdjacentMines();
}

// Calculate adjacent mines
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

// Handle cell click
function handleCellClick(x, y) {
    if (x < 0 || x >= minesweeperGame.cols || y < 0 || y >= minesweeperGame.rows) return;

    const cell = minesweeperGame.grid[y][x];

    // Don't reveal flagged cells
    if (cell.isFlagged) return;

    // First click - place mines and start timer
    if (minesweeperGame.firstClick) {
        minesweeperGame.firstClick = false;
        placeMines(x, y);
        minesweeperGame.startTime = Date.now();
        startTimer();
    }

    // If already revealed, ignore
    if (cell.isRevealed) return;

    // Reveal cell
    revealCell(x, y);

    // Check game state
    checkGameState();
}

// Reveal cell
function revealCell(x, y) {
    if (x < 0 || x >= minesweeperGame.cols || y < 0 || y >= minesweeperGame.rows) return;

    const cell = minesweeperGame.grid[y][x];

    if (cell.isRevealed || cell.isFlagged) return;

    cell.isRevealed = true;
    minesweeperGame.cellsRevealed++;

    // If it's a mine, game over
    if (cell.isMine) {
        gameOver(false);
        return;
    }

    // If no adjacent mines, reveal neighboring cells
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

// Toggle flag
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

// Check game state
function checkGameState() {
    const totalCells = minesweeperGame.rows * minesweeperGame.cols;
    const safeCells = totalCells - minesweeperGame.mines;

    // Victory: all safe cells revealed
    if (minesweeperGame.cellsRevealed === safeCells) {
        gameOver(true);
    }
}

// Start timer
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
        resultTitle.textContent = '🎉 Victory!';
        resultTitle.style.color = '#4CAF50';
        resultMessage.textContent = `Completed in ${time} seconds!`;
    } else {
        resultTitle.textContent = '💥 Game Over';
        resultTitle.style.color = '#ff4444';
        resultMessage.textContent = 'You hit a mine!';
    }

    resultDiv.style.display = 'block';
}

// Draw grid
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
                // Revealed cell
                if (cell.isMine) {
                    // Mine
                    ctx.fillStyle = '#ff4444';
                    ctx.fillRect(px, py, cellSize, cellSize);
                    ctx.fillStyle = '#000';
                    ctx.font = '20px Arial';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText('💣', px + cellSize / 2, py + cellSize / 2);
                } else {
                    // Safe cell
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
                // Unrevealed cell
                ctx.fillStyle = '#3a3a3a';
                ctx.fillRect(px, py, cellSize, cellSize);

                // Flag
                if (cell.isFlagged) {
                    ctx.fillStyle = '#ff4444';
                    ctx.font = '20px Arial';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText('🚩', px + cellSize / 2, py + cellSize / 2);
                }
            }

            // Borders
            ctx.strokeStyle = '#1a1a1a';
            ctx.lineWidth = 1;
            ctx.strokeRect(px, py, cellSize, cellSize);
        }
    }
}