# Loops SDK + Next.js Example

This project is a simple learning repo for integrating the latest [Loops JavaScript SDK](https://loops.so/docs/sdks/javascript) in a Next.js App Router app.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Add your API key:

```bash
export LOOPS_API_KEY="your-api-key"
```

3. Run locally:

```bash
npm run dev
```

## Demo API routes

- `GET /api/health` - test API key (`loops.testApiKey()`)
- `POST /api/contacts` - upsert contact (`loops.updateContact()`)
- `GET /api/contacts` - find by `email` or `userId` (`loops.findContact()`)
- `DELETE /api/contacts` - delete by `email` or `userId` (`loops.deleteContact()`)
- `GET /api/lists` - list mailing lists (`loops.listMailingLists()`)
- `GET /api/properties` - list contact properties (`loops.listContactProperties()`)
- `POST /api/properties` - create contact property (`loops.createContactProperty()`)
- `POST /api/events` - send an event (`loops.sendEvent()`)
- `GET /api/transactional` - list transactional emails (`loops.listTransactionalEmails()`)
- `POST /api/transactional` - send transactional email (`loops.sendTransactionalEmail()`)

## Why this repo is useful

- Shows clean server-side SDK usage with Next.js route handlers.
- Includes practical error handling for validation, API errors, and rate limits.
- Includes a small UI (`/`) so users can try endpoints without writing scripts first.

## Good next additions for this dummy repo

- Campaign creation/editing (`createCampaign`, `updateEmailMessage`) to demonstrate LMX workflows.
- Upload flow (`createUpload`, `completeUpload`) for email assets.
- Suppression flows (`checkContactSuppression`, `removeContactSuppression`) for compliance support.
- Optional idempotency examples in webhook-like routes for safe retries.

## References

- [Loops JavaScript SDK docs](https://loops.so/docs/sdks/javascript)
- [Loops API reference](https://loops.so/docs/api-reference/intro)