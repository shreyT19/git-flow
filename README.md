# Git Automation Platform

A modern web application for automating Git workflows and repository management.

## 🚀 Tech Stack

### Frontend

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **UI Components**:
  - Radix UI (Headless components)
  - Tailwind CSS for styling
  - Shadcn/ui components
- **State Management**:
  - React Query (TanStack Query)
  - React Hook Form
- **Authentication**: Clerk
- **Markdown Editor**: MDEditor
- **Charts**: Recharts

### Backend

- **API Layer**: tRPC
- **Database**: Prisma ORM
- **External Services**:
  - GitHub API (via Octokit)
  - Google AI SDK
  - AssemblyAI
  - Appwrite
  - Stripe

### Development Tools

- **Package Manager**: pnpm
- **Linting**: ESLint
- **Formatting**: Prettier
- **Type Checking**: TypeScript
- **Database Management**: Prisma Studio

## 📁 Project Structure

```
git-automation/
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # Reusable UI components
│   ├── libs/            # Shared libraries and utilities
│   ├── utils/           # Helper functions
│   ├── types/           # TypeScript type definitions
│   ├── providers/       # React context providers
│   ├── actions/         # Server actions
│   ├── services/        # External service integrations
│   ├── constants/       # Application constants
│   ├── hooks/           # Custom React hooks
│   ├── trpc/            # tRPC router definitions
│   ├── server/          # Server-side utilities
│   └── styles/          # Global styles
├── prisma/              # Database schema and migrations
├── public/              # Static assets
└── .env                 # Environment variables
```

## 🏗️ System Design

### Architecture

- **Frontend**: Next.js App Router with React Server Components
- **API Layer**: tRPC for type-safe API calls
- **Database**: Prisma ORM with PostgreSQL
- **Authentication**: Clerk for user management
- **External Integrations**: Various APIs for AI, payments, and storage

### Key Features

1. **Git Automation**: Automated repository management
2. **AI Integration**: Google AI and AssemblyAI for intelligent features
3. **Payment Processing**: Stripe integration for premium features
4. **File Storage**: Appwrite for file management
5. **Real-time Updates**: WebSocket support for live updates

### Security

- Environment variable management with @t3-oss/env-nextjs
- Type-safe API calls with tRPC
- Secure authentication with Clerk
- Protected API routes

## 🛠️ Development

### Prerequisites

- Node.js
- pnpm
- PostgreSQL
- Environment variables (see .env.example)

### Getting Started

1. Clone the repository
2. Install dependencies: `pnpm install`
3. Set up environment variables
4. Start the database: `./start-database.sh`
5. Run migrations: `pnpm db:push`
6. Start development server: `pnpm dev`

### Available Scripts

- `pnpm dev`: Start development server
- `pnpm build`: Build for production
- `pnpm start`: Start production server
- `pnpm lint`: Run ESLint
- `pnpm format:write`: Format code with Prettier
- `pnpm db:studio`: Open Prisma Studio
- `pnpm db:generate`: Generate Prisma client
- `pnpm db:push`: Push database changes

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## Planned Improvements

### Frontend Enhancements
- [ ] Implement React Query for optimized data fetching and caching
- [ ] Add smooth transitions and micro-interactions for better UX
- [ ] Replace AI chat modal with a sliding side panel with form validations
- [ ] Enhance meetings card with improved progress bar animations
- [ ] Redesign dashboard with more insightful metrics and visualizations
- [ ] Convert Q/A and meeting pages to use a comprehensive datatable component

### Backend & Data Management
- [ ] Implement complete project detail view with data fetched by ID
- [ ] Create cascade delete functionality for meetings (remove associated transcripts and Appwrite files)
- [ ] Optimize API response times for larger datasets

### Testing & Quality Assurance
- [ ] Set up Cypress for end-to-end testing
- [ ] Implement React Testing Library for component unit tests
- [ ] Add performance monitoring and error tracking

## Configuration & User Experience

### User Customization
- [ ] Allow users to configure their own LLM API keys
- [ ] Add project-specific settings for Git integration behavior
- [ ] Implement user preferences for UI themes and layout options

### Onboarding & Documentation
- [ ] Create interactive guided tour for new users
- [ ] Develop contextual help tooltips throughout the application
- [ ] Add comprehensive documentation with usage examples
