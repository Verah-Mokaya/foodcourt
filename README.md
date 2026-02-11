# NextGen Food Court Web Application

## Project Overview

**Client:** Nextgen Mall, Nairobi  
**Location:** Mombasa Road, near Central Business District  

A modern web application designed to digitize the food ordering process at Nextgen Mall's food court, which hosts 20-30 outlets serving diverse cuisines including Ethiopian, Nigerian, Congolese, and Kenyan food.

## Problem Statement

Nextgen Mall attracts thousands of daily visitors to its food court. The current ordering system creates confusion as waiters from multiple outlets simultaneously approach customers with numerous menus, often leading to unintended orders. This application streamlines the experience by allowing customers to browse menus and place orders digitally from their table or in advance.

## Key Features

### Customer Features
- **Mobile-First Design**: Accessible on all major platforms (iOS, Android, web browsers)
- **Digital Menu Browsing**: View all available food items across all outlets
- **Advanced Filtering**: Filter by cuisine type, price range, and category (kids, snacks, etc.)
- **Shopping Cart**: Add multiple items, review order summary before placing
- **Table Reservations**: Book tables 20-30 minutes in advance with real-time availability
- **Order Tracking**: Real-time order status updates and estimated preparation time
- **User Authentication**: Secure customer accounts with JWT-based authentication

### Outlet Owner Features
- **Dashboard Access**: Dedicated portal for outlet management
- **Menu Management**: Add, update, and remove menu items
- **Order Management**: View and confirm incoming orders
- **Analytics**: Track sales, popular items, and performance metrics
- **Outlet Registration**: Self-service outlet registration system

## Technology Stack

### Frontend
- **Framework**: Next.js 16.1.6 (React 19.2.3)
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript 5

### Backend
- **Framework**: Flask (Python 3.8.13)
- **Database**: PostgreSQL (with SQLite for development)
- **ORM**: SQLAlchemy with Flask-SQLAlchemy
- **Migrations**: Flask-Migrate (Alembic)
- **Authentication**: Flask-JWT-Extended, Flask-Bcrypt
- **API**: RESTful architecture with Flask-RESTFUL
- **CORS**: Flask-CORS for cross-origin requests

