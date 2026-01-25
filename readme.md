Scania Coder

Badges
[![Monorepo: Turborepo](https://img.shields.io/badge/Monorepo-Turborepo-000000?logo=turbo)](https://turbo.build/repo)

Overview
Scania Coder is a full-stack monorepo containing the app frontend, backend, and shared types. The backend is a TypeScript/Express API with TypeORM and PostgreSQL, and the frontend is a React/Vite SPA. The system integrates AWS SES for email delivery and S3 for image storage, and is designed to run locally via Docker.

Live production
- https://bart-trans.devmw.pl

Features
- JWT-based authentication and authorization.
- User invitation system with email notifications.
- XML file upload and processing.
- AWS SES integration for transactional email delivery (via SMTP).
- File uploads with multer (S3 integration planned).
- Dockerized local development and deployments.
- Shared TypeScript types across frontend and backend.
- Internationalization via i18next.
- UI built with Ant Design and styled-components.
- Structured logging with Winston.
- Input validation with class-validator and express-validator.
- Planned: Swagger/OpenAPI docs for the backend.
- Planned: S3-backed image storage.
- Planned: Automated tests for backend and frontend.

Architecture
- apps/backend: Express + TypeScript + TypeORM + PostgreSQL API, JWT auth, validation, file uploads, structured logging.
- apps/frontend: React + Vite SPA, React Router, data fetching with react-query/axios, responsive UI.
- packages/types: shared TypeScript types for API contracts and domain models.

Project Structure
```
scania-coder/
├── apps/
│   ├── backend/          # Express API server
│   │   ├── src/
│   │   │   ├── controllers/  # Request handlers
│   │   │   ├── services/     # Business logic
│   │   │   ├── routes/       # API routes
│   │   │   ├── middlewares/ # Auth, validation, etc.
│   │   │   ├── entity/       # TypeORM entities
│   │   │   └── ...
│   │   └── .env.example
│   └── frontend/         # React SPA
│       ├── src/
│       │   ├── components/   # React components
│       │   ├── views/        # Page views
│       │   ├── hooks/        # Custom React hooks
│       │   ├── api/          # API client
│       │   └── ...
│       └── .env.example
└── packages/
    └── types/            # Shared TypeScript types
        └── src/
            └── types/    # Type definitions
```

Version Info
- Repo version: 1.0.0
- Package manager: npm 10.2.4
- Monorepo tooling: Turborepo 2.1.3

Local Development
Prerequisites
- Node.js and npm installed.
- Docker installed for local services.

Install
- npm install

Docker Services
Start the PostgreSQL database:
- docker-compose up -d

The database will be available at:
- Host: localhost
- Port: 5431
- Database: scania_db
- User: user
- Password: password

Run
- npm run dev (runs all dev servers via Turborepo)
- npm run build
- npm run lint
- npm run lint:fix

App-Specific Commands
- Backend: cd apps/backend && npm run dev (runs on port 3000 by default)
- Backend: cd apps/backend && npm run seed (populates database with initial data)
- Backend: cd apps/backend && npm run clear-db (clears all database data)
- Frontend: cd apps/frontend && npm run dev (runs on port 5173 by default)

Ports
- Backend API: 3000 (configurable via PORT env var)
- Frontend Dev Server: 5173 (Vite default)
- PostgreSQL: 5431

Environment Variables
Backend (apps/backend/.env)
Required environment variables (see apps/backend/.env.example):
- NODE_ENV: Environment mode (development/production)
- PORT: Server port (default: 3000)
- LOGGER_LEVEL: Logging level
- DB_HOST: Database host (default: localhost)
- DB_PORT: Database port (default: 5432, Docker uses 5431)
- DB_USERNAME: Database username
- DB_PASSWORD: Database password
- DB_NAME: Database name
- JWT_SECRET: Secret key for JWT token signing
- SMTP_HOST: SMTP server host
- SMTP_PORT: SMTP server port
- SMTP_SECURE: Use TLS/SSL (true/false)
- SMTP_USER: SMTP username
- SMTP_PASS: SMTP password
- SMTP_FROM: Email sender address
- FRONTEND_URL: Frontend application URL
- APP_NAME: Application name
- SUPPORT_EMAIL: Support email address
- INVITE_EXPIRES_DAYS: Invitation expiration in days

Frontend (apps/frontend/.env)
Optional environment variables (see apps/frontend/.env.example):
- VITE_APP_NAME: Application name

Setup Steps
1. Copy environment files:
   - cp apps/backend/.env.example apps/backend/.env
   - cp apps/frontend/.env.example apps/frontend/.env
2. Update .env files with your configuration
3. Start Docker services: docker-compose up -d
4. Seed the database: cd apps/backend && npm run seed
   - This creates test users (see apps/backend/src/db-data.ts for credentials)
5. Start development servers: npm run dev

Database Seed Data
The seed command creates initial test users:
- Regular user: test@devmw.pl / DevMW123
- Admin user: admin@devmw.pl / DevMW123

Note: These are development credentials. Change them for production use.

Business Logic

The application implements several core business domains:

Authentication & Authorization
- **Login**: Email/password authentication with bcrypt password hashing. Validates user credentials, checks if user is active, and generates JWT tokens with user ID, email, admin status, and token version.
- **Password Management**: 
  - Password reset via email token (24-hour expiration)
  - Password change for authenticated users
  - Password setup for invited users
- **JWT Tokens**: Include token version for revocation support. When a user is deactivated, token version is incremented to invalidate all existing tokens.
- **Role-Based Access Control**: Two roles - USER and ADMIN. Admin-only routes are protected by middleware.

User Management
- **User Invitations**: 
  - Admins can create new users via invitation system
  - Invitation tokens are generated with configurable expiration (default: 7 days)
  - Invitation emails are sent automatically with setup links
  - Users must set password before account activation
  - Invitations can be resent or cancelled
- **User Lifecycle**:
  - Users start in "invited" state (isInvited: true, isActive: false)
  - After password setup, users become active (isInvited: false, isActive: true)
  - Users can be deactivated by admins or themselves
  - Safety check: Cannot deactivate the last active admin
  - Deactivated users cannot log in
- **User Operations**:
  - Paginated user listing with filtering (username, email, role) and sorting
  - User creation with automatic invitation
  - User updates (username, email, role, password)
  - User deletion (only inactive users can be deleted)
  - Users cannot delete their own accounts

XML File Processing
The system processes Scania SOPS (Scania Operations) XML files with the following structure:
- **Version Block**: Contains MajorVersion, MinorVersion, and Date
- **FPC Block**: Contains FPC records with Name/Value pairs
- **CableList Block**: Contains CableList records with Name attributes

**XML Operations**:
- **Upload & Metadata Extraction**: 
  - Validates XML structure
  - Extracts version information (blockVersion, majorVersion, minorVersion, date)
  - Returns metadata for display
- **XML Editing**:
  - Supports updating FPC and CableList blocks
  - Can add, update, or remove records
  - Maintains alphabetical ordering for FPC records
  - Updates MajorVersion on edit
  - Validates version numbers (must be positive integers)
  - Returns list of updated fields and any errors

Layout Management
- **Saved Layouts**: Users can save XML editing configurations as reusable layouts
- **Layout Operations**:
  - Create layouts with name and update payloads
  - Retrieve layouts by ID or list all user's layouts
  - Delete layouts
  - Layouts are user-scoped (users can only access their own layouts)
- **Layout Data**: Stored as JSONB in PostgreSQL, containing array of UpdatePayload objects

Email Services
- **Invitation Emails**: Sent when users are created or invitations are resent
- **Password Reset Emails**: Sent when users request password reminders
- **Email Configuration**: Uses SMTP (can be configured for AWS SES)
- **Email Templates**: HTML email templates with frontend URL links

Data Models
- **User Entity**: 
  - Authentication fields (email, password, passwordSalt)
  - Invitation fields (invitationToken, invitationExpires, isInvited)
  - Status fields (isActive, role, tokenVersion)
  - Audit fields (createdAt, updatedAt)
- **Layout Entity**:
  - Name, authorId, updates (JSONB array)
  - Timestamps for creation and updates

Security Features
- Password hashing with bcrypt and random salts
- JWT token versioning for token revocation
- Role-based access control (USER/ADMIN)
- User activation/deactivation controls
- Protection against deleting last admin
- Self-service account deactivation
- Invitation token expiration
- Password reset token expiration (24 hours)

API Endpoints
The backend provides the following main API routes:
- POST /api/login - User authentication
- POST /api/remind-password - Password reminder
- PATCH /api/change-password - Change password (authenticated)
- POST /api/invitations - Create user invitation (authenticated, admin)
- GET /api/me - Get current user info (authenticated)
- POST /api/upload-xml - Upload XML file (authenticated)
- POST /api/edit-xml - Edit XML file (authenticated)
- GET /api/xml-files - List XML files (authenticated)
- GET /api/xml-layouts - List XML layouts (authenticated)
- User management routes (authenticated, admin)

All authenticated routes require a Bearer token in the Authorization header.

Testing
- Backend: planned test suite.
- Frontend: planned test suite.

Troubleshooting
Common Issues
- Database connection errors: Ensure Docker services are running (`docker-compose up -d`) and DB_PORT matches docker-compose.yml (5431).
- Port already in use: Change PORT in backend .env or stop the conflicting service.
- Environment variables not loading: Ensure .env files exist in apps/backend and apps/frontend directories.
- CORS errors: Backend is configured to allow all origins in development. Check CORS settings for production.

Notes
- Replace the mock documentation link with the real URL when available.
