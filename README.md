# Ecovision Frontend

A Next.js application for ecological vision analysis and monitoring.

## Features

- User authentication and authorization
- File uploads with TUS protocol
- Real-time inference jobs
- Dashboard for results and analytics
- Admin panel for system management

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy environment variables:

   ```bash
   cp .env.example .env.local
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `src/app/` - Next.js app router pages
- `src/components/` - Reusable UI components
- `src/features/` - Feature-specific modules
- `src/hooks/` - Custom React hooks
- `src/services/` - API and external service integrations
- `src/lib/` - Utility libraries and configurations
- `src/providers/` - React context providers
- `src/stores/` - State management stores
- `src/types/` - TypeScript type definitions

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Deployment

The application includes Docker support and GitHub Actions workflows for CI/CD.

## Contributing

Please follow the established project structure and coding standards.
