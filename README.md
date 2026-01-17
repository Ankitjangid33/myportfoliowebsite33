# Web Developer Portfolio

A modern, full-stack portfolio website built with Next.js, TypeScript, MongoDB, and Tailwind CSS.

## Features

- 🎨 Modern, responsive design with gradient themes
- 🔐 Secure admin panel with authentication
- 📊 MongoDB database integration
- ✏️ Full CRUD operations for projects
- 🚀 Built with Next.js 15 and React 19
- 💅 Styled with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB installed and running locally (or MongoDB Atlas account)

### Installation

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables:
   Edit `.env.local` and update:

```
MONGODB_URI=mongodb://localhost:27017/portfolio
NEXTAUTH_SECRET=your-secret-key-change-this-in-production
NEXTAUTH_URL=http://localhost:3000
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
```

3. Start MongoDB (if running locally):

```bash
mongod
```

4. Create admin user (choose one method):

**Method 1: Using setup script**

```bash
npm run setup
```

**Method 2: Using API endpoint**

```bash
# Start dev server first: npm run dev
# Then in another terminal:
curl -X POST http://localhost:3000/api/setup
```

5. Run the development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## Admin Panel

Access the admin panel at `/admin/login`

Default credentials (change in `.env.local`):

- Email: admin@example.com
- Password: admin123

### Admin Features

- View all projects
- Add new projects
- Edit existing projects
- Delete projects
- Mark projects as featured
- Real-time stats dashboard

## Project Structure

```
├── app/
│   ├── admin/          # Admin panel pages
│   ├── api/            # API routes
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Homepage
├── lib/
│   └── mongodb.ts      # Database connection
├── models/             # MongoDB schemas
│   ├── Project.ts
│   └── User.ts
├── types/              # TypeScript types
└── .env.local          # Environment variables
```

## API Endpoints

- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create project (auth required)
- `PUT /api/projects/[id]` - Update project (auth required)
- `DELETE /api/projects/[id]` - Delete project (auth required)
- `POST /api/setup` - Create admin user (one-time)

## Customization

1. Update personal information in `app/page.tsx`
2. Change colors in `app/globals.css` and Tailwind classes
3. Add your projects through the admin panel
4. Customize sections as needed

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### MongoDB Atlas

1. Create cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Get connection string
3. Update `MONGODB_URI` in environment variables

## Technologies

- Next.js 15
- React 19
- TypeScript
- MongoDB + Mongoose
- NextAuth.js
- Tailwind CSS
- bcryptjs

## License

MIT
