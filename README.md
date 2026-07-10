# Mercor Job Platform Clone

A modern job platform web application built to mimic the core functionalities of Mercor. This project provides a sleek, responsive interface for exploring job opportunities, browsing job categories, and learning more about the platform.

## 🚀 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) (shadcn/ui primitives)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management & Data Fetching**: [React Query (@tanstack/react-query)](https://tanstack.com/query/latest)
- **Forms & Validation**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Charts**: [Recharts](https://recharts.org/)

## 📂 Project Structure

- `src/app/` - Next.js App Router pages and layouts.
  - `/` - Home page
  - `/jobs` - Job listings page
  - `/categories` - Job categories page
  - `/about` - About us page
- `src/components/` - Reusable React components (UI elements, layout parts).
- `src/hooks/` - Custom React hooks.
- `src/lib/` - Utility functions and libraries.

## 🛠️ Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed on your machine. This project uses `bun` or `npm` for package management (a `bun.lock` and `package-lock.json` are both present).

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd mercor-clone
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   bun install
   ```

3. Set up environment variables:
   Copy the example environment file and configure it with your settings.
   ```bash
   cp .env.example .env
   ```

### Running the Development Server

Start the application locally:

```bash
npm run dev
# or
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## 📜 Scripts

- `npm run dev` - Starts the Next.js development server.
- `npm run build` - Builds the application for production.
- `npm run start` - Starts a Next.js production server.
- `npm run lint` - Runs ESLint to find and fix problems.
- `npm run format` - Formats code using Prettier.

## 🎨 Styling and UI

The project leverages **Tailwind CSS** for rapid and responsive UI styling. Additionally, it uses accessible UI primitives from **Radix UI**, combined with beautiful, customizable components standard in modern React applications.
