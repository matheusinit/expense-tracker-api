# expense-tracker-api

## What is this API?

Expense Tracker API provides over HTTP requests a way to manage your financial expenses to help in your day-to-day costs.

## Configuration

### Install dependencies

It is needed that dependencies are installed locally to start process:

```bash
pnpm i
```

### Configure environment variables

To ensure that applications run with credentials, it is needed to configure secrets and variables that **should not be shared** in `.env` file. The sample for `.env` is the following:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dbname?schema=schema_name"
POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_DB=dbname

# Application server
CSRF_TOKEN_SECRET=secret
SESSION_SECRET=secret

# ORM
PRISMA_CLIENT_LOG="info, warn"
```
> The available options for `PRISMA_CLIENT_LOG` are info, warn, query and error in the current version of Prisma ORM (5.18)

> Set with your own information for `POSTGRES_USER`, `POSTGRES_DB` and `POSTGRES_PASSWORD`, and just fill in in `DATABASE_URL`.

Copy content of `.env.sameple` to a new file `.env` (for production, staging or development), then define the values for the environment variables. In case for run testing environemnt, use `.env.test.local`

To generate the secret for `CSRF_TOKEN_SECRET` and `SESSION_SECRET`, also for **passwords** use the following command:

```bash
openssl rand -base64 24 | tr -d '=' | cut -c1-32
```

> But remember, the content must not be the same!

## Run tests

### Unit tests

To run unit tests, only execute the following command:

```bash
pnpm test:unit
```

### Integration tests

To start the PostgreSQL service for integration tests, it is needed Docker. To start runs:

```bash
docker compose --env-file .env.test.local up -d database-test
```

Now, we will generate the types for the application based on the models:

```bash
pnpm prisma generate
```

We need to apply migrations to our database using the chosen ORM. For development, you can run the following command:

```bash
pnpm migrate:test
```

To execute only the integration tests, run:

```
pnpm test:integration
```

> In case of running all tests, included integration and unit, runs `pnpm test`

## Execution

### Database

To start the PostgreSQL service, it is needed Docker. To start runs:

```bash
docker compose up -d database
```

Now, We will generate the types for the application based on the models:

```bash
pnpm prisma generate
```

We need to apply migrations to our database using the chosen ORM. For development, you can run the following command:

```bash
pnpm migrate:dev
```

> For production, the command to run is `pnpm migrate:prod`

## Contribute

If you want to know more how the process of development and Git workflow, please read [contribution guide](./CONTRIBUTING.md).
