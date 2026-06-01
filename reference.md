# A. Prakash & Co. - Developer Reference Guide

This document serves as an onboarding guide and architectural reference for developers and AI agents working on the **A. Prakash & Co.** codebase. It outlines the technology stack, directory structure, core features implemented, and the authentication system.

## 1. Technology Stack
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + Custom CSS (`globals.css` / `tailwind.config.ts`)
- **Database**: MySQL, queried via Prisma ORM
- **Authentication**: NextAuth.js (Auth.js v5 beta)
- **Language**: TypeScript

## 2. Core Features Implemented
- **Heritage Storefront**: Fully responsive, luxury e-commerce frontend. Includes pages for Home, Our Story, Shop, Reviews, Visit Us, Contact, and a dynamic Cart.
- **Unified Authentication**: A single login page (`/login`) handles both standard Customers and Admins. Registration (`/register`) is available for customers.
- **Role-Based Access Control (RBAC)**:
  - **USER**: Standard customers. Can browse, maintain a cart, and leave authenticated reviews on products.
  - **ADMIN**: Store managers. Can access the `/admin` dashboard to manage products, inventory, and orders.
  - **SUPER_ADMIN**: Owner level. Has all `ADMIN` privileges, plus the ability to add or remove other admins via `/admin/admins`.
- **Admin Dashboard**: A protected sidebar-driven dashboard. Missing modules (Reports, Banners, Customers, Coupons, Blog, Settings) have been gracefully stubbed with "Under Development" placeholder pages to prevent 404 errors.
- **Product Reviews**: The product details page (`ProductDetailClient.tsx`) requires users to be logged in before they can submit a review.

## 3. Key Files & Directories

### 3.1. Authentication & Security
- `src/auth.config.ts`: Contains the Edge-compatible configurations for NextAuth (pages, callbacks). Used by middleware to avoid Node.js runtime errors.
- `src/auth.ts`: Extends `auth.config.ts` and configures the `Credentials` provider using `bcryptjs` and `PrismaClient` to verify emails and passwords against both the `User` and `Admin` database tables.
- `src/middleware.ts`: Secures the application. It protects all `/admin` and `/api/admin` routes, redirecting unauthenticated users to `/login`. It also specifically restricts `/admin/admins` to `SUPER_ADMIN` only.

### 3.2. Database & API
- `prisma/schema.prisma`: The central database schema defining `User`, `Admin`, `Product`, `Review`, `Order`, etc.
- `prisma/seed-admins.ts`: A seed script used to populate the initial `super@prakash.com` and `admin@prakash.com` accounts.
- `src/lib/prisma.ts`: Exports a singleton instance of the Prisma Client (`export const prisma`) to prevent connection exhaustion in development.
- `src/app/api/`: Contains backend API routes.
  - `/api/auth/[...nextauth]/route.ts`: The NextAuth handler.
  - `/api/admin/users/route.ts`: Protected endpoint for Super Admins to create/delete admin accounts.
  - `/api/reviews/route.ts`: Endpoint for authenticated customers to post product reviews.

### 3.3. Frontend (Store)
- `src/app/(store)/` or `src/app/`: The main customer-facing pages (e.g., `/shop`, `/contact`, `/login`).
- `src/components/layout/Navbar.tsx`: The main navigation header. It is responsive, displays cart item counts, and dynamically changes based on `session` state (showing the logged-in user's name and an Admin Dashboard link if applicable).
- `src/components/shop/ProductDetailClient.tsx`: The client-side component for viewing a single product. It handles image galleries, variant selection, adding to cart, and submitting authenticated reviews.

### 3.4. Frontend (Admin)
- `src/app/admin/layout.tsx` & `src/components/admin/AdminSidebar.tsx`: The shell and navigation for the admin panel.
- `src/app/admin/admins/page.tsx` & `AdminManagerClient.tsx`: The Super Admin UI for adding/removing staff.
- `src/app/admin/products/page.tsx`: The data table and management UI for products.
- *Stub Pages*: Files like `src/app/admin/reports/page.tsx`, `src/app/admin/settings/page.tsx`, etc., are currently placeholders for future development.

## 4. UI/UX Aesthetics
- **Design System**: The site uses a "heritage" aesthetic with soft rounded corners (e.g., `8px` border radius on `.btn-primary`, `.input-heritage`), elegant serif fonts (`Playfair Display`, `Cormorant Garamond`), and a warm color palette (Brand Deep Green, Cream, Gold).
- **Responsiveness**: Tailwind's `md:`, `lg:` utilities are used extensively to ensure perfect layout scaling on mobile devices (e.g., stacked product columns, mobile hamburger menus).

---

*Note: Keep this file updated as new modules (e.g., actual implementation of Reports, Coupons, etc.) are built.*
