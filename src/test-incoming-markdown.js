/**
 * Test script for POST /incoming/markdown: receive payload → markdownToBlocks → post to Slack.
 * Run: node src/test-incoming-markdown.js
 * Uses a mocked Slack client so it passes without a valid Slack app.
 */
import { handleIncomingMarkdown, SAMPLE_MARKDOWN_FROM_MACK } from './incomingMarkdown.js';

const mockSlackClient = {
  chat: {
    postMessage: async ({ channel, text, blocks }) => {
      if (!channel || !blocks) throw new Error('channel and blocks required');
      return { ts: '1234567890.123456' };
    },
  },
};

function mockReq(body = {}) {
  return { body };
}

function mockRes() {
  const out = { statusCode: 200, body: null };
  return {
    status(code) {
      out.statusCode = code;
      return this;
    },
    json(data) {
      out.body = data;
      return this;
    },
    get output() {
      return out;
    },
  };
}

async function run() {
  let passed = 0;
  let failed = 0;

  // 1. Missing channel → 400 (unset default so channel is required)
  const savedDefaultChannel = process.env.SLACK_DEFAULT_CHANNEL_ID;
  delete process.env.SLACK_DEFAULT_CHANNEL_ID;
  const res1 = mockRes();
  await handleIncomingMarkdown(mockReq({}), res1, () => mockSlackClient);
  if (savedDefaultChannel !== undefined) process.env.SLACK_DEFAULT_CHANNEL_ID = savedDefaultChannel;
  const is400 = res1.output.body?.ok === false && res1.output.body?.error?.includes('Missing channel');
  if (is400) {
    console.log('✓ Missing channel returns 400');
    passed++;
  } else {
    console.log('✗ Missing channel: expected 400, got', res1.output.body);
    failed++;
  }

  // 2. With channel and custom markdown → 200, blocks sent
  const res2 = mockRes();
  await handleIncomingMarkdown(
    mockReq({ channel: 'C123', markdown: '# Hi\n* one\n* two' }),
    res2,
    () => mockSlackClient
  );
  if (res2.output.body?.ok === true && res2.output.body?.ts) {
    console.log('✓ Payload with markdown + channel returns 200 and ts');
    passed++;
  } else {
    console.log('✗ With channel: expected 200 + ts, got', res2.output.body);
    failed++;
  }

  // 3. No markdown in payload → uses SAMPLE_MARKDOWN_FROM_MACK
  const res3 = mockRes();
  await handleIncomingMarkdown(mockReq({ channel: 'C456' }), res3, () => mockSlackClient);
  if (res3.output.body?.ok === true && res3.output.body?.ts) {
    console.log('✓ No markdown in payload uses sample (mack README) and returns 200');
    passed++;
  } else {
    console.log('✗ Default markdown: got', res3.output.body);
    failed++;
  }

  // 4. Sample contains expected content
  if (
    SAMPLE_MARKDOWN_FROM_MACK.includes('Hello world') &&
    SAMPLE_MARKDOWN_FROM_MACK.includes('bulleted item 1')
  ) {
    console.log('✓ Sample payload matches @tryfabric/mack README');
    passed++;
  } else {
    console.log('✗ Sample payload content check failed');
    failed++;
  }

  console.log('\n' + (failed === 0 ? 'All ' + passed + ' tests passed.' : passed + ' passed, ' + failed + ' failed.'));
  process.exit(failed > 0 ? 1 : 0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
