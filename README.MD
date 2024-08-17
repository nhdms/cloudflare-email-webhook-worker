Handle incoming email and forward as HTTP request

## Setup

#### Install dependencies

```bash
npm install
```

#### Setup webhook
```
Update WEBHOOK_URL, EXTRA_HEADERS in wrangler.toml
``` 
or 

```bash
wrangler secret put WEBHOOK_URL
wrangler secret put EXTRA_HEADERS
```

#### Deploy the worker

```bash
npm run deploy
```

#### Set up a route
- Go to your [zone's Email Workers settings](https://dash.cloudflare.com/?to=/:account).
- Click the zone (e.g. `example.com`), then `Email`, `Email Routing`.
- On the `Email Workers` tab, register an email route.

- Register an email route

#### Verify

- Send an email to the email address you registered.
- Check the channel you registered the webhook to.