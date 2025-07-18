# API Architecture & Endpoints

## API Structure

### Authentication API
- `POST /api/auth/[...nextauth]` - NextAuth.js dynamic route
- Handles Google OAuth flow
- Session management and callbacks

### Stripe API Routes
- `POST /api/stripe/checkout` - Create checkout session
- `POST /api/stripe/customer-portal` - Customer portal access
- `POST /api/stripe/webhooks` - Stripe webhook handler

### Admin API Routes
- `POST /api/admin/update-user` - Update user role/tokens (admin only)

## API Patterns

### 1. Route Handlers (Next.js 13+)
```typescript
// app/api/example/route.ts
export async function GET(request: NextRequest) {
  // GET handler
}

export async function POST(request: NextRequest) {
  // POST handler
}
```

### 2. Authentication Middleware
- Session validation on protected routes
- Role-based access control
- Automatic user sync on API calls

### 3. Error Handling
- Consistent error response format
- HTTP status codes following REST conventions
- Detailed error logging for debugging

### 4. Request/Response Format
```typescript
// Standard success response
{
  success: true,
  data: any,
  message?: string
}

// Standard error response
{
  success: false,
  error: string,
  details?: any
}
```

## Webhook Architecture

### Stripe Webhooks (`/api/stripe/webhooks`)
- Signature verification for security
- Event type filtering with `relevantEvents` set
- Idempotent event processing
- Automatic retry handling

### Supported Webhook Events
- `product.created/updated/deleted`
- `price.created/updated/deleted`
- `customer.subscription.created/updated/deleted`
- `checkout.session.completed`
- `payment_intent.succeeded`

## Security Measures

### 1. Input Validation
- Request body validation
- Parameter sanitization
- Type checking with TypeScript

### 2. Authentication
- Session token validation
- Role-based route protection
- CSRF protection via NextAuth

### 3. Rate Limiting
- Implement rate limiting for public APIs
- Webhook signature verification
- Environment variable validation

## API Usage Examples

### Creating Checkout Session
```typescript
const response = await fetch('/api/stripe/checkout', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    priceId: 'price_xxx',
    userId: session.user.id,
  }),
});
```

### Admin User Update
```typescript
const response = await fetch('/api/admin/update-user', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    userId: 'user_xxx',
    role: 'PREMIUM',
    tokens: 100,
  }),
});
```

## Database Integration

### Prisma Client Usage
- Single Prisma instance across API routes
- Transaction support for complex operations
- Automatic connection pooling

### Data Synchronization
- Automatic Stripe data sync via webhooks
- Manual sync functions for data consistency
- Cache invalidation on updates