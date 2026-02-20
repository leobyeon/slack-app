import 'dotenv/config';
import { markdownToBlocks } from '@tryfabric/mack';
import slackWebApi from '@slack/web-api';
const { WebClient } = slackWebApi;

// Sample markdown from @tryfabric/mack README – used when payload has no markdown
export const SAMPLE_MARKDOWN_FROM_MACK = `
# Hello world

* bulleted item 1
* bulleted item 2

abc _123_

![cat](https://images.unsplash.com/photo-1574158622682-e40e69881006)
`.trim();

/**
 * Handle POST /incoming/markdown: parse body → markdownToBlocks → post to Slack.
 * getSlackClient can be overridden for tests.
 */
export async function handleIncomingMarkdown(req, res, getSlackClient = null) {
  const token = process.env.SLACK_BOT_TOKEN || process.env.SLACK_USER_TOKEN;
  const createClient = getSlackClient ?? (() => new WebClient(token));
  try {
    const { markdown = SAMPLE_MARKDOWN_FROM_MACK, channel } = req.body || {};
    const channelId = channel || process.env.SLACK_DEFAULT_CHANNEL_ID;

    if (!channelId) {
      res.status(400).json({
        ok: false,
        error: 'Missing channel. Send { "markdown": "...", "channel": "C123..." } or set SLACK_DEFAULT_CHANNEL_ID',
      });
      return;
    }

    const blocks = await markdownToBlocks(markdown);
    const text = markdown.slice(0, 400).replace(/\n/g, ' ') || 'Message';

    const payload = { channel: channelId, text, blocks };
    console.log('payload:', JSON.stringify(payload, null, 2));

    const client = createClient();
    const result = await client.chat.postMessage(payload);

    console.log('chat.postMessage result:', result);

    res.json({ ok: true, channel: channelId, ts: result.ts });
  } catch (err) {
    console.error('POST /incoming/markdown error:', err);
    res.status(500).json({ ok: false, error: err.message || String(err) });
  }
}
