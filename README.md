# Forger Starter Kit - Next.js + NextAuth

A complete full-stack starter kit that integrates Next.js with NextAuth authentication and ShadcnUI components. This project provides a solid foundation for building applications with authentication-based access control.

## 🚀 Features

### Authentication & Authorization

- **NextAuth.js** integration with Prisma adapter
- **Google OAuth** authentication
- **Role-based access control** (USER, ADMIN, BANNED)
- Session management and middleware protection
- User profile management

### Database & ORM

- **Prisma** ORM for type-safe database operations
- **PostgreSQL** database with enum support
- Automated schema migrations
- Database seeding support

### Admin Panel

- **Admin dashboard** at `/admin`
- User management and role assignment
- System statistics and analytics

### UI & Components

- **ShadcnUI** component library
- **Tailwind CSS** for styling
- Responsive design
- Dark mode support (Tailwind-based)
- Toast notifications with Sonner

### Content Access Control

- Free tier content (authenticated users)
- Role-based access control

## 📁 Project Structure

```
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/     # NextAuth API routes
│   │   └── admin/
│   │       └── update-user/        # Admin user management
│   ├── admin/                      # Admin panel (ADMIN role only)
│   ├── auth/
│   │   └── signin/                 # Sign-in page
│   ├── dashboard/                  # User dashboard
│   └── free-content/               # Free tier content
├── components/
│   ├── admin/                      # Admin dashboard components
│   ├── auth/                       # Authentication components
│   ├── providers/                  # Context providers
│   └── ui/                         # ShadcnUI components
├── lib/
│   ├── auth.ts                     # NextAuth configuration
│   └── prisma.ts                   # Prisma client configuration
├── prisma/
│   ├── schema.prisma               # Database schema with enums
│   └── seed-admin.ts               # Admin user setup
└── types/
    └── next-auth.d.ts              # NextAuth type extensions
```

## 🛠️ Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/forger_starter_kit"

# NextAuth (Generate a random secret with: openssl rand -base64 32)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-32-characters-minimum"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Admin Setup
ADMIN_EMAIL="your-admin-email@example.com"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 2. Database Setup

#### PostgreSQL Setup

1. Install PostgreSQL locally or use a cloud provider
2. Create a new database for the project
3. Update the `DATABASE_URL` in your environment variables

#### Database Schema

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:migrate

# Set up admin user (requires ADMIN_EMAIL env var)
npm run db:setup-admin
```

### 3. Authentication Setup

#### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://yourdomain.com/api/auth/callback/google`

### 4. Admin Setup

After setting up the database and environment variables:

1. **First, the user must sign in** to create their database record
2. **Then run the admin setup command**:

```bash
# Set up admin user (user must exist in database first)
npm run db:setup-admin
```

This will update an existing user with the email specified in `ADMIN_EMAIL` and assign them the ADMIN role. The user must have signed in at least once for their record to exist in the database.

### 5. Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

## 🎯 Key Features Explained

### Admin Panel

Access the admin panel at `/admin` (requires ADMIN role):

- **User Management**: View all users and their roles
- **System Statistics**: Monitor user activity

### Role-Based Access

- **USER**: Basic authenticated users
- **ADMIN**: Full system access including admin panel
- **BANNED**: Restricted access

## 🚦 Usage

### User Flow

1. **Landing Page**: Introduction and feature overview
2. **Authentication**: Sign in with Google
3. **Dashboard**: Overview of available content
4. **Free Content**: Accessible to all authenticated users

### Access Control

- **Public**: Landing page, authentication
- **Authenticated**: Dashboard, free content
- **Admin**: User management, system statistics

## 🔒 Security Features

- Server-side session validation
- Protected API routes
- Environment variable validation
- SQL injection prevention (Prisma)

## 📦 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository
2. Add environment variables in Vercel dashboard
3. Deploy with automatic builds

### Other Platforms

- **Netlify**: Configure build settings
- **Railway**: Direct deployment from GitHub
- **DigitalOcean**: App Platform deployment

## 🧪 Testing

```bash
# Run type checking
npx tsc --noEmit

# Run linting
npm run lint

# Build for production
npm run build
```

## 📚 Documentation Links

- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Prisma Documentation](https://www.prisma.io/docs)
- [ShadcnUI Documentation](https://ui.shadcn.com)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:

- Create an issue in the GitHub repository
- Check the documentation links above
- Review the environment variable requirements

---

**Note**: This is a starter template designed for developers. All credentials and API keys need to be configured before the application will work properly.

## 🐛 Troubleshooting

### JWT Session Error (Invalid Compact JWE)

If you encounter a JWT session error, it's usually due to:

1. **Missing or invalid NEXTAUTH_SECRET**: Generate a proper secret:
   ```bash
   # Generate a secure secret
   openssl rand -base64 32
   ```
2. **Cached sessions**: Clear Next.js cache and browser cookies:

   ```bash
   rm -rf .next
   # or on Windows
   Remove-Item -Recurse -Force .next
   ```

3. **Environment variables**: Ensure all required env vars are set correctly.