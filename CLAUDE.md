# The AI Forger Starter Kit - AI Assistant Guide

## Project Overview
Next.js 15 + NextAuth + Prisma + ShadcnUI starter kit for authentication-based applications.

## Detailed Documentation
For comprehensive understanding of each system component, refer to the specialized documentation in `/for_llms/`:

- **`design-patterns.md`** - Architecture patterns, code organization, and performance strategies
- **`api.md`** - API routes, webhooks, security, and request/response patterns
- **`authentication.md`** - NextAuth.js setup, session management, and access control
- **`database.md`** - Prisma schema, relationships, and data operations
- **`admin.md`** - Admin panel functionality and user management

## Essential Commands
```bash
# Development
npm run dev                 # Start dev server with turbopack
npm run build              # Production build
npm run lint               # ESLint checking

# Database
npm run db:migrate         # Run Prisma migrations
npm run db:generate        # Generate Prisma client
npm run db:setup-admin     # Set up admin user (requires ADMIN_EMAIL env)
npm run db:reset           # Reset database
```

## Development Guidelines for AI Assistants

### Code Quality Standards
- **NO COMMENTS**: Do not add code comments unless explicitly requested
- **Modular Code**: Keep functions small and focused on single responsibilities
- **Type Safety**: Use TypeScript strictly, avoid `any` types
- **Error Handling**: Implement proper try-catch blocks and error responses
- **Security**: Validate all inputs, verify permissions, use environment variables

### Package Management
- **Updated Packages**: Always use latest stable versions when adding dependencies
- **Dependency Audit**: Check for security vulnerabilities regularly
- **Minimal Dependencies**: Only add necessary packages, prefer built-in solutions

### Testing & Validation
- **Build Verification**: Run `npm run build` after major changes to ensure no build errors
- **Type Checking**: Verify TypeScript compilation passes
- **Lint Compliance**: Ensure `npm run lint` passes without errors
- **Database Integrity**: Test database operations in development environment

### File Update Requirements
When modifying features, **ALWAYS UPDATE** the corresponding documentation in `/for_llms/`:
- Authentication changes → Update `authentication.md`
- Payment/Stripe changes → Update `payments.md`
- Database schema changes → Update `database.md`
- API route changes → Update `api.md`
- Admin panel changes → Update `admin.md`
- Architecture changes → Update `design-patterns.md`

### Environment Setup
```env
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="32-char-secret"
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
ADMIN_EMAIL="admin@example.com"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## Critical System Notes
- **Admin Setup**: Run `db:setup-admin` AFTER user signs in (creates DB record first)
- **Database Location**: Prisma client outputs to `app/generated/prisma` (custom location)
- **User Roles**: Support for USER, ADMIN, and BANNED roles