/**
 * Direct test of markdownToBlocks from @tryfabric/mack.
 * Run: node src/test-markdown-to-blocks.js
 */
import { markdownToBlocks } from '@tryfabric/mack';

const sample = `# Hello world

* bulleted item 1
* bulleted item 2

abc _123_

![cat](https://images.unsplash.com/photo-1574158622682-e40e69881006)
`;

async function run() {
  console.log('Input markdown:\n', sample);
  console.log('---\n');

  const blocks = await markdownToBlocks(sample);

  console.log('markdownToBlocks result:', JSON.stringify(blocks, null, 2));

  // Basic sanity checks
  const isArray = Array.isArray(blocks);
  const hasBlocks = isArray && blocks.length > 0;
  const blocksHaveType = isArray && blocks.every((b) => b && typeof b.type === 'string');

  if (isArray && hasBlocks && blocksHaveType) {
    console.log('\n✓ markdownToBlocks works: returns non-empty array of blocks with type');
    process.exit(0);
  } else {
    console.log('\n✗ Unexpected result:', { isArray, hasBlocks, blocksHaveType });
    process.exit(1);
  }
}

run().catch((err) => {
  console.error('markdownToBlocks failed:', err);
  process.exit(1);
});
