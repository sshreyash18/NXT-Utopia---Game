# Adapto - Sci-Fi Narrative Game

## Overview

Adapto is a sci-fi narrative adventure game built as a full-stack web application. The game features an AI consciousness awakening in a futuristic network environment, where players make choices that influence the story progression. The application combines interactive storytelling with immersive audio-visual elements and persistent game state management.

## System Architecture

The application follows a **monorepo structure** with clear separation between client and server components:

- **Frontend**: React-based single-page application with TypeScript
- **Backend**: Express.js REST API server with TypeScript
- **Database**: PostgreSQL with Drizzle ORM for data persistence
- **Build System**: Vite for frontend bundling and ESBuild for server compilation
- **Deployment**: Replit-optimized with autoscale deployment target

## Key Components

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React hooks with TanStack Query for server state
- **UI Components**: Radix UI primitives with shadcn/ui component system
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Audio**: Custom audio system for background music and sound effects

### Backend Architecture
- **Server**: Express.js with TypeScript
- **API Design**: RESTful endpoints for game state and dialogue management
- **Database Access**: Drizzle ORM with schema-first approach
- **Validation**: Zod schemas for request/response validation
- **Session Management**: Express sessions with PostgreSQL storage

### Database Schema
```typescript
- users: User authentication and identification
- gameStates: Player progress and current scene tracking
- dialogueChoices: Story choices and narrative branching logic
```

### UI/UX Design
- **Theme**: Dark cyberpunk aesthetic with neon accents
- **Typography**: Multiple font families (Inter, Orbitron, JetBrains Mono)
- **Responsive**: Mobile-first design with adaptive layouts
- **Accessibility**: Proper ARIA labels and keyboard navigation

## Data Flow

1. **Game Initialization**: Client requests game state from server
2. **Scene Rendering**: Frontend displays current scene with background, dialogue, and choices
3. **Player Interaction**: User selections trigger API calls to update game state
4. **State Persistence**: Server updates database and returns new game state
5. **Scene Transition**: Client renders new scene based on updated state

## External Dependencies

### Core Runtime
- **Node.js 20**: JavaScript runtime environment
- **PostgreSQL 16**: Primary database system

### Frontend Libraries
- **React Ecosystem**: React, React DOM, React Query
- **UI Framework**: Radix UI components, shadcn/ui
- **Styling**: Tailwind CSS, class-variance-authority
- **Utilities**: date-fns, clsx, embla-carousel

### Backend Libraries
- **Server Framework**: Express.js with middleware
- **Database**: Drizzle ORM, Neon Database serverless
- **Validation**: Zod for schema validation
- **Session**: connect-pg-simple for PostgreSQL sessions

### Development Tools
- **Build Tools**: Vite, ESBuild, TypeScript
- **Code Quality**: TSX for development server
- **Replit Integration**: Cartographer plugin, runtime error overlay

## Deployment Strategy

### Development Environment
- **Command**: `npm run dev` starts development server with hot reload
- **Port**: Application runs on port 5000 with external port 80
- **Database**: PostgreSQL automatically provisioned in Replit environment

### Production Build
- **Frontend**: Vite builds optimized client bundle to `dist/public`
- **Backend**: ESBuild compiles server to `dist/index.js`
- **Deployment**: Replit autoscale with automatic scaling based on traffic

### Environment Configuration
- **Database URL**: Required environment variable for PostgreSQL connection
- **Node Environment**: Automatic detection of development vs production
- **Asset Handling**: Static assets served from build directory

## Changelog

```
Changelog:
- June 18, 2025. Initial setup
- June 18, 2025. Implemented complete multi-agent AI system with real tool execution
- June 18, 2025. Added UtopiaNXT world introduction scene with narrative context
- June 18, 2025. Fixed game progression and removed debug UI elements
- June 18, 2025. Integrated Azure OpenAI for behavioral analysis and glitch effects
- June 19, 2025. Fixed crash issues and implemented terminal-style agent chat interface
- June 19, 2025. Reduced dialogue text size for better readability
- June 19, 2025. Added custom terminal/hacker aesthetic image for puzzle scenes
- June 19, 2025. Implemented Neural Awakening scene with three branching paths
- June 19, 2025. Added "Outside View" scene with cityscape image and suspense music
- June 19, 2025. Created "Close Eyes" scene with static sound and Cipher warnings
- June 19, 2025. Built "Break Silence" scene with Adapto interrogation dialogue
- June 19, 2025. Updated Trust Assessment to philosophical AI dependence questions
- June 19, 2025. Added conditional Cipher responses based on Trust Assessment choices
- June 19, 2025. Integrated typing sound effects for Neural Chat agent conversations
- June 19, 2025. Fixed Trust Assessment routing to always go to leak scene
- June 19, 2025. Added custom "dead zone" text for leak scene with automatic Cipher warning
- June 19, 2025. Improved typing sound with background music volume ducking
- June 19, 2025. Created Glitch Path puzzle system with three progressive challenges
- June 19, 2025. Added detection/game over screen for wrong puzzle answers
- June 25, 2025. Enhanced Core Access Protocol with sophisticated philosophical answer validation
- June 25, 2025. Redesigned Echo Node with manual timestamp entry and 8 AI agent conversations
- June 25, 2025. Added game progress tracking with disabled buttons and green checkmarks
- June 25, 2025. Implemented auto-navigation to Core after completing both investigation paths
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```