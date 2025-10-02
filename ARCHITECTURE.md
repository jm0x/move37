# Arquitectura del Proyecto Move37

## Estructura Modular

El proyecto ha sido refactorizado siguiendo las mejores prácticas del sector, con una arquitectura completamente modular que facilita la adición de nuevos juegos y aplicaciones.

```
move37/
├── src/
│   ├── config/           # Configuración global
│   │   ├── constants.js  # Constantes del sistema
│   │   └── gameConfig.js # Configuración de juegos y apps
│   │
│   ├── core/             # Clases base y módulos fundamentales
│   │   ├── BaseGame.js   # Clase abstracta para juegos
│   │   ├── BaseApp.js    # Clase abstracta para apps
│   │   ├── GameContainer.js  # Contenedor UI de juegos
│   │   ├── InputManager.js   # Gestión de inputs
│   │   └── StorageManager.js # Gestión de localStorage
│   │
│   ├── loaders/          # Cargadores dinámicos
│   │   ├── GameLoader.js # Carga dinámica de juegos
│   │   └── AppLoader.js  # Carga dinámica de apps
│   │
│   ├── managers/         # Gestores del sistema
│   │   ├── NavigationManager.js  # Navegación entre pantallas
│   │   ├── StateManager.js       # Estado global
│   │   └── UIManager.js          # Interfaz de usuario
│   │
│   ├── utils/            # Utilidades
│   │   ├── helpers.js    # Funciones helper
│   │   ├── gameUI.js     # Utilidades UI para juegos
│   │   └── gameStyles.js # Estilos comunes
│   │
│   ├── games/            # Juegos del sistema
│   │   ├── SnakeGame.js
│   │   ├── MinesweeperGame.js
│   │   ├── PongGame.js
│   │   └── CombatGame.js
│   │
│   ├── apps/             # Aplicaciones del sistema
│   │   ├── SettingsApp.js
│   │   ├── MessagesApp.js
│   │   ├── BrowserApp.js
│   │   └── AppStoreApp.js
│   │
│   └── app.js            # Punto de entrada principal
│
├── index.html            # HTML principal
├── styles.css            # Estilos globales
└── gameContainer.css     # Estilos del contenedor de juegos
```

## Principios de Diseño

### 1. Separación de Responsabilidades
- **Core**: Clases base y funcionalidad fundamental
- **Managers**: Gestión de estado, navegación y UI
- **Loaders**: Carga dinámica de contenido
- **Games/Apps**: Implementaciones específicas

### 2. Herencia y Polimorfismo
- `BaseGame`: Todos los juegos heredan de esta clase
- `BaseApp`: Todas las apps heredan de esta clase
- Implementación consistente de métodos abstractos

### 3. Inyección de Dependencias
- Los loaders gestionan la creación de instancias
- Los managers coordinan la interacción entre componentes

## Cómo Añadir Nuevos Juegos

1. **Crear el archivo del juego** en `src/games/`:
```javascript
// src/games/TuNuevoJuego.js
class TuNuevoJuego extends BaseGame {
    constructor() {
        super({
            modalId: 'gameOver',
            titleId: 'gameOverTitle',
            messageId: 'gameOverMessage',
            restartBtnId: 'restartBtn'
        });
    }

    createCanvas(gameArea) {
        // Implementar creación de canvas
    }

    setupEventListeners() {
        // Implementar event listeners
    }

    start() {
        // Implementar inicio del juego
    }

    update() {
        // Implementar lógica de actualización
    }

    render() {
        // Implementar renderizado
    }

    reset() {
        // Implementar reinicio
    }
}

window.TuNuevoJuego = TuNuevoJuego;
```

2. **Registrar el juego** en `src/config/gameConfig.js`:
```javascript
{
    id: 'tunuevojuego',
    name: 'Tu Nuevo Juego',
    icon: '🎮',
    color: '#FF5733',
    isDock: false
}
```

3. **Añadir al GameLoader** en `src/loaders/GameLoader.js`:
```javascript
case 'tunuevojuego':
    this.loadTuNuevoJuego(gameArea);
    break;
```

4. **Añadir función de inicialización**:
```javascript
loadTuNuevoJuego(gameArea) {
    if (typeof initializeTuNuevoJuegoInContainer === 'function') {
        initializeTuNuevoJuegoInContainer(gameArea, this.gameContainer);
    }
}
```

5. **Añadir script al index.html**:
```html
<script src="src/games/TuNuevoJuego.js"></script>
```

## Cómo Añadir Nuevas Apps

1. **Crear el archivo de la app** en `src/apps/`:
```javascript
// src/apps/TuNuevaApp.js
class TuNuevaApp extends BaseApp {
    constructor() {
        super({
            id: 'tunuevaapp',
            name: 'Tu Nueva App',
            icon: '📱'
        });
    }

    render() {
        if (!this.container) return;
        this.container.innerHTML = this.getContent();
    }

    getContent() {
        return `
            <div style="padding: 20px; color: #fff;">
                <h2>Tu Nueva App</h2>
                <!-- Tu contenido aquí -->
            </div>
        `;
    }
}

window.TuNuevaApp = TuNuevaApp;
```

2. **Registrar la app** en `src/config/gameConfig.js`:
```javascript
{
    id: 'tunuevaapp',
    name: 'Tu Nueva App',
    icon: '📱',
    color: '#007AFF',
    isDock: true  // true para dock, false para grid
}
```

3. **Añadir al AppLoader** en `src/loaders/AppLoader.js`:
```javascript
case 'tunuevaapp':
    app = new TuNuevaApp();
    break;
```

4. **Añadir script al index.html**:
```html
<script src="src/apps/TuNuevaApp.js"></script>
```

## Beneficios de la Nueva Arquitectura

✅ **Modularidad**: Cada componente tiene una responsabilidad clara
✅ **Escalabilidad**: Fácil añadir nuevos juegos y apps
✅ **Mantenibilidad**: Código organizado y fácil de mantener
✅ **Reutilización**: Clases base compartidas reducen duplicación
✅ **Testabilidad**: Componentes independientes más fáciles de probar
✅ **Extensibilidad**: Sistema de loaders permite añadir funcionalidades

## Cambios Realizados

1. ✅ Creada arquitectura modular con `BaseApp` y `BaseGame`
2. ✅ Implementado sistema de loaders (`AppLoader`, `GameLoader`)
3. ✅ Separadas apps de juegos con su propia estructura
4. ✅ Movidos archivos de raíz a `src/`
5. ✅ Eliminados archivos legacy (`games_legacy/`, `script.legacy.js`)
6. ✅ Refactorizado `UIManager` eliminando código obsoleto
7. ✅ Actualizado `NavigationManager` para usar loaders
8. ✅ Cambiado icono "Upgrade ⭐" por "App Store 🏪"
9. ✅ Actualizado `index.html` con nuevas rutas
10. ✅ Organizada estructura de directorios por responsabilidades

## Próximos Pasos Sugeridos

- Implementar sistema de plugins para mayor flexibilidad
- Añadir TypeScript para mayor type safety
- Implementar lazy loading para optimizar carga inicial
- Crear tests unitarios para componentes críticos
- Documentar APIs públicas de cada módulo
