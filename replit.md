# SmartChama - Digital Savings Group Management Platform

## Overview

SmartChama is a full-stack web application designed to digitize and streamline the management of savings groups (chamas) in Kenya. The platform provides comprehensive tools for managing members, tracking contributions, scheduling payouts, managing penalties, and generating reports.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Library**: Radix UI components with shadcn/ui component system
- **Styling**: Tailwind CSS with custom design tokens and CSS variables
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation integration

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API Pattern**: RESTful API with JSON responses
- **Session Management**: PostgreSQL-based session storage using connect-pg-simple

### Authentication & Authorization
- **Authentication**: Custom email/password authentication
- **Session Storage**: Server-side sessions stored in PostgreSQL
- **Role-based Access**: User and Admin roles with different permissions
- **Client-side Auth**: Auth state managed via custom auth manager with localStorage persistence

## Key Components

### Database Schema
- **Users**: Core user information with roles (user/admin)
- **Chamas**: Savings group entities with contribution amounts and schedules
- **Members**: Junction table linking users to chamas
- **Contributions**: Financial transactions and payment tracking
- **Payouts**: Scheduled and completed disbursements
- **Penalties**: Infractions and associated fees
- **Notifications**: User-specific messaging system

### Core Features
1. **Member Management**: Add, edit, and manage chama members
2. **Contribution Tracking**: Real-time savings tracking with status monitoring
3. **Payout Scheduling**: Automated payout management and distribution
4. **Penalty System**: Fine management and enforcement
5. **Reporting & Analytics**: Financial insights and trend analysis
6. **Notifications**: Real-time updates and alerts

### UI Components
- **Layout System**: Responsive design with sidebar navigation and public/private layouts
- **Component Library**: Comprehensive set of reusable UI components (buttons, forms, tables, dialogs)
- **Data Tables**: Sortable, searchable tables for all data entities
- **Dashboard**: Summary cards with key metrics and statistics
- **Forms**: Validated forms with error handling and loading states

## Data Flow

1. **Authentication Flow**: User login → Server validation → Session creation → Client auth state update
2. **Data Fetching**: React Query manages API calls → Server processes requests → Database operations via Drizzle → JSON responses
3. **Form Submissions**: Client validation → API requests → Server processing → Database updates → UI updates
4. **Real-time Updates**: Optimistic updates with React Query cache invalidation

## External Dependencies

### Frontend Dependencies
- **UI Components**: Radix UI primitives for accessible components
- **State Management**: TanStack Query for server state
- **Form Handling**: React Hook Form with Hookform Resolvers
- **Validation**: Zod for schema validation
- **Styling**: Tailwind CSS with class-variance-authority for component variants
- **Icons**: Lucide React for consistent iconography
- **Date Handling**: date-fns for date manipulation

### Backend Dependencies
- **Database**: Neon Database serverless PostgreSQL
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Session Management**: connect-pg-simple for PostgreSQL session store
- **Validation**: Drizzle-zod for schema-to-validation integration

### Development Tools
- **Build System**: Vite with React plugin
- **Type Checking**: TypeScript with strict configuration
- **Code Quality**: ESBuild for production builds
- **Development**: tsx for TypeScript execution

## Deployment Strategy

### Build Process
1. **Frontend Build**: Vite builds the React application to `dist/public`
2. **Backend Build**: ESBuild bundles the Express server to `dist/index.js`
3. **Database**: Drizzle migrations stored in `migrations/` directory

### Environment Configuration
- **Database**: Configured via `DATABASE_URL` environment variable
- **Development**: Uses NODE_ENV=development for dev-specific features
- **Production**: NODE_ENV=production for optimized builds

### File Structure
- **Client**: React application in `client/` directory
- **Server**: Express backend in `server/` directory  
- **Shared**: Common schemas and types in `shared/` directory
- **Configuration**: Root-level config files for build tools and dependencies

### Development Workflow
- **Dev Server**: Vite dev server with HMR for frontend development
- **API Server**: Express server with auto-reload via tsx
- **Database**: Drizzle Kit for schema management and migrations
- **Type Safety**: Shared TypeScript types between frontend and backend

The application follows a modern full-stack architecture with strong type safety, responsive design, and comprehensive data management capabilities specifically tailored for Kenyan savings group management.