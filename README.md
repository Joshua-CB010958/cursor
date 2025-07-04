# Smart Task Automation Engine

A comprehensive business automation platform that enables users to create, manage, and monitor automated workflows for various business processes. Built with React, TypeScript, Node.js, and PostgreSQL.

## 🚀 Features

### Frontend (React + TypeScript + Tailwind)
- **TaskAutomationDashboard**: Modern dashboard with real-time metrics and automation cards
- **CreateAutomationModal**: Multi-step form for creating new automations
- **Real-time Analytics**: Charts and metrics using Recharts
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Form Validation**: Comprehensive validation with error handling
- **Loading States**: Smooth user experience with loading indicators

### Backend (Node.js + Express + TypeScript)
- **RESTful API**: Complete CRUD operations for automations
- **Database Integration**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT-based authentication with middleware
- **Webhook Support**: Stripe and SendGrid webhook integration
- **Rate Limiting**: API protection with express-rate-limit
- **Logging**: Winston-based logging system
- **Scheduled Processing**: Cron jobs for automation execution

### Business Logic
- **Automation Processor**: Intelligent workflow execution engine
- **Trigger System**: Multiple trigger types (new lead, payment, email, schedule)
- **Action System**: Various action types (email, task, CRM, report)
- **Error Handling**: Robust error recovery and logging
- **Performance Monitoring**: Execution tracking and analytics

## 🛠️ Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- React Router for navigation
- React Hook Form for form management
- Recharts for data visualization
- Lucide React for icons
- React Hot Toast for notifications

### Backend
- Node.js with Express
- TypeScript for type safety
- PostgreSQL database
- Drizzle ORM for database operations
- JWT for authentication
- Winston for logging
- Node-cron for scheduling

### External Integrations
- Stripe for payment processing
- SendGrid for email delivery
- Webhook support for real-time events

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL 12+
- npm or yarn package manager

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd smart-task-automation-engine
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
```bash
cp env.example .env
```

Edit `.env` with your configuration:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=automation_engine

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key

# External Services (optional for development)
SENDGRID_API_KEY=your-sendgrid-api-key
STRIPE_SECRET_KEY=your-stripe-secret-key
```

### 4. Database Setup
```bash
# Create PostgreSQL database
createdb automation_engine

# Run database migrations
npm run db:generate
npm run db:migrate
```

### 5. Start Development Servers
```bash
# Start both frontend and backend
npm run dev

# Or start individually
npm run dev:server  # Backend on port 5000
npm run dev:client  # Frontend on port 3000
```

## 📁 Project Structure

```
smart-task-automation-engine/
├── src/
│   ├── client/                 # React frontend
│   │   ├── components/         # React components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── App.tsx            # Main app component
│   │   ├── main.tsx           # Entry point
│   │   └── index.css          # Global styles
│   ├── server/                # Node.js backend
│   │   ├── database/          # Database schema and connection
│   │   ├── middleware/        # Express middleware
│   │   ├── routes/            # API routes
│   │   ├── services/          # Business logic services
│   │   ├── utils/             # Utility functions
│   │   └── index.ts           # Server entry point
│   ├── types/                 # Shared TypeScript types
│   └── test/                  # Test setup and utilities
├── public/                    # Static assets
├── logs/                      # Application logs
└── dist/                      # Build output
```

## 🔧 API Endpoints

### Automations
- `GET /api/automations` - Get user's automations with pagination
- `POST /api/automations` - Create new automation
- `GET /api/automations/:id` - Get single automation
- `PUT /api/automations/:id` - Update automation
- `PUT /api/automations/:id/toggle` - Toggle automation status
- `DELETE /api/automations/:id` - Delete automation
- `GET /api/automations/analytics` - Get automation metrics

### Webhooks
- `POST /api/webhooks/stripe` - Stripe payment webhooks
- `POST /api/webhooks/email` - Email service webhooks

## 🎯 Automation Types

### Triggers
- **New Lead**: Triggered when a new lead is created
- **Payment Received**: Triggered when a payment is processed
- **Email Opened**: Triggered when an email is opened
- **Custom Schedule**: Triggered on a cron schedule

### Actions
- **Send Email**: Send automated emails via SendGrid
- **Create Task**: Create tasks in task management system
- **Update CRM**: Update records in CRM system
- **Generate Report**: Generate and send reports

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Structure
- **Unit Tests**: Component and service tests
- **Integration Tests**: API endpoint tests
- **E2E Tests**: Full workflow tests

## 📊 Monitoring & Analytics

The platform provides comprehensive analytics:
- Total automations count
- Active automations
- Tasks completed today
- Success rate percentage
- Average execution time
- Time saved calculations
- Category breakdown
- Recent execution logs

## 🔒 Security Features

- JWT-based authentication
- Rate limiting on API endpoints
- Input validation and sanitization
- CORS configuration
- Helmet.js security headers
- Environment variable protection

## 🚀 Deployment

### Railway Deployment (Recommended)

The easiest way to deploy your Smart Task Automation Engine is using Railway:

1. **Connect Repository**: Link your GitHub repository to Railway
2. **Add PostgreSQL**: Railway will automatically provision a database
3. **Configure Variables**: Set environment variables in Railway dashboard
4. **Deploy**: Railway will automatically build and deploy your app

For detailed instructions, see [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md)

### Production Build
```bash
npm run build
npm start
```

### Docker Deployment
```bash
# Build Docker image
docker build -t automation-engine .

# Run container
docker run -p 5000:5000 automation-engine
```

### Environment Variables for Production
- Set `NODE_ENV=production`
- Configure production database credentials
- Set up external service API keys
- Configure proper JWT secret
- Set up SSL certificates

See `railway.env.example` for Railway-specific configuration.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the test examples

## 🔮 Roadmap

- [ ] Advanced workflow builder with visual editor
- [ ] Integration with more CRM systems
- [ ] Real-time collaboration features
- [ ] Advanced analytics and reporting
- [ ] Mobile application
- [ ] API rate limiting per user
- [ ] Multi-tenant support
- [ ] Advanced scheduling options
- [ ] Webhook testing tools
- [ ] Import/export functionality

---

Built with ❤️ for modern business automation needs. 