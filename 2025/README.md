# 🔧 Garage Management System

A comprehensive automotive garage management application built with Vue 3, TypeScript, and Vite. Manage customers, track vehicle service intervals, handle parts inventory, and schedule appointments all in one place.

## ✨ Features

### 👥 Customer Management
- Add and manage customer information
- Track multiple vehicles per customer
- View complete customer and vehicle history
- Search and filter customers

### 📦 Parts Inventory
- Track parts stock levels
- Low stock alerts and notifications
- Manage part orders from suppliers
- Real-time inventory valuation
- Categorize parts by type
- Track part locations in shop

### 📅 Service Appointments
- Schedule service appointments
- Track appointment status (scheduled, in-progress, completed, cancelled)
- View today's and upcoming appointments
- Link appointments to customers and vehicles
- Track estimated and actual costs
- Record parts used and labor hours

### 🔔 Service Interval Notifications
- **Automatic service interval tracking**
- **Highlight overdue maintenance** with visual alerts
- Show services due soon (within 30 days or 1000 miles)
- Track by both date and mileage
- Flag unscheduled services
- Quick access to schedule appointments for overdue services

### 📊 Dashboard
- Overview of key metrics
- Today's appointments at a glance
- Overdue service alerts
- Low stock warnings
- Quick navigation to critical items

### 📥📤 Import/Export Data
- **Export to XLSX or CSV** - Export customers, parts, and appointments individually
- **Bulk export** - Export all data at once from Dashboard
- **Import from files** - Import customers, parts, and appointments from XLSX or CSV files
- **Multi-sheet support** - XLSX exports include all data types in separate sheets
- **Data backup** - Easily backup and restore your garage data

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (20.19+ or 22.12+ recommended)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🛠️ Technology Stack

- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Pinia** - State management
- **Vue Router** - Client-side routing

## 📁 Project Structure

```
src/
├── components/       # Reusable Vue components
├── views/           # Page-level components
├── stores/          # Pinia state management
├── types/           # TypeScript type definitions
├── router/          # Vue Router configuration
├── App.vue          # Root component
└── main.ts          # Application entry point
```

## 🎯 Key Concepts

### Service Intervals
The application automatically tracks service intervals for each vehicle based on:
- **Time-based intervals** (e.g., every 6 months)
- **Mileage-based intervals** (e.g., every 5,000 miles)
- **Overdue detection** based on current date and mileage
- **Scheduled status** to avoid duplicate notifications

### State Management
Uses Pinia stores for:
- Customer and vehicle data
- Parts inventory
- Service appointments
- Centralized data access across components

## 🎨 UI/UX Features

- **Responsive design** - Works on desktop, tablet, and mobile
- **Visual alerts** - Color-coded status indicators
- **Badge notifications** - In-app notification badges
- **Modal dialogs** - Clean forms for data entry
- **Search and filtering** - Quick access to information

## 📝 Development

The application includes sample data for testing and development purposes. In a production environment, you would connect to a backend API for data persistence.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar)
