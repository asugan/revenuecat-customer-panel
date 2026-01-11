# RevenueCat Local Customer Console

Local Express app to list and delete RevenueCat customers via API v2.

## Requirements

- Node.js 18+ (uses built-in fetch)
- npm
- RevenueCat API v2 secret key with customer permissions

## Setup

Create a `.env` file in the project root:

```
RC_SECRET_API_KEY=your_api_key_here
RC_PROJECT_ID=your_project_id_here
PORT=3002
RC_API_BASE_URL=https://api.revenuecat.com/v2
```

Install dependencies:

```
npm install
```

Start the server:

```
npm start
```

Open the UI in your browser:

```
http://localhost:3002
```

## API

- `GET /customers` — Lists customers (supports query params like `search`, `limit`, `starting_after`)
- `DELETE /customers/:id` — Deletes a customer

The endpoints proxy to:

- `GET /v2/projects/{project_id}/customers`
- `DELETE /v2/projects/{project_id}/customers/{customer_id}`

## Notes

- `RC_PROJECT_ID` is required for v2 customer endpoints.
- Use `search` to filter by email.
