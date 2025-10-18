# Getting Started

## Installation

```bash
npm install
```

## Environment Setup

Create a `.env` file in the root directory with the following variables:

### Database Configuration

Set your PostgreSQL database connection string:

```env
DATABASE_URL=postgresql://francois:francois@localhost:1234/francois
```

If you have Docker installed, you can use the included Docker Compose configuration:

```bash
docker compose up -d
```

### Better Auth Configuration

```env
BETTER_AUTH_SECRET=  # Generate a random secret token
BETTER_AUTH_URL=http://localhost:4000  # Base URL of your app

GOOGLE_CLIENT_ID= # App won't crash but user won't be able to connect to google
GOOGLE_CLIENT_SECRET=

RESEND_API_KEY= # If you use Resend, app won't crash without it but user won't be able to reset their password
RESEND_FROM_EMAIL=
```

## Database Migration

Once your environment is configured, push the schema to your database:

```bash
npm run db:push
```

**Note:** This command is recommended for local/dev environments only, as it doesn't track migrations.

### Production Migrations

For production deployments using Drizzle:

1. Generate migration files after modifying `schema.ts`:
   ```bash
   npx drizzle-kit generate
   ```

2. Apply migrations:
   ```bash
   npx drizzle-kit migrate
   ```

Refer to the [Drizzle documentation](https://orm.drizzle.team/docs/migrations) for more details.

## Running the Application

Start the development server:

```bash
npm run dev
```

Your application should now be running at `http://localhost:4000`