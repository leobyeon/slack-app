import express from 'express';
import 'dotenv/config';
import { handleIncomingMarkdown } from './incomingMarkdown.js';

const httpApp = express();
httpApp.use(express.json({ limit: '1mb' }));
httpApp.post('/incoming/markdown', (req, res) => handleIncomingMarkdown(req, res));

const PORT = Number(process.env.PORT) || 3000;

httpApp.listen(PORT, () => {
  console.log(`HTTP server listening on port ${PORT}; POST markdown to http://localhost:${PORT}/incoming/markdown`);
});
