/**
 * Call Slack auth.test with the token from .env to see if it's valid and active.
 * Run: node src/auth-test.js
 */
import 'dotenv/config';
import slackWebApi from '@slack/web-api';
const { WebClient } = slackWebApi;

const token = process.env.SLACK_BOT_TOKEN || process.env.SLACK_USER_TOKEN;
if (!token) {
  console.error('Set SLACK_BOT_TOKEN or SLACK_USER_TOKEN in .env');
  process.exit(1);
}

const client = new WebClient(token);
const result = await client.auth.test();
console.log('auth.test result:', JSON.stringify(result, null, 2));
