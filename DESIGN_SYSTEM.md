# EcoVision 2.0 - Design System Configuration

This repository has been configured with the EcoVision 2.0 design system. This document describes the implementation.

## ✅ Completed Configuration

### 1. Design System Foundation

- **CSS Variables** (`src/app/globals.css`): Complete color palette including brand, neutrals, semantic, and vegetation class colors
- **Tailwind Configuration** (`tailwind.config.ts`): Custom color schemes, typography, spacing, shadows, and radius presets

### 2. Primitive UI Components (`src/components/ui/`)

- `button.tsx` - Button component with variants (primary, secondary, ghost, destructive), sizes, and loading states
- `badge.tsx` - Badge component for status indicators
- `card.tsx` - Card component with configurable padding
- `skeleton.tsx` - Skeleton loader component
- `input.tsx` - Input field component

### 3. Layout Components (`src/components/layout/`)

- `app-shell.tsx` - Main app wrapper with sidebar and responsive behavior
- `app-sidebar.tsx` - Navigation sidebar with role-based filtering, user profile section, and mobile menu
- `page-header.tsx` - Page header with breadcrumbs, title, and action slot
- `index.ts` - Exports for all layout components

### 4. State Management

- **Zustand Stores** (`src/stores/`):
  - `auth.store.ts` - Auth state (user, isAuthenticated, isLoading)
  - `upload.store.ts` - Upload progress tracking (activeUploads Map)
  - `job.store.ts` - Job filtering and selection

- **TanStack Query**:
  - `src/lib/query-keys.ts` - Centralized query key factory
  - `src/providers/query-provider.tsx` - Query client configuration

### 5. Type Definitions (`src/types/index.ts`)

- AuthUser, JobStatus, InferenceJob
- VegetationClass, ImageMetadata, BoundingBox
- DominanceStats, InferenceResult
- UploadProgress, SystemHealth
- API response types

### 6. Authentication & Routing

- **Middleware** (`src/middleware.ts`): Route guards, token validation, redirect logic
- **Auth Provider** (`src/providers/auth-provider.tsx`): Session initialization on app boot
- **Query Provider** (`src/providers/query-provider.tsx`): TanStack Query setup with default options

### 7. Page Templates

- **Login** (`src/app/(auth)/login/page.tsx`): Keele SSO + Cognito native auth options
- **Callback** (`src/app/(auth)/callback/page.tsx`): Auth code exchange handler
- **Dashboard** (`src/app/dashboard/page.tsx`): Job listing, stat cards
- **Upload** (`src/app/upload/page.tsx`): Drag-and-drop file upload with progress
- **Results** (`src/app/results/[jobId]/page.tsx`): Map viewer, dominance stats, metadata
- **Admin** (`src/app/admin/page.tsx`): System health metrics, all jobs view

## 📋 Installation & Setup

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Environment variables** (create `.env.local`):

   ```
   NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
   NEXT_PUBLIC_COGNITO_DOMAIN=your-cognito-domain
   NEXT_PUBLIC_COGNITO_CLIENT_ID=your-client-id
   NEXT_PUBLIC_AWS_REGION=eu-west-2
   ```

3. **Start development server:**

   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   npm start
   ```

## 🎨 Design System Features

### Color Palette

- **Brand**: Primary (#14532d), Secondary (#166534), Accent (#4ade80), Muted (#dcfce7)
- **Semantics**: Success, Warning, Error, Info colors with backgrounds
- **Vegetation**: Spartina, Puccinellia, Other veg, Bare sediment, Water
- **Neutrals**: Surface, Raised, Overlay, Borders, Text levels

### Typography

- **Font Stack**: Inter (UI), JetBrains Mono (data/code)
- **Font Feature**: `tabular-nums` for numeric data alignment

### Spacing & Radius

- **Spacing**: 4px base unit (4, 6, 8, 12, 16, 24, 32, etc.)
- **Radius**: md (6px), lg (8px), xl (12px), full (pill)
- **Shadows**: sm, md, lg, xl per Tailwind defaults

### Responsive Design

- **Desktop-first**: Optimized for desktop, responsive to tablet/mobile
- **Breakpoints**: Tailwind defaults (sm, md, lg, xl, 2xl)
- **Sidebar**: Fixed at w-64, collapses to w-16 on md, hidden on sm (hamburger menu)

## 🔐 Security & Access Control

- **Route Guards**: Middleware validates auth token for protected routes
- **Role-Based**: Components filter based on user.role before render
- **Session Cookie**: httpOnly cookie pattern for token storage
- **Unauthorized States**: Graceful handling of permission boundaries

## 📡 Data Fetching

### TanStack Query Configuration

- Stale time: 60 seconds for queries
- Retry: 1 attempt on failure
- Query keys factory: Centralized `queryKeys` in `src/lib/query-keys.ts`

### API Integration Pattern

```typescript
// Example query hook pattern
const { data, isLoading, error } = useQuery({
  queryKey: queryKeys.jobs.list(page),
  queryFn: () => fetch("/api/jobs?page=" + page).then((r) => r.json()),
});
```

## 🚀 Next Steps

1. **Implement API routes** in `src/app/api/` for:
   - Authentication (login, sso, callback, logout, me)
   - Jobs (list, detail, create, delete)
   - Uploads (POST multipart, progress, resume)
   - Admin (health, system metrics)
   - Results (download segmentation, confidence map, stats)

2. **Create API client hooks** in `src/hooks/` using TanStack Query:
   - `useLogin()`, `useLogout()`, `useUser()`
   - `useJobs()`, `useJob()`, `useJobResults()`
   - `useUpload()` with progress tracking
   - `useSystemHealth()`

3. **Implement map viewer** component using:
   - `react-leaflet` (already installed)
   - `geotiff.js` for GeoTIFF rendering
   - `leaflet` for map controls

4. **Add form validation** with schema library (e.g., Zod, Yup)

5. **Implement WebSocket/polling** for real-time job status:
   - Start with polling at 15s interval for jobs in progress
   - Add WebSocket later if needed

6. **Configure deployment**:
   - Update `vercel.json` if using Vercel
   - Configure environment variables per environment
   - Set up CI/CD pipeline

## 📦 Dependencies Added

```json
{
  "@tanstack/react-query": "^5.28.0",
  "@radix-ui/react-collapsible": "^1.0.3",
  "@radix-ui/react-dropdown-menu": "^2.0.5",
  "@radix-ui/react-switch": "^1.0.3",
  "react-leaflet": "^4.2.3",
  "leaflet": "^1.9.4",
  "geotiff": "^2.1.1",
  "recharts": "^2.10.3",
  "zustand": "^4.4.1"
}
```

## 🧪 Testing Strategy

1. **Unit tests**: Component behavior, store logic
2. **Integration tests**: API communication, data flow
3. **E2E tests**: User flows (login → upload → view results)

## 📚 Resources

- Tailwind Docs: https://tailwindcss.com/docs
- Radix UI: https://www.radix-ui.com/
- TanStack Query: https://tanstack.com/query/latest
- Zustand: https://zustand.pmnd.rs/
- Lucide Icons: https://lucide.dev/

---

**Configuration Date**: May 9, 2026
**Design System Version**: EcoVision 2.0
