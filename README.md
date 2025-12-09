# Blog Tuan

A modern, full-stack blog application built with Next.js 16, featuring user authentication, blog post creation, and a beautiful responsive UI.

## 🚀 Features

- **Public Blog Feed**: Browse all blog posts on the homepage with a responsive grid layout
- **User Authentication**: Secure authentication powered by Kinde Auth (sign up, sign in, sign out)
- **Protected Dashboard**: Authenticated users can view and manage their own blog posts
- **Create Posts**: Easy-to-use form for creating new blog posts with title, content, and image URL
- **Individual Post Pages**: Detailed view for each blog post with author information
- **Responsive Design**: Mobile-first design that works seamlessly across all devices
- **Loading States**: Smooth loading skeletons for better UX
- **Server-Side Rendering**: Fast page loads with Next.js App Router and server components

## 🛠️ Tech Stack

- **Framework**: [Next.js 16.0.7](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI primitives
- **Database**: PostgreSQL with [Prisma ORM](https://www.prisma.io/)
- **Authentication**: [Kinde Auth](https://kinde.com/)
- **React**: React 19.2.0 with React Compiler enabled
- **Icons**: Lucide React

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js 18+
- pnpm (or npm/yarn)
- PostgreSQL database
- Kinde Auth account (for authentication)

## 🔧 Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd learn-nextjs
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
   KINDE_SITE_URL="http://localhost:3000"
   KINDE_POST_LOGOUT_REDIRECT_URL="http://localhost:3000"
   KINDE_POST_LOGIN_REDIRECT_URL="http://localhost:3000"
   KINDE_CLIENT_ID="your_kinde_client_id"
   KINDE_CLIENT_SECRET="your_kinde_client_secret"
   KINDE_ISSUER_URL="https://your_kinde_domain.kinde.com"
   ```

4. **Set up the database**

   ```bash
   # Generate Prisma Client
   pnpm prisma generate

   # Run migrations (if you have migrations)
   pnpm prisma migrate dev
   ```

5. **Run the development server**

   ```bash
   pnpm dev
   ```

6. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
learn-nextjs/
├── app/                      # Next.js App Router pages
│   ├── actions.ts           # Server actions for form submissions
│   ├── api/                 # API routes
│   │   └── auth/           # Kinde Auth API routes
│   ├── dashboard/          # Protected dashboard pages
│   │   ├── create/        # Create blog post page
│   │   ├── page.tsx       # User's blog posts dashboard
│   │   └── loading.tsx    # Loading state
│   ├── post/              # Blog post pages
│   │   └── [id]/         # Dynamic post detail page
│   ├── utils/            # Utility functions
│   │   └── db.ts        # Prisma client configuration
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Homepage (blog feed)
├── components/            # React components
│   ├── general/         # General components
│   │   ├── AuthProvider.tsx
│   │   ├── BlogPostCard.tsx
│   │   ├── Navbar.tsx
│   │   └── Submitbutton.tsx
│   └── ui/             # Reusable UI components
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── skeleton.tsx
│       └── textarea.tsx
├── lib/                # Library code
│   └── generated/     # Generated Prisma client
├── prisma/            # Prisma schema and config
│   └── schema.prisma  # Database schema
├── public/           # Static assets
└── middleware.ts     # Next.js middleware for auth
```

## 🗄️ Database Schema

The application uses a single `BlogPost` model:

```prisma
model BlogPost {
  id          String   @id @default(uuid())
  title       String
  content     String
  imageUrl    String
  authorId    String
  authorName  String
  authorImage String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## 🔐 Authentication

This project uses [Kinde Auth](https://kinde.com/) for authentication. The middleware protects all routes except the homepage (`/`). Users must be authenticated to:

- Access the dashboard (`/dashboard`)
- Create new blog posts (`/dashboard/create`)

## 🎨 Key Features Explained

### Server Actions

Form submissions are handled using Next.js Server Actions (`app/actions.ts`), which run on the server and provide type-safe form handling.

### Server Components

Most pages use React Server Components for optimal performance, fetching data directly on the server.

### Image Optimization

Next.js Image component is used throughout for automatic image optimization and lazy loading.

### Loading States

The homepage includes Suspense boundaries with skeleton loaders for a smooth loading experience.

## 📝 Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm postinstall` - Generate Prisma Client (runs automatically after install)

## 🚢 Deployment

### Environment Variables

Make sure to set all required environment variables in your deployment platform:

- `DATABASE_URL` - PostgreSQL connection string
- `KINDE_SITE_URL` - Your production URL
- `KINDE_POST_LOGOUT_REDIRECT_URL` - Post-logout redirect URL
- `KINDE_POST_LOGIN_REDIRECT_URL` - Post-login redirect URL
- `KINDE_CLIENT_ID` - Your Kinde client ID
- `KINDE_CLIENT_SECRET` - Your Kinde client secret
- `KINDE_ISSUER_URL` - Your Kinde issuer URL

### Recommended Platforms

- **Vercel**: Optimized for Next.js deployments
- **Railway**: Great for PostgreSQL + Next.js
- **Render**: Simple deployment with PostgreSQL support

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Authentication by [Kinde](https://kinde.com/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Icons from [Lucide](https://lucide.dev/)
