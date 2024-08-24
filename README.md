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
DATABASE_URL="postgresql://user:password@localhost:5432/dbname?schema=schema_name"
POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_DB=dbname
```

> Set with your own information for `POSTGRES_USER`, `POSTGRES_DB` and `POSTGRES_PASSWORD`, and just fill in in `DATABASE_URL`.

Copy content of `.env.sameple` to a new file `.env`, then define the values for the environment variables

## Execution

To start the PostgreSQL service, it is needed Docker. To start runs:

```bash
docker compose up -d database
```

## Contribute

If you want to know more how the process of development and Git workflow, please read [contribution guide](./CONTRIBUTING.md).
