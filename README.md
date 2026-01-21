# To-Do List App

A modern, secure, and responsive To-Do list application built with Next.js, TypeScript, and Prisma.

## Features

- **User Authentication**: Secure user registration and login functionality.
- **Task Management**: Create, read, update, and delete to-do items.
- **Dark Mode**: Built-in dark mode support for better user experience.
- **Responsive Design**: Optimized for both desktop and mobile devices.
- **Data Persistence**: Uses SQLite with Prisma ORM for reliable data storage.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite
- **ORM**: Prisma
- **Authentication**: NextAuth.js / Custom Implementation

## Getting Started

### Prerequisites

Ensure you have Node.js and npm installed on your machine.

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd todo-app-next
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up the database:

   ```bash
   npx prisma migrate dev
   ```

4. Run the development server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Development

- **Database Studio**: Run `npx prisma studio` to view and edit database records via a GUI.
- **Linting**: Run `npm run lint` to check for code quality issues.
