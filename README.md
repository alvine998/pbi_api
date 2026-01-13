# PBI API

Express.js REST API for PBI Dashboard.

## Tech Stack

- **Runtime**: Node.js 20
- **Framework**: Express.js 5
- **Database**: MySQL with Sequelize ORM
- **Authentication**: JWT

## Local Development

```bash
# Install dependencies
npm install

# Copy environment file and configure
cp .env.example .env

# Start development server
npm run dev
```

## Docker Deployment

### Prerequisites

- Docker and Docker Compose installed on server
- Git repository cloned on server

### Build and Run

```bash
# Create environment file
cp .env.example .env
# Edit .env with your values

# Deploy
docker compose up -d --build
```

### Useful Commands

```bash
# View logs
docker compose logs -f

# Restart container
docker compose restart

# Stop container
docker compose down

# Rebuild without cache
docker compose build --no-cache
```

## CI/CD

GitHub Actions automatically deploys when pushing to `main` branch.

### Required GitHub Secrets

| Secret            | Description                       |
| ----------------- | --------------------------------- |
| `SSH_PRIVATE_KEY` | SSH private key for server access |
| `SSH_HOST`        | Server hostname or IP address     |
| `SSH_USER`        | SSH username                      |
| `PROJECT_PATH`    | Project directory on server       |
| `ENV_FILE`        | Full contents of .env file        |

## API Endpoints

Base URL: `/v1`

- `/auth` - Authentication
- `/users` - User management
- `/products` - Product management
- `/aspirations` - Aspirations
- `/news` - News articles
- `/forum` - Forum discussions
- `/polls` - Polls/surveys
- `/notifications` - Notifications
- `/chat` - Live chat
- `/activity-log` - Activity logs
