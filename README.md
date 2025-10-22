<div align="center">
    <img width="150" height="150" src="https://i.imgur.com/bkOWbtZ.png" alt="Logo WordBomb">
</div>

# Wordbomb Frontend

Wordbomb es un juego de mecanografía inspirado en [jklm.fun](https://jklm.fun).\
Este es el frontend de la aplicación, construido con Astro, Svelte y TypeScript.\
Fue creado como parte del Trabajo Integrador Final de las materias `Estructura de Datos, Programación, Práctica Profesional Laboratorio` en el [Instituto Superior Adventista de Misiones](https://isam.educacionadventista.com)\
El objetivo de este proyecto es el de integrar las tecnologías aprendidas en un proyecto práctico para aplicar todos nuestros conocimientos.

## Estructura del proyecto

```
wordbomb-frontend/
│
├─ src/
│   ├─ components/     # Componentes reutilizables (Astro/Svelte)
│   │   ├─ index/      # Componentes de la página principal
│   │   └─ profile/    # Componentes del perfil de usuario
│   ├─ config/         # Configuración de la aplicación
│   ├─ layouts/        # Layouts base de Astro
│   ├─ lib/            # Utilidades y servicios (API, etc.)
│   ├─ pages/          # Páginas de la aplicación
│   ├─ services/       # Servicios de API (auth, etc.)
│   ├─ stores/         # Estado global (Svelte stores)
│   └─ styles/         # Estilos globales
│
├─ public/             # Archivos estáticos (imágenes, favicon, etc.)
├─ astro.config.mjs    # Configuración de Astro
├─ package.json        # Dependencias del proyecto
├─ svelte.config.js    # Configuración de Svelte
├─ tsconfig.json       # Configuración de TypeScript
└─ README.md           # Documentación

```

## Módulos principales

> ### src/components/
>
> Contiene los componentes reutilizables de la interfaz:

- **index/**: Componentes de la página principal (Header, Main, Footer).
- **profile/**: Componentes del perfil de usuario.

Modularización con componentes Astro y Svelte para mantener el código limpio.

> ### src/services/
>
> **authService.ts**: Servicio de autenticación

Contiene métodos para login, registro, logout y verificación de tokens JWT.

> ### src/lib/
>
> **api.ts**: Cliente HTTP base

- `ApiService`: Clase base para comunicación con la API.
- `Request cancellation`: Cancelación automática de requests duplicados.

Implementa interceptores para manejo de tokens y errores.

> ### src/stores/

- **auth.ts**: Store de Svelte para estado de autenticación.
- **Estado global**: Gestión reactiva del estado de la aplicación.

Stores de Svelte para manejo de estado global de forma reactiva.

> ### src/pages/

- Páginas principales de la aplicación (index, profile, ranking).
- Enrutamiento automático de Astro basado en archivos.

Punto de entrada de las rutas de la aplicación.

## Requisitos

Instalar dependencias:

```bash
pnpm install
# o
npm install
```

Establecer variables de entorno (`.env.local`)

```env
# URL base de la API del backend
VITE_API_BASE_URL=http://localhost:7777
```

## Uso

Iniciar el servidor de desarrollo

```bash
pnpm dev
# o
npm run dev
```

La aplicación estará disponible en `http://localhost:4321`

## Licencia

Proyecto académico de primer año TSAS, para uso educativo.
