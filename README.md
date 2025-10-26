<div align="center">
    <img width="150" height="150" src="https://i.imgur.com/bkOWbtZ.png" alt="Logo WordBomb">
    <h1>WordBomb - Frontend</h1>
</div>

## Descripción

Frontend de WordBomb, un juego multijugador en tiempo real donde los jugadores compiten para escribir palabras que cumplan con ciertos requisitos. Este frontend está construido con SvelteKit y se conecta al backend mediante WebSockets y API REST.

## Tabla de Contenidos
- [Características](#características)
- [Tecnologías](#tecnologías)
- [Instalación](#instalación)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Componentes Principales](#componentes-principales)
- [Variables de Entorno](#variables-de-entorno)
- [Scripts Disponibles](#scripts-disponibles)
- [Despliegue](#despliegue)
- [Contribución](#contribución)
- [Licencia](#licencia)

## Características

- Interfaz de usuario moderna y responsiva
- Conexión en tiempo real con el servidor mediante WebSockets
- Sistema de autenticación con JWT
- Diferentes modos de juego (Clásico, Inverso, Difícil)
- Sistema de ranking con estadísticas de jugadores
- Chat en tiempo real
- Diseño adaptativo para móviles y escritorio
- Temas claro/oscuro
- Animaciones fluidas

## Tecnologías

- [SvelteKit](https://kit.svelte.dev/) - Framework web
- [TypeScript](https://www.typescriptlang.org/) - Tipado estático
- [Tailwind CSS](https://tailwindcss.com/) - Estilos
- [Socket.io](https://socket.io/) - Comunicación en tiempo real
- [Vite](https://vitejs.dev/) - Empaquetador y servidor de desarrollo
- [ESLint](https://eslint.org/) - Linter
- [Prettier](https://prettier.io/) - Formateo de código

## Instalación

1. Clonar el repositorio
   ```bash
   git clone https://github.com/tuusuario/wordbomb-frontend.git
   cd wordbomb-frontend
   ```

2. Instalar dependencias
   ```bash
   npm install
   # o
   pnpm install
   ```

3. Configurar variables de entorno
   ```bash
   cp .env.example .env
   # Editar .env con la URL de tu backend
   ```

4. Iniciar servidor de desarrollo
   ```bash
   npm run dev
   # o
   pnpm dev
   ```

## Estructura del Proyecto

```
wordbomb-frontend/
│
├─ src/
│   ├─ lib/
│   │   ├─ components/     # Componentes reutilizables
│   │   ├─ stores/         # Tiendas de Svelte
│   │   ├─ utils/          # Funciones de utilidad
│   │   └─ api/            # Cliente API y WebSocket
│   │
│   ├─ routes/
│   │   ├─ (auth)/         # Rutas de autenticación
│   │   ├─ (game)/         # Rutas del juego
│   │   └─ +layout.svelte  # Layout principal
│   │
│   ├─ app.html            # Plantilla HTML
│   └─ app.d.ts            # Tipos globales
│
├─ static/                # Archivos estáticos
├─ .env                   # Variables de entorno
├─ svelte.config.js       # Configuración de SvelteKit
├─ tailwind.config.js     # Configuración de Tailwind
└─ vite.config.ts         # Configuración de Vite
```

## Componentes Principales

### GameBoard.svelte
- Tablero principal del juego
- Muestra el prompt actual y el temporizador
- Maneja la entrada de palabras

### PlayerList.svelte
- Muestra la lista de jugadores en la sala
- Indica el jugador actual
- Muestra puntuaciones y estado

### Chat.svelte
- Chat en tiempo real
- Soporta emojis y comandos
- Notificaciones de eventos del juego

### Ranking.svelte
- Muestra el ranking de jugadores
- Filtros por modo de juego y período
- Estadísticas detalladas

## Variables de Entorno

```env
VITE_API_URL=http://localhost:5000  # URL del backend
VITE_SOCKET_URL=ws://localhost:5000  # URL del WebSocket
VITE_APP_NAME=WordBomb
VITE_APP_VERSION=1.0.0
```

## Scripts Disponibles

- `dev` - Inicia el servidor de desarrollo
- `build` - Construye la aplicación para producción
- `preview` - Previsualiza la versión de producción
- `check` - Verifica tipos de TypeScript
- `lint` - Ejecuta ESLint
- `format` - Formatea el código con Prettier

## Despliegue

### Requisitos
- Node.js 18+
- npm o pnpm

### Pasos para producción

1. Construir la aplicación:
   ```bash
   npm run build
   ```

2. La aplicación estará lista en el directorio `build`.

3. Para servir la aplicación, puedes usar cualquier servidor web estático como Nginx o servirla con:
   ```bash
   npm run preview
   ```

### Despliegue en Vercel/Netlify

1. Conecta tu repositorio a Vercel o Netlify
2. Configura las variables de entorno
3. Establece el directorio de salida como `build`
4. El despliegue se hará automáticamente

## Contribución

1. Haz un fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Haz commit de tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Haz push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Proyecto académico de primer año TSAS, para uso educativo.

---

<div align="center">
    Desarrollado por [Tu Nombre] - 2025
</div>
