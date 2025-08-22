# Database Architecture & Schema

## Database Setup

### Technology Stack
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Schema Location**: `prisma/schema.prisma`
- **Client Output**: `app/generated/prisma` (custom location)

### Essential Commands
```bash
npm run db:generate     # Generate Prisma client
npm run db:migrate      # Run migrations
npm run db:reset        # Reset database
npm run db:sync-stripe  # Sync Stripe products
npm run db:setup-admin  # Setup admin user
```

## Core Models

### User Model
```prisma
model User {
  id               String           @id @default(cuid())
  email            String           @unique
  name             String?
  role             UserRole         @default(USER)
  stripeProductId  String?          # Links to active subscription
  membershipStatus MembershipStatus @default(ACTIVE)
  tokens           Int              @default(0)
  tokensExpiresAt  DateTime?
  // ... relationships
}
```

### Stripe Integration Models
- `StripeProduct` - Products from Stripe (single source of truth)
- `StripePrice` - Pricing information linked to products
- `StripeCustomer` - Customer records for Stripe integration
- `UserSubscription` - Active subscription tracking
- `PaymentHistory` - Payment intent tracking

### NextAuth Required Models
- `Account` - OAuth provider accounts
- `Session` - Active user sessions
- `VerificationToken` - Email verification tokens

## Enums & Types

### UserRole
```prisma
enum UserRole {
  USER      # Default role, free content access
  PREMIUM   # Active subscription, premium content access
  ADMIN     # Full system access, admin panel access
  BANNED    # No access to any content
}
```

### MembershipStatus
```prisma
enum MembershipStatus {
  ACTIVE      # Active subscription
  INACTIVE    # No subscription
  CANCELED    # Subscription cancelled
  PAST_DUE    # Payment failed
}
```

## Database Relationships

### User Relationships
- User → StripeProduct (via `stripeProductId`)
- User → UserSubscription (one-to-many)
- User → PaymentHistory (one-to-many)
- User → StripeCustomer (one-to-one)

### Stripe Relationships
- StripeProduct → StripePrice (one-to-many)
- StripeProduct → UserSubscription (one-to-many)
- UserSubscription → StripePrice (many-to-one)

## Key Database Operations

### User Management
```typescript
// Get user with subscription info
const user = await prisma.user.findUnique({
  where: { id: userId },
  include: {
    subscriptions: {
      where: { status: { in: ['active', 'trialing'] } },
      include: { stripeProduct: true }
    }
  }
});
```

### Subscription Queries
```typescript
// Check active subscription
const subscription = await prisma.userSubscription.findFirst({
  where: {
    userId,
    status: { in: ['active', 'trialing'] }
  },
  include: {
    stripeProduct: true,
    stripePrice: true
  }
});
```

### Token Management
```typescript
// Update user tokens
await prisma.user.update({
  where: { id: userId },
  data: {
    tokens: newTokenCount,
    tokensExpiresAt: expirationDate
  }
});
```

## Data Synchronization

### Stripe Sync Process
1. Webhook receives Stripe event
2. Relevant data extracted from event
3. Database updated via upsert operations
4. User roles/tokens updated accordingly

### Auto-Sync Features
- Product sync every 5 minutes (cached)
- Subscription status sync on user access
- Payment history tracking via webhooks

## Database Migrations

### Migration Strategy
- Schema changes via Prisma migrations
- Rollback support for failed migrations
- Environment-specific migration runs

### Migration Files
- Located in `prisma/migrations/`
- Automatic migration generation
- SQL migration files for review

## Performance Considerations

### Indexing
- Unique indexes on email, Stripe IDs
- Composite indexes for common queries
- Foreign key constraints for data integrity

### Query Optimization
- Include statements for related data
- Limit/offset for pagination
- Connection pooling for concurrent requests

## Data Integrity

### Constraints
- Unique constraints on critical fields
- Foreign key relationships
- Cascade deletes for cleanup

### Validation
- Prisma schema validation
- Application-level validation
- Database-level constraints

## Backup & Recovery

### Backup Strategy
- Regular database backups
- Point-in-time recovery
- Environment-specific backup schedules

### Data Recovery
- Migration rollback procedures
- Data restoration from backups
- Disaster recovery planning

## Blog Posts System

### BlogPost Model
```prisma
model BlogPost {
  id             String   @id @default(cuid())
  userId         String   @map("user_id")
  title          String
  content        String   @db.Text
  originalText   String   @map("original_text") @db.Text
  imageUrl       String?  @map("image_url")
  imagePrompt    String?  @map("image_prompt") @db.Text
  tokensUsed     Int      @map("tokens_used") @default(1)
  characterCount Int      @map("character_count")
  slug           String?  @unique
  isPublished    Boolean  @default(false) @map("is_published")
  publishedAt    DateTime? @map("published_at")
  createdAt      DateTime @default(now()) @map("created_at")
  updatedAt      DateTime @updatedAt @map("updated_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

### Blog Features
- AI-powered blog post generation from text input
- Token-based usage tracking (1 token per 15,000 characters)
- AI-generated featured images using DALL-E 3
- Full CRUD operations for managing posts
- Publication status management
- SEO-optimized content generation

## Environment Configuration

### Database URLs
```env
# Development
DATABASE_URL="postgresql://user:password@localhost:5432/dev_db"

# Production
DATABASE_URL="postgresql://user:password@host:5432/prod_db"
```

### Connection Settings
- Connection pooling configuration
- SSL settings for production
- Timeout and retry settings