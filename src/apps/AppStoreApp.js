/**
 * AppStoreApp - Aplicación de tienda de aplicaciones
 * Permite explorar y descubrir nuevas apps y juegos
 */

class AppStoreApp extends BaseApp {
    constructor() {
        super({
            id: 'appstore',
            name: 'App Store',
            icon: '💎'
        });

        // Catálogo de juegos disponibles en la tienda
        this.availableGames = [
            {
                id: 'tetris',
                name: 'Block Cascade',
                icon: '🟦',
                description: 'El clásico juego de bloques que cayendo. Organiza las piezas y completa líneas para conseguir puntos.',
                category: 'Puzzle',
                status: 'Coming Soon'
            },
            {
                id: 'spaceinvaders',
                name: 'Galaxy Defense',
                icon: '👾',
                description: 'Defiende la Tierra de la invasión alienígena. Dispara a las naves enemigas antes de que te alcancen.',
                category: 'Arcade',
                status: 'Coming Soon'
            },
            {
                id: 'chess',
                name: 'Chess Master',
                icon: '♟️',
                description: 'Juega al ajedrez contra una IA avanzada. Mejora tu estrategia y conviértete en un maestro.',
                category: 'Strategy',
                status: 'Coming Soon'
            },
            {
                id: 'breakout',
                name: 'Brick Breaker',
                icon: '🧱',
                description: 'Rompe todos los ladrillos con tu pelota. Controla la paleta y evita que la bola caiga.',
                category: 'Arcade',
                status: 'Coming Soon'
            },
            {
                id: 'sudoku',
                name: 'Sudoku Pro',
                icon: '🔢',
                description: 'Resuelve puzzles de sudoku de diferentes dificultades. Entrena tu mente con lógica numérica.',
                category: 'Puzzle',
                status: 'Coming Soon'
            },
            {
                id: '2048',
                name: 'Number Fusion',
                icon: '🎯',
                description: 'Combina números hasta llegar a la cifra objetivo. Un puzzle adictivo que pondrá a prueba tu estrategia.',
                category: 'Puzzle',
                status: 'Coming Soon'
            },
            {
                id: 'flappybird',
                name: 'Sky Dash',
                icon: '🐦',
                description: 'Vuela entre obstáculos sin chocar. Un juego simple pero extremadamente desafiante.',
                category: 'Arcade',
                status: 'Coming Soon'
            },
            {
                id: 'pacman',
                name: 'Dot Chomper',
                icon: '🟡',
                description: 'Come todas las píldoras mientras evitas a los fantasmas. El clásico que nunca pasa de moda.',
                category: 'Arcade',
                status: 'Coming Soon'
            },
            {
                id: 'memory',
                name: 'Memory Match',
                icon: '🃏',
                description: 'Encuentra las parejas de cartas iguales. Mejora tu memoria mientras te diviertes.',
                category: 'Puzzle',
                status: 'Coming Soon'
            },
            {
                id: 'racing',
                name: 'Speed Racer',
                icon: '🏎️',
                description: 'Compite en carreras de alta velocidad. Esquiva el tráfico y alcanza la meta primero.',
                category: 'Racing',
                status: 'Coming Soon'
            }
        ];
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
            <div style="
                display: flex;
                flex-direction: column;
                background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
                color: #fff;
                width: 550px;
                height: 100%;
                border-radius: 0;
                overflow: hidden;
            ">
                <!-- Header fijo -->
                <div style="
                    padding: 20px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    background: rgba(0, 0, 0, 0.5);
                    backdrop-filter: blur(10px);
                    flex-shrink: 0;
                ">
                    <h2 style="
                        margin: 0 0 5px 0;
                        font-size: 28px;
                        font-weight: 600;
                    ">💎 App Store</h2>
                    <p style="
                        margin: 0;
                        color: rgba(255, 255, 255, 0.6);
                        font-size: 14px;
                    ">Descubre nuevos juegos y aplicaciones</p>
                </div>

                <!-- Lista de juegos con scroll -->
                <div id="app-store-scroll" style="
                    flex: 1;
                    overflow-y: scroll;
                    overflow-x: hidden;
                    padding: 20px;
                    -webkit-overflow-scrolling: touch;
                    min-height: 0;
                ">
                    <div style="display: flex; flex-direction: column; gap: 15px;">
                        ${this.availableGames.map(game => this.createGameCard(game)).join('')}
                    </div>
                </div>
            </div>

            <style>
                /* Scrollbar para Chrome/Safari/Edge */
                #app-store-scroll::-webkit-scrollbar {
                    width: 10px;
                }

                #app-store-scroll::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 5px;
                }

                #app-store-scroll::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 5px;
                }

                #app-store-scroll::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.5);
                }

                /* Scrollbar para Firefox */
                #app-store-scroll {
                    scrollbar-width: thin;
                    scrollbar-color: rgba(255, 255, 255, 0.3) rgba(255, 255, 255, 0.05);
                }
            </style>
        `;
    }

    /**
     * Crea una tarjeta de juego
     */
    createGameCard(game) {
        return `
            <div style="
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 15px;
                padding: 15px;
                display: flex;
                gap: 15px;
                align-items: center;
                transition: all 0.3s ease;
                cursor: pointer;
                backdrop-filter: blur(10px);
            "
            onmouseover="this.style.background='rgba(255, 255, 255, 0.1)'; this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 20px rgba(0,0,0,0.3)'"
            onmouseout="this.style.background='rgba(255, 255, 255, 0.05)'; this.style.transform='translateY(0)'; this.style.boxShadow='none'"
            onclick="window.UIManager.showMessage('${game.name} - Coming Soon!')"
            >
                <!-- Icono del juego -->
                <div style="
                    font-size: 50px;
                    min-width: 70px;
                    height: 70px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(0, 0, 0, 0.3);
                    border-radius: 15px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                ">
                    ${game.icon}
                </div>

                <!-- Información del juego -->
                <div style="flex: 1; min-width: 0;">
                    <h3 style="
                        margin: 0 0 5px 0;
                        font-size: 18px;
                        font-weight: 600;
                        color: #fff;
                    ">${game.name}</h3>

                    <p style="
                        margin: 0 0 8px 0;
                        font-size: 13px;
                        color: rgba(255, 255, 255, 0.7);
                        line-height: 1.4;
                    ">${game.description}</p>

                    <div style="display: flex; gap: 10px; align-items: center;">
                        <span style="
                            background: rgba(0, 122, 255, 0.2);
                            color: #007AFF;
                            padding: 3px 10px;
                            border-radius: 12px;
                            font-size: 11px;
                            font-weight: 500;
                            border: 1px solid rgba(0, 122, 255, 0.3);
                        ">${game.category}</span>

                        <span style="
                            color: rgba(255, 255, 255, 0.4);
                            font-size: 11px;
                        ">${game.status}</span>
                    </div>
                </div>

                <!-- Botón de descarga/info -->
                <div style="
                    background: rgba(0, 122, 255, 0.2);
                    color: #007AFF;
                    padding: 8px 16px;
                    border-radius: 20px;
                    font-size: 13px;
                    font-weight: 600;
                    border: 1px solid rgba(0, 122, 255, 0.3);
                    white-space: nowrap;
                ">
                    Ver más
                </div>
            </div>
        `;
    }
}

// Exportar para uso global
window.AppStoreApp = AppStoreApp;
