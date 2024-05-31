import fastify from 'fastify';
import { sendParagraph } from './controllers/messageController';
import { consumeMessagesFromQueue } from './services/slackService'

const app = fastify({ logger: true });

app.post('/send-paragraph', sendParagraph);

const start = async () => {
  try {
    await app.listen({ port: 3000 });
    await consumeMessagesFromQueue('slack_messages');
    app.log.info('Server listening on http://localhost:3000');
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
