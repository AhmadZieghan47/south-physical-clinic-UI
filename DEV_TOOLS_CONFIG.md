# Development Tools Configuration

## Overview
The application sidebar menu includes developer-specific sections that can be toggled using an environment variable. This allows you to hide development and administrative tools in production environments.

## Configuration

### Environment Variable
Set `VITE_DEV_TOOLS` in your `.env` file:

```env
# Show all menu items (for development)
VITE_DEV_TOOLS=true

# Hide development menu items (for production)
VITE_DEV_TOOLS=false
```

## Menu Items Affected

When `VITE_DEV_TOOLS=false`, the following sidebar sections will be **hidden**:

- **Development**
  - Error Display Examples
  - Error Test Suite
  - Reception Dashboard

- **UI Components**
  - Basic Components
  - Extended Components

- **Charts & Maps**
  - Charts
  - Maps

- **Tables**
  - Basic Tables
  - Data Tables

- **Icons**
  - Icon Libraries

- **Forms**
  - Form Components

When `VITE_DEV_TOOLS=true`, **all menu items** are visible.

## Menu Items Always Visible

The following sections are **always visible** regardless of the `VITE_DEV_TOOLS` setting:

### Main Menu
- Dashboard
- Patients
- Appointments
- HRM
- Finance & Accounts

### Admin
- Diagnoses
- Users
- Discount Management
- Audit Logs

## Setup Instructions

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and set the desired value:
   ```env
   VITE_DEV_TOOLS=true  # or false
   ```

3. Restart the development server for changes to take effect:
   ```bash
   npm run dev
   ```

## Production Deployment

For production builds, ensure your deployment environment has `VITE_DEV_TOOLS=false` set to hide development tools from end users.

## Technical Implementation

- **Environment File**: `src/environment.tsx`
  - Exports `devToolsEnabled` variable
- **Sidebar Component**: `src/core/common/sidebar/sidebar.tsx`
  - Filters `SidebarData` based on `devToolsEnabled`
- **Sidebar Data**: `src/core/common/sidebar/sidebarData.tsx`
  - Contains all menu item definitions

