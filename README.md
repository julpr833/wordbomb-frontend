# Wordbomb Frontend - SvelteKit Rewrite

This is a complete rewrite of the Wordbomb frontend using SvelteKit instead of Astro.

## Features

- **SvelteKit**: Modern full-stack framework with built-in routing, SSR, and more
- **Svelte Stores**: Reactive state management for auth and game state
- **Tailwind CSS**: Utility-first CSS framework with custom animations
- **TypeScript**: Full type safety throughout the application
- **API Integration**: Clean API layer using SvelteKit's fetch capabilities

## Project Structure

```
src/
├── lib/
│   ├── api/           # API functions (auth, game)
│   ├── components/    # Reusable Svelte components
│   ├── config/        # Configuration files
│   └── stores/        # Svelte stores (auth, game)
├── routes/            # SvelteKit pages and layouts
│   ├── create-room/   # Create room page
│   ├── join-room/     # Join room page
│   ├── profile/       # User profile page
│   ├── ranking/       # Ranking page
│   ├── room/[roomCode]/ # Dynamic room pages
│   ├── +layout.svelte # Root layout
│   └── +page.svelte   # Home page
└── app.css           # Global styles
```

## Key Improvements

1. **No AuthGuard**: Removed the AuthGuard component - authentication is handled through SvelteKit's built-in features
2. **SvelteKit Stores**: Replaced custom services with reactive Svelte stores
3. **API Layer**: Clean API functions using SvelteKit's fetch instead of axios
4. **Routing**: File-based routing with SvelteKit's `+page.svelte` convention
5. **Type Safety**: Full TypeScript support throughout

## Getting Started

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Create environment file:
   ```bash
   cp .env.example .env
   ```

3. Update the API base URL in `.env`:
   ```
   VITE_API_BASE_URL=http://localhost:7777
   ```

4. Start development server:
   ```bash
   pnpm dev
   ```

## Pages

- `/` - Home page with hero section, game modes, and ranking preview
- `/create-room` - Create a new game room
- `/join-room` - Join an existing game room
- `/room/[roomCode]` - Room lobby (dynamic route)
- `/profile` - User profile page
- `/ranking` - Full ranking page

## Components

All components are now pure Svelte components located in `src/lib/components/`:

- `Header.svelte` - Navigation header with auth
- `Footer.svelte` - Site footer
- `Main/` - Home page sections (Hero, HowToPlay, GameModes, Ranking)
- `Header/` - Auth-related components (Login, Profile, etc.)

## API Integration

The API layer is organized in `src/lib/api/`:

- `auth.ts` - Authentication API functions
- `game.ts` - Game-related API functions
- `api.ts` - Base API utilities

## State Management

Svelte stores in `src/lib/stores/`:

- `auth.ts` - Authentication state and actions
- `game.ts` - Game state and actions

## Styling

- Tailwind CSS with custom theme configuration
- Custom animations and scroll effects
- Responsive design
- Dark theme with orange/blue color scheme