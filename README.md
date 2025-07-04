# User Dashboard

A modern, responsive user dashboard built with React, TypeScript, and Tailwind CSS. This dashboard displays user information, metrics, activity charts, and quick actions in a beautiful and intuitive interface.

## Features

- **Welcome Header**: Personalized greeting with user name and current streak count
- **Metric Cards**: Three key metrics (Active Projects, Completed Tasks, Points Earned) with colorful icons
- **Activity Chart**: Line chart showing daily activity for the past 7 days using Recharts
- **Quick Actions**: Three action buttons (Start New Project, View Analytics, Settings) with different styling variants
- **Responsive Design**: Fully responsive layout that works on desktop, tablet, and mobile devices
- **Loading States**: Skeleton loading animations for better user experience
- **TypeScript**: Full type safety with proper interfaces and type definitions

## Tech Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type safety and better developer experience
- **Tailwind CSS** - Utility-first CSS framework for styling
- **Recharts** - Composable charting library for React
- **React Scripts** - Build tool and development server

## Project Structure

```
src/
├── components/
│   ├── UserDashboard.tsx    # Main dashboard component
│   ├── MetricCard.tsx       # Reusable metric card component
│   ├── ActivityChart.tsx    # Chart component using Recharts
│   └── QuickActions.tsx     # Quick actions buttons component
├── types/
│   └── dashboard.ts         # TypeScript interfaces
├── App.tsx                  # Main app component
├── index.tsx               # React entry point
└── index.css               # Global styles with Tailwind
```

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository or navigate to the project directory
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run eject` - Ejects from Create React App (one-way operation)

## Component Usage

### UserDashboard

The main dashboard component that orchestrates all other components:

```tsx
import UserDashboard from './components/UserDashboard';

// With props
<UserDashboard 
  user={userData}
  metrics={metricsData}
  dailyActivity={activityData}
  isLoading={false}
/>

// Without props (uses mock data)
<UserDashboard />
```

### MetricCard

Reusable component for displaying metrics:

```tsx
import MetricCard from './components/MetricCard';

<MetricCard
  title="Active Projects"
  value={5}
  icon="📁"
  color="blue"
  isLoading={false}
/>
```

### ActivityChart

Chart component for displaying activity data:

```tsx
import ActivityChart from './components/ActivityChart';

<ActivityChart 
  data={dailyActivityData}
  isLoading={false}
/>
```

### QuickActions

Component for action buttons:

```tsx
import QuickActions from './components/QuickActions';

<QuickActions 
  actions={quickActionsArray}
  isLoading={false}
/>
```

## TypeScript Interfaces

The dashboard uses several TypeScript interfaces for type safety:

```tsx
interface User {
  id: string;
  name: string;
  email: string;
  streakCount: number;
  avatar?: string;
}

interface DashboardMetrics {
  activeProjects: number;
  completedTasks: number;
  pointsEarned: number;
}

interface DailyActivity {
  date: string;
  activity: number;
}

interface QuickAction {
  id: string;
  label: string;
  icon: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
}
```

## Customization

### Colors

The dashboard uses a custom color palette defined in `tailwind.config.js`. You can modify the primary colors by updating the configuration:

```js
theme: {
  extend: {
    colors: {
      primary: {
        50: '#eff6ff',
        100: '#dbeafe',
        // ... more shades
      },
    },
  },
}
```

### Metrics

To add more metric cards, simply add more `MetricCard` components to the grid in `UserDashboard.tsx`.

### Quick Actions

To modify quick actions, update the `quickActions` array in `UserDashboard.tsx`. Each action should follow the `QuickAction` interface.

## Responsive Design

The dashboard is fully responsive with the following breakpoints:

- **Mobile**: Single column layout
- **Tablet (md)**: Three-column metrics grid
- **Desktop (lg)**: Two-column layout for chart and actions

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE). 