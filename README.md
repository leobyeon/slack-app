# Slack App (Node.js + Bolt)

A small Slack app built with [Bolt for JavaScript](https://slack.dev/bolt-js/), using **Socket Mode** so you can run it locally without exposing a public URL.

## What it does

- **Message:** Replies when someone says "hi", "hey", or "hello" in a channel where the app is invited.
- **Slash command:** `/greet [name]` – responds with a greeting.
- **App Home:** Shows a welcome message when users open the app’s Home tab.

## Setup

### 1. Create a Slack app

1. Go to [api.slack.com/apps](https://api.slack.com/apps) and **Create New App** → **From scratch**.
2. Name the app and pick a workspace.

### 2. Enable Socket Mode

1. In the app, go to **Settings** → **Socket Mode** and turn it **On**.
2. Create an **App-Level Token** with scope `connections:write` and copy it → this is `SLACK_APP_TOKEN`.

### 3. Bot token and permissions

1. Go to **OAuth & Permissions**.
2. Under **Scopes** → **Bot Token Scopes**, add:
   - `app_mentions:read` (optional, for @mentions)
   - `chat:write`
   - `commands`
   - `message:read`
   - `users:read`
3. Install the app to your workspace and copy the **Bot User OAuth Token** → this is `SLACK_BOT_TOKEN`.

### 4. Slash command (optional)

1. Go to **Slash Commands** → **Create New Command**.
2. Command: `/greet`, Short description: `Get a greeting`, then Save.

### 5. Event subscriptions (for messages)

1. Go to **Event Subscriptions** and turn **Enable Events** On.
2. Under **Subscribe to bot events**, add **message.channels** (and **message.im** if you want DMs).
3. Save changes.

### 6. App Home (optional)

1. Go to **App Home** and turn **Home Tab** On.
2. Optionally enable **Messages Tab** and **Allow users to send Slash commands and messages**.

### 7. Run the app

```bash
cd slack-app
# Edit .env and set SLACK_BOT_TOKEN and SLACK_APP_TOKEN (and SLACK_SIGNING_SECRET if you like)
npm install
npm start
```

For development with auto-restart:

```bash
npm run dev
```

## Project structure

```
slack-app/
├── src/
│   └── index.js    # App entry and handlers
├── .env
├── package.json
└── README.md
```

## Links

- [Bolt for JavaScript](https://slack.dev/bolt-js/)
- [Slack API – Creating an app](https://api.slack.com/authentication/basics)
