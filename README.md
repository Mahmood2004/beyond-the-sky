# Beyond the Sky 🚀

**Beyond the Sky** is a modern web application for astronomy and space research, featuring an interactive platform with role-based access control. The application includes dedicated dashboards for admins and a public-facing interface for visitors, powered by a robust permissions system.

Built with Next.js App Router, the platform offers smooth animations, a fully responsive interface, and dynamic content management.

---

## ✨ Features

- **Permissions-Based Access Control**: Users have granular permissions (`project.create`, `blog.update`, `user.viewAll`, etc.) controlling what they can access in the admin dashboard.
- **Admin & Visitor Dashboards**: Admins can manage projects, blogs, services, news, and users, while normal visitors can explore content and submit inquiries.
- **Rich Text Editing**: Admins can create and edit blogs and news using Tiptap editor.
- **Modern UI/UX**: Components styled with Tailwind CSS, interactive with Framer Motion animations, and built with Radix UI for accessibility.
- **Database Architecture**: PostgreSQL database managed with Prisma ORM.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: JWT & bcryptjs
- **Rich Text Editor**: [Tiptap](https://tiptap.dev/)

---

## 🚀 Getting Started

Follow these steps to set up and run the project locally.

### 📋 Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm** (comes with Node.js)
- **PostgreSQL** database running locally or remotely

### ⚙️ Installation & Setup

**1. Clone the repository and navigate into the project directory:**

```bash
git clone <repository-url>
cd beyond-the-sky
```

**2. Install dependencies:**

```bash
npm install
```

**3. Environment Variables:**

Copy the example `.env` file and configure your database connection and JWT secret:

```bash
cp .env.example .env
```

Then edit `.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
JWT_SECRET="your_jwt_secret_here"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

**4. Generate Prisma Client:**

```bash
npx prisma generate
```

**5. Push Schema to Database** (optional if DB is empty):

```bash
npx prisma db push
```

**6. Seed the Database:**

This will create an initial admin (superadmin) user, a normal visitor, and sample content for services, projects, blogs, news, and submissions.

```bash
npm run seed
```

**7. Run the Development Server:**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Available Scripts

- `npm run dev` – Start the Next.js development server.
- `npm run build` – Build the project for production deployment.
- `npm start` – Start the production server.
- `npm run lint` – Run ESLint to check for code issues.
- `npm run seed` – Run the Prisma seed script to populate the database with initial data.

---

## 👥 User Roles & Permissions

- **Admins**: Have granular permissions that determine what they can view and manage in the dashboard (`project.create`, `blog.update`, `user.viewAll`, etc.).
- **Visitors**: No special permissions; can browse the website content and submit inquiries.

*All permissions are stored in the database and checked in real time for UI visibility and API access.*
