# 🧪 Guía de Pruebas - Move37 Refactorizado

## 🚀 Inicio Rápido

### 1. Abrir la Aplicación
```bash
# Desde la carpeta del proyecto
open index.html
# O con un servidor local
python -m http.server 8000
# O con Node.js
npx serve
```

### 2. Probar en Navegador
- **Desktop**: Chrome, Firefox, Safari, Edge
- **Mobile**: Chrome Mobile, Safari iOS

## ✅ Checklist de Pruebas

### Funcionalidad General

- [ ] La aplicación carga sin errores en consola
- [ ] El wallpaper por defecto se muestra correctamente
- [ ] El widget de usuario aparece con datos correctos
- [ ] Los iconos de apps se muestran en el grid
- [ ] El dock se muestra en la última fila

### 🐍 Snake

#### Desktop
- [ ] Abre el juego correctamente
- [ ] Control con flechas funciona
- [ ] La serpiente se mueve suavemente
- [ ] Comida aparece en posiciones aleatorias
- [ ] Comida de diferentes colores/puntos aparece
- [ ] Efecto de partículas al comer funciona
- [ ] Colisión con bordes termina el juego
- [ ] Colisión con cuerpo termina el juego
- [ ] Score se actualiza correctamente
- [ ] Best score se guarda en localStorage
- [ ] Modal de Game Over aparece
- [ ] Botón Restart reinicia correctamente
- [ ] Botón cerrar vuelve a home

#### Mobile
- [ ] Canvas se ajusta al ancho de pantalla
- [ ] Swipe arriba cambia dirección a arriba
- [ ] Swipe abajo cambia dirección a abajo
- [ ] Swipe izquierda cambia dirección a izquierda
- [ ] Swipe derecha cambia dirección a derecha
- [ ] Touch responsivo (sin lag)

### ⛏️ Minesweeper

#### Desktop
- [ ] Abre el juego correctamente
- [ ] Click izquierdo revela celda
- [ ] Click derecho coloca/quita bandera
- [ ] Primer click nunca es mina
- [ ] Números de minas adyacentes correctos
- [ ] Revelar celda vacía expande automáticamente
- [ ] Timer inicia con primer click
- [ ] Timer se actualiza cada segundo
- [ ] Ganar revela mensaje de victoria
- [ ] Perder muestra todas las minas
- [ ] Modal correcto en ambos casos
- [ ] Botón New Game reinicia

#### Mobile
- [ ] Tap corto revela celda
- [ ] Long press (500ms) coloca bandera
- [ ] Vibración en long press (si disponible)
- [ ] Celdas del tamaño correcto para dedos
- [ ] No hay conflictos entre tap y long press

### 🏓 Pong

#### Desktop
- [ ] Abre el juego correctamente
- [ ] Flecha arriba mueve paddle
- [ ] Flecha abajo mueve paddle
- [ ] Paddle limitado a bordes del canvas
- [ ] Pelota se mueve suavemente
- [ ] Pelota rebota en paredes superior/inferior
- [ ] Colisión con paddle funciona correctamente
- [ ] Ángulo de rebote depende de punto de impacto
- [ ] IA sigue la pelota
- [ ] IA tiene dificultad ajustable
- [ ] Score se actualiza para jugador y AI
- [ ] Juego termina al llegar a 5 puntos
- [ ] Modal muestra ganador correcto

#### Mobile
- [ ] Touch y drag mueve el paddle
- [ ] Movimiento suave sin saltos
- [ ] Paddle sigue el dedo
- [ ] No hay lag en el movimiento

### 🎯 Combat

#### Desktop
- [ ] Abre el juego correctamente
- [ ] A/D rotan el tanque
- [ ] W/S mueven el tanque
- [ ] Espacio dispara
- [ ] Cooldown de disparo funciona
- [ ] Máximo 1 bala por jugador
- [ ] Balas se mueven correctamente
- [ ] Colisión con obstáculos funciona
- [ ] Colisión con tanque enemigo funciona
- [ ] AI se mueve y dispara
- [ ] AI apunta al jugador
- [ ] Score se actualiza
- [ ] Modal de Round Over correcto

#### Mobile
- [ ] Botón IZQUIERDA rota tanque
- [ ] Botón DERECHA rota tanque
- [ ] Botón DISPARAR dispara
- [ ] Tanque avanza solo automáticamente
- [ ] Botones tienen feedback visual
- [ ] No hay problemas de double-tap

### ⚙️ Settings

- [ ] Abre la app Settings
- [ ] Muestra lista de wallpapers
- [ ] Cada wallpaper tiene preview
- [ ] Wallpaper actual está marcado
- [ ] Click cambia wallpaper inmediatamente
- [ ] Wallpaper se guarda en localStorage
- [ ] Wallpaper persiste al recargar

### 💬 Messages

- [ ] Abre correctamente
- [ ] Muestra mensaje "Coming soon"
- [ ] Botón cerrar funciona

### 📱 Responsive

#### Desktop (≥768px)
- [ ] Grid de 4 columnas
- [ ] Widget 2x1 en posición correcta
- [ ] Dock en última fila
- [ ] Contenedor con bordes redondeados
- [ ] Tamaño máximo 1200px
- [ ] Centrado en pantalla

#### Mobile (<768px)
- [ ] Grid de 3 columnas
- [ ] Widget 2x1 ajustado
- [ ] Dock ocupa última fila
- [ ] Sin bordes (fullscreen)
- [ ] Canvas de juegos ajustado al ancho
- [ ] Controles táctiles visibles

### 🔧 Funcionalidad Técnica

#### InputManager
- [ ] Teclado registra correctamente
- [ ] Touch funciona en todos los juegos
- [ ] Swipe detecta dirección correcta
- [ ] Long press funciona (500ms)
- [ ] Event listeners se limpian al cerrar
- [ ] No hay memory leaks

#### StorageManager
- [ ] Best scores se guardan
- [ ] Best scores se cargan al abrir juego
- [ ] Wallpaper se guarda
- [ ] Wallpaper se carga al inicio
- [ ] Funciona sin localStorage (graceful degradation)

#### GameUI
- [ ] Canvas se crea correctamente
- [ ] Modales aparecen/desaparecen
- [ ] Grid retro se dibuja bien
- [ ] Texto centrado funciona
- [ ] Emojis se renderizan

#### Helpers
- [ ] randomInt genera números en rango
- [ ] clamp limita valores correctamente
- [ ] distance calcula distancias bien
- [ ] Colisiones detectan correctamente

### 🐛 Casos Edge

- [ ] Resize de ventana reajusta UI
- [ ] Cambio de orientación mobile funciona
- [ ] Spam de clicks no rompe juegos
- [ ] Cerrar juego durante partida limpia recursos
- [ ] Abrir múltiples juegos seguidos funciona
- [ ] localStorage lleno no rompe app
- [ ] Sin internet funciona (PWA ready)

## 🔍 Debugging

### Consola del Navegador
```javascript
// Ver estado de managers
console.log(window.StateManager)
console.log(window.InputManager)
console.log(window.StorageManager)

// Ver juego actual
console.log(window.NavigationManager.getCurrentGame())

// Limpiar localStorage
window.StorageManager.clear()
```

### Verificar Carga de Módulos
```javascript
// Todos deben existir
console.log({
    CONSTANTS: typeof CONSTANTS !== 'undefined',
    Helpers: typeof Helpers !== 'undefined',
    GameUI: typeof GameUI !== 'undefined',
    BaseGame: typeof BaseGame !== 'undefined',
    InputManager: typeof window.InputManager !== 'undefined',
    StorageManager: typeof window.StorageManager !== 'undefined'
})
```

### Performance
```javascript
// Medir FPS (en consola durante juego)
let lastTime = performance.now()
let frames = 0
setInterval(() => {
    const now = performance.now()
    const fps = Math.round(frames * 1000 / (now - lastTime))
    console.log('FPS:', fps)
    frames = 0
    lastTime = now
}, 1000)
// Incrementar en cada frame
frames++
```

## 📊 Métricas Esperadas

### Performance
- **FPS**: 60 (Snake, Pong, Combat)
- **FPS**: N/A (Minesweeper - no game loop)
- **Tiempo de carga**: < 1s
- **Memoria**: < 50MB

### UX
- **Tiempo de respuesta**: < 16ms
- **Animaciones**: 60fps
- **Touch response**: < 100ms

## ✅ Resultado Esperado

Si todas las pruebas pasan:
- ✅ **Funcionalidad**: 100%
- ✅ **Responsive**: 100%
- ✅ **Performance**: Óptimo
- ✅ **Code Quality**: Excelente
- ✅ **Mantenibilidad**: Alta

## 🐛 Reportar Bugs

Si encuentras algún bug:

1. **Anotar**:
   - Navegador y versión
   - Device (desktop/mobile)
   - Pasos para reproducir
   - Mensaje de error (si hay)
   - Comportamiento esperado vs actual

2. **Verificar**:
   - Consola del navegador (F12)
   - Network tab (recursos cargados)
   - localStorage (datos guardados)

3. **Logs útiles**:
   ```javascript
   console.log('Estado actual:', {
       game: window.NavigationManager?.getCurrentGame(),
       wallpaper: window.StateManager?.getCurrentWallpaper(),
       scores: {
           snake: window.StorageManager?.getBestScore('snake'),
           minesweeper: window.StorageManager?.getBestScore('minesweeper'),
           pong: window.StorageManager?.getBestScore('pong'),
           combat: window.StorageManager?.getBestScore('combat')
       }
   })
   ```

## 🎉 Happy Testing!

La aplicación está completamente refactorizada y lista para producción. ¡Disfruta probando todos los juegos!
