
# Pavittar Pharma CRM

A comprehensive Customer Relationship Management system for pharmaceutical companies. This full-stack application helps manage leads, orders, tasks, and manufacturers.

## Tech Stack

### Frontend
- **React**: UI library for building the user interface
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn UI**: Component library built on Radix UI primitives
- **React Hook Form**: Form validation library
- **React Query**: Data fetching and state management
- **Wouter**: Lightweight routing library
- **Zod**: TypeScript-first schema validation

### Backend
- **Express.js**: Node.js web application framework
- **TypeScript**: Type-safe JavaScript
- **Drizzle ORM**: TypeScript ORM for SQL databases
- **Passport.js**: Authentication middleware
- **Express Session**: Session management

### Database
- **PostgreSQL**: Relational database (via Neon Serverless)
- **Google Sheets**: Optional integration for data storage and access from anywhere

## Project Structure

### Root Directory
- `package.json`: Project dependencies and scripts
- `tsconfig.json`: TypeScript configuration
- `drizzle.config.ts`: Database schema migration configuration
- `tailwind.config.ts`: Tailwind CSS configuration
- `vite.config.ts`: Vite bundler configuration
- `theme.json`: UI theme configuration

### `/server` - Backend
- `index.ts`: Main entry point for Express server
- `routes.ts`: API route definitions
- `auth.ts`: Authentication utilities (password hashing, etc.)
- `storage.ts`: Database access layer
- `db.ts`: Database connection setup
- `vite.ts`: Development server configuration

### `/shared` - Shared Code
- `schema.ts`: Database schema definitions using Drizzle ORM

### `/client` - Frontend
- `index.html`: Main HTML template
- `/src`: Contains React components, hooks, and utilities
  - `/components`: UI components (including Shadcn UI components)
  - `/hooks`: Custom React hooks
  - `/lib`: Utility functions
  - `/pages`: Page components for different routes

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn
- PostgreSQL database

### Local Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pavittar-pharma-crm
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   - Create a PostgreSQL database
   - Configure your database connection in `.env` file (create this file based on `.env.example` if available)

4. **Run database migrations**
   ```bash
   npm run db:push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```
   This will start both the frontend (Vite) and backend (Express) servers.

6. **Access the application**
   Open your browser and navigate to [http://localhost:5000](http://localhost:5000)

## API Endpoints

### Authentication
- `POST /api/auth/login`: User login
- `POST /api/auth/register`: User registration
- `POST /api/auth/logout`: User logout
- `GET /api/auth/me`: Get current user

### Leads
- `GET /api/leads`: Get all leads
- `POST /api/leads`: Create a new lead
- `PATCH /api/leads/:id`: Update a lead

### Orders
- `GET /api/orders`: Get all orders
- `POST /api/orders`: Create a new order
- `PATCH /api/orders/:id`: Update an order

### Tasks
- `GET /api/tasks`: Get all tasks
- `POST /api/tasks`: Create a new task
- `PATCH /api/tasks/:id`: Update a task

### Manufacturers
- `GET /api/manufacturers`: Get all manufacturers
- `POST /api/manufacturers`: Create a new manufacturer

## Production Deployment

For production deployment:

```bash
# Build the project
npm run build

# Start the production server
npm start
```

## Google Sheets Integration

To use Google Sheets for data storage:

1. Create a Google Cloud project and enable the Google Sheets API
2. Create a service account and download the JSON key
3. Create a new Google Sheet and share it with the service account email
4. Add the following environment variables:
   - `USE_GOOGLE_SHEETS=true`
   - `GOOGLE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com`
   - `GOOGLE_PRIVATE_KEY=your-private-key`
   - `GOOGLE_SPREADSHEET_ID=your-spreadsheet-id`

With this setup, the application will store data in both the PostgreSQL database and Google Sheets, allowing you to access the data from anywhere.

## Security Notes

- This application uses express-session for session management
- Password hashing is implemented in the auth.ts file
- The session secret should be changed in a production environment
- Consider setting up proper environment variables for sensitive configuration
- When using Google Sheets integration, make sure to secure your service account credentials

## License

MIT
