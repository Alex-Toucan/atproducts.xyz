# CLAUDE.md - Angry Tirds Project Guidelines

## Build Commands
- `npm run dev` - Start Vite development server (http://localhost:5173)
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- IMPORTANT: Do NOT restart the server automatically - let the user do this manually

## Code Style Guidelines
- Use ES Modules syntax (import/export)
- Indentation: 2 spaces
- Strings: Prefer single quotes
- Variable naming:
  - camelCase for variables and functions
  - PascalCase for classes
  - UPPER_SNAKE_CASE for constants
- Use arrow functions for callbacks
- Use async/await for asynchronous operations
- Error handling: Use try/catch blocks around async operations
- Document public functions with JSDoc-style comments

## Technology Stack
- Vite for build tooling
- Box2D for physics (via box2d3-wasm)
- Canvas API for rendering
- Web Audio API for sound
- Gamepad API for controller support
- monteslu's jsgamelauncher integration

## Important Restrictions
- DO NOT modify input or sound handling as they are managed by jsgamelauncher
- DO NOT modify index.html or use DOM manipulation
- ONLY use the provided canvas element for rendering
- DO NOT restart the server automatically

## Project Structure
- `src/` - JavaScript source files
  - `entities.js` - Entity definitions and management
  - `gameController.js` - Game logic controller
  - `gameRenderer.js` - Canvas rendering
  - `levels.js` - Level designs and configuration
  - `physics.js` - Box2D physics integration
  - `utils.js` - Helper functions
- `public/` - Static assets (images, sounds, Box2D WASM)

## Box2D Entity Handling
- Always use uniqueIds stored in userData.id for identifying Box2D bodies
- DO NOT use Box2D pointers or internal IDs for entity tracking
- Always access entities using the userData.id value to look up in Maps
- Entity lifecycle: 
  1. Create Box2D body
  2. Assign userData.id to body
  3. Register in tracking map using uniqueId as key
  4. Register with renderer using same uniqueId

## Physics Settings
- World settings: 10 velocity iterations, 8 position iterations
- Use 4 substeps per frame for more accurate collision
- Enable bullet mode for fast-moving objects (birds)
- Properly destroy and clean up Box2D bodies when no longer needed