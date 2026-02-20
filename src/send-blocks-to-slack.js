/**
 * Send the markdown→blocks payload to the real Slack channel.
 * Uses SLACK_BOT_TOKEN or SLACK_USER_TOKEN and SLACK_DEFAULT_CHANNEL_ID from .env.
 * Run: node src/send-blocks-to-slack.js
 */
import 'dotenv/config';
import { markdownToBlocks } from '@tryfabric/mack';
import slackWebApi from '@slack/web-api';
const { WebClient } = slackWebApi;

const sample = `# Hello world

* bulleted item 1
* bulleted item 2

abc _123_

![cat](https://images.unsplash.com/photo-1574158622682-e40e69881006)
`;

async function run() {
  const token = process.env.SLACK_BOT_TOKEN || process.env.SLACK_USER_TOKEN;
  const channel = process.env.SLACK_DEFAULT_CHANNEL_ID;

  if (!token || !channel) {
    console.error('Missing SLACK_BOT_TOKEN or SLACK_USER_TOKEN, and SLACK_DEFAULT_CHANNEL_ID in .env');
    process.exit(1);
  }

  const blocks = await markdownToBlocks(sample);
  const text = sample.slice(0, 400).replace(/\n/g, ' ') || 'Message';

  const payload = { channel, text, blocks };
  console.log('payload:', JSON.stringify(payload, null, 2));

  const client = new WebClient(token);
  const result = await client.chat.postMessage(payload);

  console.log('Sent to Slack channel', channel);
  console.log('Message ts:', result.ts);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
