# HealthVillage - Frontend

Modern healthcare management system built with React, TypeScript, and Vite.

## Features

- **Patient Portal**: Book, reschedule, and cancel appointments
- **Doctor Portal**: Manage availability and view patient appointments
- **Admin Portal**: System overview and user management
- **Responsive Design**: Mobile-friendly interface
- **Type-Safe**: Full TypeScript coverage
- **Modern UI**: Built with Tailwind CSS and shadcn/ui

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **React Router** - Routing
- **React Query** - Data fetching (optional)

## Getting Started

### Prerequisites

- Node.js 16+ installed
- npm or yarn package manager

### Installation

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

### Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:5000/api
```

### Development

```bash
# Start development server
npm run dev

# Open browser to http://localhost:5173
```

### Build for Production

```bash
# Build the application
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── layout/          # Layout components
│   │   ├── shared/          # Reusable components
│   │   └── ui/              # UI primitives (shadcn/ui)
│   ├── pages/
│   │   ├── patient/         # Patient portal pages
│   │   ├── doctor/          # Doctor portal pages
│   │   └── admin/           # Admin portal pages
│   ├── lib/
│   │   ├── api.ts           # API client
│   │   ├── constants.ts     # App constants
│   │   ├── helpers.ts       # Utility functions
│   │   └── utils.ts         # General utilities
│   ├── hooks/               # Custom React hooks
│   ├── App.tsx              # Main app component
│   └── main.tsx             # Entry point
├── public/                  # Static assets
└── index.html              # HTML template
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Key Features

### Patient Features
- Register and login
- Book appointments with doctors
- Reschedule existing appointments
- Cancel appointments
- View appointment history
- Search and filter appointments

### Doctor Features
- Manage weekly availability
- Add/edit/delete time slots
- View patient appointments
- Search and filter appointments

### Admin Features
- View system statistics
- Manage users
- View all appointments
- Monitor system health

## Development Guidelines

### Adding New Pages

1. Create component in `src/pages/[role]/`
2. Add route in `src/App.tsx`
3. Use `DashboardLayout` wrapper
4. Add loading/empty/error states

### Adding New Components

1. Create in `src/components/shared/` for reusable components
2. Create in `src/components/ui/` for UI primitives
3. Export from component file
4. Add TypeScript types

### Using Constants

Import from `src/lib/constants.ts`:
```typescript
import { TIME_SLOTS, APPOINTMENT_STATUS } from '@/lib/constants';
```

### Using Helpers

Import from `src/lib/helpers.ts`:
```typescript
import { formatDate, validateReason } from '@/lib/helpers';
```

## Styling

This project uses Tailwind CSS with a custom configuration. Key classes:

- `healthcare-card` - Card component
- `page-header` - Page header
- `page-title` - Page title
- `page-description` - Page description
- `section-title` - Section title
- `table-container` - Table wrapper

## API Integration

The frontend communicates with the backend API using the `api` client from `src/lib/api.ts`:

```typescript
import api from '@/lib/api';

// GET request
const data = await api.get('/appointments/patient');

// POST request
await api.post('/appointments', { doctor_id, date, time });

// PUT request
await api.put('/appointments/:id', { date, time });

// PATCH request
await api.patch('/appointments/:id/cancel');
```

## Troubleshooting

### Port Already in Use

If port 5173 is already in use, Vite will automatically try the next available port.

### CORS Errors

Make sure the backend is running and `VITE_API_URL` in `.env` points to the correct backend URL.

### Build Errors

Clear node_modules and reinstall:
```bash
rm -rf node_modules
npm install
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

MIT License - see LICENSE file for details
