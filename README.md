# FoodCourt

A modern, full-stack food ordering and restaurant management platform that connects customers with multiple food outlets, enabling seamless online ordering, real-time tracking, and table reservations.

## Overview

FoodCourt is a comprehensive food delivery and restaurant management system designed to revolutionize how customers discover, order, and track food from their favorite outlets. The platform serves multiple user roles including customers, outlet owners, and admins, providing each with tailored experiences and features.

## Key Features

### For Customers
- **Browse & Discover**: Explore a curated marketplace of top-rated outlets and menu items
- **Smart Shopping**: Add items to cart, view detailed menu information, and customize orders
- **Secure Checkout**: Process payments safely with integrated payment modals
- **Live Tracking**: Track order status from kitchen to delivery in real-time
- **Order History**: View past orders and reorder favorites quickly
- **Table Reservations**: Book tables at outlets and manage reservations
- **Personalized Dashboard**: Access profile, order history, and preferences in one place

### For Outlet Owners/Managers
- **Dashboard Analytics**: View orders, revenue, and operational metrics
- **Menu Management**: Create, edit, and manage menu items with images and pricing
- **Table Management**: Monitor table availability and manage reservations
- **Order Management**: View incoming orders and update their status in real-time
- **Outlet Settings**: Configure outlet information, hours, and cuisine types

### General Features
- **Authentication System**: Secure login/signup with role-based access control (customer, outlet, owner, admin)
- **Responsive Design**: Mobile-first approach works seamlessly across all devices
- **Real-time Updates**: Live order tracking and status updates
- **Multiple Outlet Support**: Browse and order from multiple restaurants in one place

## Tech Stack

### Frontend
- **Next.js 16.1.6**: React framework with App Router, SSR, and built-in optimizations
- **React 19.2.3**: Modern UI library with latest features and performance improvements
- **TypeScript**: Type-safe development with comprehensive type definitions
- **Tailwind CSS 4**: Utility-first CSS framework for responsive design
- **Framer Motion 12.34.0**: Animation and motion library for smooth UI transitions
- **NextAuth.js 4.24.13**: Authentication and authorization management
- **Lucide React**: Beautiful, consistent icon library

### Development Tools
- **ESLint**: Code quality and consistency enforcement
- **PostCSS**: CSS processing and transformation

## Project Structure

```
web/
├── app/
│   ├── api/
│   │   └── auth/[...nextauth]/      # NextAuth authentication endpoints
│   ├── context/
│   │   ├── AuthContext.tsx           # Authentication state management
│   │   └── CartContext.tsx           # Shopping cart state management
│   ├── components/
│   │   ├── Navbar.tsx                # Main navigation component
│   │   ├── Footer.tsx                # Footer component
│   │   └── SessionProvider.tsx       # NextAuth session provider
│   ├── features/
│   │   └── Home/
│   │       ├── components/
│   │       │   ├── Hero.tsx          # Hero section
│   │       │   └── BestSellers.tsx   # Featured items section
│   │       └── page.tsx              # Home page
│   ├── (navigation)/                 # Route group for navigation layout
│   │   ├── dashboard/                # Outlet owner dashboard
│   │   │   ├── components/
│   │   │   ├── Menu/
│   │   │   ├── Tables/
│   │   │   └── reservations/
│   │   ├── customer/dashboard/       # Customer profile and history
│   │   ├── marketplace/              # Browse outlets and menu items
│   │   ├── cart/                     # Shopping cart and checkout
│   │   ├── booking/                  # Table reservations
│   │   ├── outlets/                  # Outlets listing page
│   │   ├── orders/                   # Order tracking and history
│   │   ├── reservations/             # Reservation management
│   │   ├── login/                    # Authentication pages
│   │   └── signup/
│   ├── lib/
│   │   ├── api.ts                    # API client and configuration
│   │   ├── types.ts                  # TypeScript type definitions
│   │   ├── routes.ts                 # Route constants
│   │   └── utils.ts                  # Utility functions
│   ├── layout.tsx                    # Root layout component
│   └── globals.css                   # Global styles and Tailwind config
├── package.json                      # Dependencies and scripts
├── tsconfig.json                     # TypeScript configuration
└── next.config.ts                    # Next.js configuration
```

## Data Models

### User
- `id`: Unique user identifier
- `email`: User email address
- `first_name`, `last_name`: Customer name
- `role`: User role (customer, outlet, owner, admin)
- `outletId`: Associated outlet (for outlet staff)
- `phone_number`: Contact number
- `password`: Hashed password (stored securely)

### MenuItem
- `id`: Unique menu item identifier
- `outlet_id`: Associated outlet
- `item_name`: Name of the dish
- `price`: Item price
- `category`: Food category
- `image_url`: Image URL for the item
- `is_available`: Availability status
- `description`: Item description

### Outlet
- `id`: Unique outlet identifier
- `outlet_name`: Restaurant name
- `cuisine_type`: Type of cuisine offered
- `description`: Outlet description
- `owner_id`: Owner user ID
- `image_url`: Outlet image
- `is_active`: Operational status

### Order
- `id`: Unique order identifier
- `customer_id`: Ordering customer
- `outlet_id`: Outlet fulfilling order
- `total_amount`: Total order amount
- `status`: Order status (pending, preparing, ready, completed, cancelled)
- `created_at`: Order timestamp
- `order_items`: Array of items in the order
- `payment_info`: Payment details

### Table
- `id`: Unique table identifier
- `table_number`: Table number
- `capacity`: Seating capacity
- `is_available`: Current availability

## Key Routes

### Customer Routes
- `/` - Home page with featured outlets
- `/login` - Customer login
- `/signup` - New customer registration
- `/marketplace` - Browse menu items
- `/cart` - Shopping cart and checkout
- `/outlets` - View all outlets
- `/booking` - Table reservation
- `/orders/tracking` - Real-time order tracking
- `/orders/history` - Past orders
- `/reservations` - Manage reservations
- `/customer/dashboard` - Customer profile and history
- `/reservations/payment` - Payment for reservations

### Outlet Owner Routes
- `/dashboard` - Main dashboard overview
- `/dashboard/Menu` - Menu item management
- `/dashboard/Tables` - Table management
- `/dashboard/reservations` - Reservation management
- `/orders/tracking` - View orders (outlet version)

## Authentication

The application uses **NextAuth.js** with a credentials-based provider:

### Authentication Flow
1. User enters credentials (email/password)
2. System attempts customer login endpoint first
3. Falls back to outlet login if customer login fails
4. On success, fetches user data from `/auth/me` endpoint
5. Session stored via JWT tokens

### Session Management
- Strategy: JWT (JSON Web Tokens)
- User role is embedded in token for authorization
- Session includes user metadata (name, outlet info, role)
- Automatic redirect to login page for unauthenticated users

## Getting Started

### Prerequisites
- Node.js 18+ or higher
- npm or pnpm package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Verah-Mokaya/foodcourt.git
   cd foodcourt/web
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the `web/` directory:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3001
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here
   ```

4. **Run the development server**
   ```bash
   pnpm dev
   ```

5. **Open in browser**
   Navigate to `http://localhost:3000`

### Building for Production

```bash
pnpm run build
pnpm start
```

## State Management

### AuthContext
Manages user authentication state:
- Current logged-in user
- User role and permissions
- Login/logout functionality
- User metadata (name, outlet, etc.)

### CartContext
Manages shopping cart state:
- Added items and quantities
- Current outlet selection
- Cart total calculation
- Checkout process

## API Integration

The application connects to a backend API for:
- User authentication (`/auth/customer/login`, `/auth/outlet/login`, `/auth/me`)
- Menu management
- Order processing and tracking
- Table management
- Payment processing
- User profile operations

API base URL is configured in `lib/api.ts` and can be customized via environment variables.

## Styling & Design

- **Color Scheme**: Orange (#F97316) as primary brand color with white, gray, and neutral tones
- **Typography**: System fonts (Geist/Geist Mono) for optimal performance
- **Responsive Design**: Mobile-first approach using Tailwind CSS breakpoints
- **Animations**: Smooth transitions and interactions using Framer Motion
- **Accessibility**: Semantic HTML, ARIA attributes, and keyboard navigation

## Components

### Key Components
- **Navbar** - Global navigation with authentication state
- **Hero** - Landing page hero section with CTA
- **BestSellers** - Featured menu items carousel
- **MenuCard** - Individual menu item display
- **MenuItemModal** - Detailed item view and cart addition
- **FilterSidebar** - Menu filtering options
- **MenuTable** - Admin menu management table
- **Orders** - Order listing and management
- **PaymentModal** - Checkout payment interface
- **MenuItemForm** - Admin form for creating/editing items

## Best Practices

- **Type Safety**: Full TypeScript coverage across all components
- **Performance**: Image optimization, code splitting, lazy loading
- **Security**: Secure authentication, protected routes, input validation
- **Accessibility**: WCAG compliance, semantic markup, aria labels
- **Code Organization**: Modular components, utility functions, context-based state
- **Responsive Design**: Mobile-first, tested across all breakpoints

## Development Workflow

### Adding a New Feature

1. Create the page/component in appropriate directory
2. Define types in `lib/types.ts` if needed
3. Add route constant in `lib/routes.ts`
4. Implement component with TypeScript types
5. Integrate with AuthContext or CartContext as needed
6. Add styling with Tailwind CSS
7. Test across mobile and desktop views

### Creating API Endpoints

1. Ensure backend API endpoint is ready
2. Add type definitions in `lib/types.ts`
3. Create API helper function in `lib/api.ts`
4. Use SWR or state context for data management
5. Handle loading and error states

## Environment Variables

| Variable | Purpose | Example |
|----------|---------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:3001` |
| `NEXTAUTH_URL` | NextAuth callback URL | `http://localhost:3000` |
| `NEXTAUTH_SECRET` | JWT secret key | `your-secret-key-12345` |

## Troubleshooting

### Common Issues

**Authentication not working**
- Verify `NEXTAUTH_SECRET` is set in `.env.local`
- Check backend API URL in `NEXT_PUBLIC_API_URL`
- Ensure backend auth endpoints are accessible

**Styling not applied**
- Run `pnpm install` to ensure Tailwind is installed
- Check that `globals.css` is imported in `layout.tsx`
- Clear `.next` folder and rebuild

**Cart not persisting**
- Verify CartContext is properly wrapping your component tree
- Check browser console for context errors
- Ensure SessionProvider is initialized

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes following the code style
3. Commit with meaningful messages: `git commit -m "Add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a pull request for review

## License

This project is private and proprietary. All rights reserved by Verah-Mokaya/foodcourt.

## Contact & Support

For issues, questions, or feature requests, please open an issue on the GitHub repository or contact the development team.

---

**Last Updated**: February 2026
**Version**: 0.1.0
**Maintainer**: Marine G-3 Team
