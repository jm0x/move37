/**
 * BrowserApp - Aplicación de navegador
 * Placeholder para futura implementación
 */

class BrowserApp extends BaseApp {
    constructor() {
        super({
            id: 'browser',
            name: 'Browser',
            icon: '🦊'
        });
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
                background: #c0c0c0;
                width: 550px;
                height: 100%;
                border-radius: 0;
                overflow: hidden;
                font-family: 'Times New Roman', serif;
            ">
                <!-- Netscape Navigator Header -->
                <div style="
                    background: linear-gradient(to bottom, #bdbdbd 0%, #949494 100%);
                    border-bottom: 2px solid #808080;
                    padding: 2px;
                    flex-shrink: 0;
                ">
                    <!-- Title Bar -->
                    <div style="
                        background: linear-gradient(to right, #000080, #1084d0);
                        color: white;
                        padding: 3px 5px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        font-family: 'Arial', sans-serif;
                        font-size: 11px;
                        font-weight: bold;
                    ">
                        <span>Netscape - [Welcome to GeoCities]</span>
                        <span style="font-family: 'Courier New', monospace;">_ □ ✕</span>
                    </div>

                    <!-- Menu Bar -->
                    <div style="
                        background: #c0c0c0;
                        padding: 2px 5px;
                        font-size: 11px;
                        border-bottom: 1px solid #808080;
                    ">
                        <span style="margin-right: 10px;">File</span>
                        <span style="margin-right: 10px;">Edit</span>
                        <span style="margin-right: 10px;">View</span>
                        <span style="margin-right: 10px;">Go</span>
                        <span style="margin-right: 10px;">Bookmarks</span>
                        <span>Help</span>
                    </div>

                    <!-- Toolbar -->
                    <div style="
                        background: #c0c0c0;
                        padding: 4px 5px;
                        display: flex;
                        gap: 5px;
                        align-items: center;
                        border-bottom: 1px solid #808080;
                        font-size: 10px;
                    ">
                        <button style="
                            background: #c0c0c0;
                            border: 1px solid #000;
                            border-top-color: #fff;
                            border-left-color: #fff;
                            padding: 2px 6px;
                            font-size: 10px;
                            cursor: pointer;
                        ">Back</button>
                        <button style="
                            background: #c0c0c0;
                            border: 1px solid #000;
                            border-top-color: #fff;
                            border-left-color: #fff;
                            padding: 2px 6px;
                            font-size: 10px;
                            cursor: pointer;
                        ">Forward</button>
                        <button style="
                            background: #c0c0c0;
                            border: 1px solid #000;
                            border-top-color: #fff;
                            border-left-color: #fff;
                            padding: 2px 6px;
                            font-size: 10px;
                            cursor: pointer;
                        ">Reload</button>
                        <button style="
                            background: #c0c0c0;
                            border: 1px solid #000;
                            border-top-color: #fff;
                            border-left-color: #fff;
                            padding: 2px 6px;
                            font-size: 10px;
                            cursor: pointer;
                        ">Home</button>
                    </div>

                    <!-- Address Bar -->
                    <div style="
                        background: #c0c0c0;
                        padding: 4px 5px;
                        display: flex;
                        align-items: center;
                        gap: 5px;
                        font-size: 11px;
                    ">
                        <span style="font-weight: bold;">Location:</span>
                        <input type="text" value="http://www.geocities.com/SiliconValley/5678/" readonly style="
                            flex: 1;
                            background: white;
                            border: 2px inset #808080;
                            padding: 2px 4px;
                            font-size: 11px;
                        ">
                    </div>
                </div>

                <!-- GeoCities Page Content -->
                <div style="
                    flex: 1;
                    background: #ffffff;
                    overflow-y: scroll;
                    padding: 20px;
                    color: #000;
                ">
                    <!-- Animated GIF Banner -->
                    <div style="
                        text-align: center;
                        background: linear-gradient(45deg, #ff00ff, #00ffff, #ffff00);
                        padding: 10px;
                        margin-bottom: 15px;
                        border: 3px ridge gold;
                        animation: rainbow 2s linear infinite;
                    ">
                        <marquee style="font-size: 24px; font-weight: bold; color: #ff0000;">
                            ✨ WELCOME TO MY HOMEPAGE ✨
                        </marquee>
                    </div>

                    <!-- Under Construction -->
                    <div style="text-align: center; margin: 20px 0;">
                        <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='40'%3E%3Crect fill='%23ffff00' stroke='%23000' stroke-width='2' width='200' height='40'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' font-family='Arial' font-weight='bold' font-size='14'%3E🚧 UNDER CONSTRUCTION 🚧%3C/text%3E%3C/svg%3E" alt="Under Construction">
                    </div>

                    <!-- Main Content -->
                    <center>
                        <h1 style="
                            font-size: 28px;
                            color: #0000ff;
                            text-shadow: 2px 2px #ff00ff;
                            font-family: 'Comic Sans MS', cursive;
                        ">My Awesome Website!</h1>

                        <p style="font-size: 14px; margin: 15px 0;">
                            <blink>👾 You are visitor #<span style="background: #000; color: #0f0; padding: 2px 5px; font-family: monospace;">003847</span> 👾</blink>
                        </p>

                        <hr style="border: 2px dashed #ff00ff;">

                        <table border="3" cellpadding="10" style="margin: 20px auto; background: #ffff99;">
                            <tr>
                                <td style="background: #ff99cc;">
                                    <h2 style="color: #800080; font-family: 'Comic Sans MS', cursive;">
                                        🎵 About Me 🎵
                                    </h2>
                                    <p style="font-size: 12px;">
                                        Welcome to my corner of the internet!<br>
                                        I love: 💾 Computers, 🎮 Video Games, 🌟 Anime
                                    </p>
                                </td>
                            </tr>
                        </table>

                        <p style="font-size: 13px; margin: 15px 0;">
                            <a href="#" style="color: #0000ff; text-decoration: underline;">
                                Click here for my cool links!
                            </a>
                        </p>

                        <div style="margin: 20px 0;">
                            <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='88' height='31'%3E%3Crect fill='%230000ff' width='88' height='31'/%3E%3Ctext x='44' y='16' text-anchor='middle' fill='white' font-family='Arial' font-size='10' font-weight='bold'%3EBest viewed in%3C/text%3E%3Ctext x='44' y='26' text-anchor='middle' fill='%23ffff00' font-family='Arial' font-size='8' font-weight='bold'%3ENetscape%3C/text%3E%3C/svg%3E" alt="Best viewed in Netscape">
                        </div>

                        <marquee behavior="alternate" style="
                            background: #000080;
                            color: white;
                            padding: 10px;
                            margin: 20px 0;
                            border: 2px solid #ffff00;
                        ">
                            ⭐ Thanks for visiting! Sign my guestbook! ⭐
                        </marquee>

                        <p style="font-size: 10px; color: #808080; margin-top: 30px;">
                            Last updated: 1999<br>
                            © GeoCities 1999 - This page is best viewed at 800x600
                        </p>
                    </center>
                </div>

                <!-- Status Bar -->
                <div style="
                    background: #c0c0c0;
                    border-top: 1px solid #808080;
                    padding: 2px 5px;
                    font-size: 10px;
                    display: flex;
                    gap: 10px;
                    flex-shrink: 0;
                ">
                    <span>Document: Done</span>
                </div>
            </div>

            <style>
                @keyframes rainbow {
                    0% { background-position: 0% 50%; }
                    100% { background-position: 100% 50%; }
                }
                blink {
                    animation: blink-animation 1s steps(2, start) infinite;
                }
                @keyframes blink-animation {
                    50% { opacity: 0; }
                }
            </style>
        `;
    }
}

// Exportar para uso global
window.BrowserApp = BrowserApp;
