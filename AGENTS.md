# AGENTS.md

## Project Overview

**A Regra das 3 Âncoras** (The Rule of 3 Anchors) is a spiritual pocket guide designed as a Progressive Web App (PWA). It helps users connect their will to God through three daily prayer stops: Morning, Midday, and Night.

This is a single-file HTML application created with Google AI Studio. The entire application logic, styling, and content are contained within `index.html`.

- **App Name**: A Regra das 3 Âncoras
- **Type**: Single-page PWA (Progressive Web App)
- **Language**: Portuguese (pt-BR)
- **AI Studio URL**: https://ai.studio/apps/5b5bbd01-e0f4-4bb2-8d40-4e474d6c316b

## Technology Stack

### Core Technologies
- **React**: ^19.0.0 (configured but minimal usage in current implementation)
- **TypeScript**: ~5.8.2
- **Vite**: ^6.2.0 (build tool and dev server)
- **Tailwind CSS**: v4.1.14 (styling via CDN and Vite plugin)

### Additional Dependencies
- **@google/genai**: ^1.29.0 (Gemini AI SDK)
- **better-sqlite3**: ^12.4.1 (SQLite database)
- **express**: ^4.21.2 (backend framework - configured but not actively used)
- **lucide-react**: ^0.546.0 (icon library)
- **motion**: ^12.23.24 (animation library)

### Fonts & Icons
- **Google Fonts**: Playfair Display (serif), Inter (sans-serif)
- **Material Symbols**: Outlined icons via Google Fonts

## Project Structure

```
/
├── index.html              # Main application (single-file app)
│                           # Contains HTML, inline CSS, and inline JavaScript
├── public/
│   └── sw.js               # Service Worker for PWA offline support
├── package.json            # Dependencies and npm scripts
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite build configuration
├── metadata.json           # AI Studio app metadata
├── .env.example            # Environment variables template
├── .gitignore              # Git ignore rules
└── README.md               # Human-readable project documentation
```

**Note**: There is no `src/` directory. This is intentionally a single-file application where all code resides in `index.html`.

## Build and Development Commands

```bash
# Install dependencies
npm install

# Start development server
# Runs on port 3000, accessible from all network interfaces (0.0.0.0)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Clean build artifacts (removes dist/ folder)
npm run clean

# Type check with TypeScript (no emit)
npm run lint
```

## Environment Variables

Create a `.env.local` file based on `.env.example`:

```bash
# Required for Gemini AI API calls
GEMINI_API_KEY="your_gemini_api_key_here"

# Auto-injected by AI Studio at runtime with Cloud Run service URL
APP_URL="your_app_url_here"
```

**Important**: The `GEMINI_API_KEY` is injected into the build via `vite.config.ts` and exposed as `process.env.GEMINI_API_KEY` in the client-side code.

## Code Organization

### Architecture Pattern
This is a **single-file application** with the following structure within `index.html`:

1. **Head Section**:
   - Tailwind CSS configuration (inline script)
   - Google Fonts loading
   - Custom CSS styles (glass effects, animations, color theming)

2. **Body Section**:
   - Screen 1: Home/Cover (`#screen-home`) - Full-screen landing page
   - Screen 2: Content (`#screen-content`) - Main study content with scrollable sections

3. **JavaScript** (at end of body):
   - `showScreen(id)` - Navigation function between screens
   - PWA manifest generation via Blob URL
   - Service Worker registration
   - PWA install prompt handling

### Styling Conventions

#### Color Palette (Custom Tailwind Config)
- `dark`: #0f1115 - Main background
- `surface`: #181b21 - Card backgrounds
- `surfaceLight`: #232730 - Lighter card backgrounds
- `gold`: #c6a87c - Primary accent
- `goldLight`: #D4AF37 - Secondary gold accent

#### Typography
- **Serif**: Playfair Display (headings, prayers)
- **Sans**: Inter (body text, UI elements)

#### CSS Classes
- `.glass` - Glassmorphism effect (translucent backgrounds)
- `.hide` - Utility to hide elements (`display: none !important`)
- `.fade-in` - Fade-in animation
- `.cinematic-shadow` - Text shadow for cinematic effect
- `.gradient-overlay` - Gradient overlay for images

### Navigation System
The app uses a simple screen-based navigation:
- Home screen (`#screen-home`) - Cover/landing page
- Content screen (`#screen-content`) - Main study material

Navigation is handled via `showScreen(id)` function that toggles visibility classes.

## PWA (Progressive Web App) Configuration

### Manifest
The web app manifest is dynamically generated via JavaScript using a Blob URL:
- **Name**: 3 Âncoras
- **Short Name**: 3 Âncoras
- **Theme Color**: #0f1115
- **Background Color**: #0f1115
- **Display Mode**: standalone
- **Icons**: Base64-encoded SVG icons

### Service Worker
Located at `public/sw.js`:
- Cache name: `3-ancoras-v1`
- Caches the root path for offline access
- Implements cache-first fetch strategy

### Install Prompt
The app listens for `beforeinstallprompt` event to show an install button on the home screen.

## TypeScript Configuration

Key settings in `tsconfig.json`:
- **Target**: ES2022
- **Module**: ESNext
- **JSX**: react-jsx
- **Path Alias**: `@/*` maps to root directory (`./*`)
- **Module Resolution**: bundler

## Vite Configuration

Key features in `vite.config.ts`:
- Plugins: React plugin + Tailwind CSS Vite plugin
- Environment variable injection for `GEMINI_API_KEY`
- Path resolution alias `@` pointing to project root
- HMR (Hot Module Replacement) can be disabled via `DISABLE_HMR` environment variable
  - **Note**: AI Studio disables HMR automatically to prevent flickering during agent edits

## Content Structure

The app contains spiritual content organized into three daily anchors:

1. **Âncora da Manhã** (Morning Anchor) - Upon waking
   - 2-minute version: Offering Prayer
   - 7-minute version: Offering Prayer + Psalm 23 + 2 minutes silence

2. **Âncora do Meio-Dia** (Midday Anchor) - Afternoon pause
   - 1-minute version: The Brief Invocation (Jaculatória)
   - 5-minute version: Invocation + Gospel reading + self-reflection

3. **Âncora da Noite** (Night Anchor) - Evening examination
   - 2-minute version: Act of Contrition
   - 7-minute version: Act of Contrition + three examination questions

## Security Considerations

- **API Keys**: The `GEMINI_API_KEY` is embedded in the client-side bundle via Vite's define config. This is acceptable for demo purposes but not recommended for production applications with sensitive keys.
- **No authentication**: The app is currently a static guide with no user authentication.

## Development Guidelines

### When Making Changes
1. **Single file approach**: All changes should be made to `index.html` unless adding new assets
2. **Styling**: Use Tailwind utility classes; custom CSS should be added to the `<style>` section in the head
3. **Images**: Currently using Unsplash URLs; for production, consider local assets
4. **Scripts**: Add JavaScript at the end of the body, before the closing `</body>` tag

### Path Aliases
- Use `@/` to reference files from the project root
- Example: `import something from '@/utils/helpers'`

### HMR Behavior
- HMR is enabled by default for local development
- In AI Studio environment, HMR is automatically disabled via `DISABLE_HMR` environment variable
- Do not modify the HMR configuration in `vite.config.ts` unless specifically required

## Deployment

This app is designed to be deployed via AI Studio's Cloud Run integration. The `APP_URL` environment variable is automatically injected at runtime.

For manual deployment:
1. Run `npm run build` to generate the `dist/` folder
2. Serve the `dist/` folder contents via any static web server
3. Ensure the service worker is served from `/sw.js`
