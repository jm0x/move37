/**
 * MessagesApp - Aplicación de mensajes
 * Muestra una lista de correos electrónicos recibidos
 */

class MessagesApp extends BaseApp {
    constructor() {
        super({
            id: 'messages',
            name: 'Messages',
            icon: '✉️'
        });

        // Lista de correos electrónicos sobre juegos
        this.emails = [
            {
                from: 'Block Cascade Studio',
                subject: 'New Update v2.3 Available!',
                preview: 'Experience the all-new cascade effects and power-ups in our latest update...',
                time: '10:30 AM',
                unread: true
            },
            {
                from: 'Galaxy Defense Team',
                subject: 'Weekend Tournament Announcement',
                preview: 'Join our exclusive weekend tournament and compete for the top spot...',
                time: '9:15 AM',
                unread: true
            },
            {
                from: 'Chess Master Newsletter',
                subject: 'New AI Difficulty Level Unlocked',
                preview: 'We\'ve added Grandmaster difficulty - are you ready for the challenge?',
                time: 'Yesterday',
                unread: false
            },
            {
                from: 'Brick Breaker Games',
                subject: 'Special Power-Ups Now Available',
                preview: 'Check out the new explosive ball and laser paddle power-ups...',
                time: 'Yesterday',
                unread: false
            },
            {
                from: 'Sudoku Pro',
                subject: 'Daily Challenge Streak Bonus',
                preview: 'You\'re on a 7-day streak! Complete today\'s puzzle for bonus points...',
                time: 'Monday',
                unread: false
            },
            {
                from: 'Number Fusion Studios',
                subject: 'New Game Mode: Time Attack',
                preview: 'Race against the clock in our brand new Time Attack mode...',
                time: 'Monday',
                unread: false
            },
            {
                from: 'Sky Dash Community',
                subject: 'Player Leaderboard Update',
                preview: 'You\'ve moved up to rank #147! Keep flying to reach the top 100...',
                time: 'Friday',
                unread: false
            },
            {
                from: 'Dot Chomper Dev Team',
                subject: 'Beta Test Invitation',
                preview: 'You\'ve been selected to beta test our new ghost AI behaviors...',
                time: 'Thursday',
                unread: false
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
                    ">✉️ Messages</h2>
                    <p style="
                        margin: 0;
                        color: rgba(255, 255, 255, 0.6);
                        font-size: 14px;
                    ">Inbox</p>
                </div>

                <!-- Lista de correos con scroll -->
                <div id="messages-scroll" style="
                    flex: 1;
                    overflow-y: scroll;
                    overflow-x: hidden;
                    padding: 20px;
                    -webkit-overflow-scrolling: touch;
                    min-height: 0;
                ">
                    <div style="display: flex; flex-direction: column; gap: 15px;">
                        ${this.emails.map(email => this.createEmailCard(email)).join('')}
                    </div>
                </div>
            </div>

            <style>
                /* Scrollbar para Chrome/Safari/Edge */
                #messages-scroll::-webkit-scrollbar {
                    width: 10px;
                }

                #messages-scroll::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 5px;
                }

                #messages-scroll::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 5px;
                }

                #messages-scroll::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.5);
                }

                /* Scrollbar para Firefox */
                #messages-scroll {
                    scrollbar-width: thin;
                    scrollbar-color: rgba(255, 255, 255, 0.3) rgba(255, 255, 255, 0.05);
                }
            </style>
        `;
    }

    /**
     * Crea una tarjeta de correo electrónico
     */
    createEmailCard(email) {
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
                ${email.unread ? 'border-left: 3px solid #007AFF;' : ''}
            "
            onmouseover="this.style.background='rgba(255, 255, 255, 0.1)'; this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 20px rgba(0,0,0,0.3)'"
            onmouseout="this.style.background='rgba(255, 255, 255, 0.05)'; this.style.transform='translateY(0)'; this.style.boxShadow='none'"
            onclick="window.UIManager.showMessage('${email.subject}')"
            >
                <!-- Icono de sobre -->
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
                    📧
                </div>

                <!-- Información del correo -->
                <div style="flex: 1; min-width: 0;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                        <h3 style="
                            margin: 0;
                            font-size: 16px;
                            font-weight: 600;
                            color: #fff;
                            ${email.unread ? 'font-weight: 700;' : ''}
                        ">${email.from}</h3>
                        <span style="
                            color: rgba(255, 255, 255, 0.5);
                            font-size: 11px;
                            white-space: nowrap;
                            margin-left: 10px;
                        ">${email.time}</span>
                    </div>

                    <h4 style="
                        margin: 0 0 5px 0;
                        font-size: 14px;
                        font-weight: ${email.unread ? '600' : '500'};
                        color: ${email.unread ? '#fff' : 'rgba(255, 255, 255, 0.9)'};
                    ">${email.subject}</h4>

                    <p style="
                        margin: 0;
                        font-size: 13px;
                        color: rgba(255, 255, 255, 0.6);
                        line-height: 1.4;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    ">${email.preview}</p>

                    ${email.unread ? `
                        <div style="margin-top: 8px;">
                            <span style="
                                background: rgba(0, 122, 255, 0.2);
                                color: #007AFF;
                                padding: 3px 10px;
                                border-radius: 12px;
                                font-size: 11px;
                                font-weight: 500;
                                border: 1px solid rgba(0, 122, 255, 0.3);
                            ">Unread</span>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }
}

// Exportar para uso global
window.MessagesApp = MessagesApp;
