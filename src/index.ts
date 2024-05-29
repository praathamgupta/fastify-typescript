
import fastify from 'fastify';
import { sendParagraph } from './controllers/messageController';

const server = fastify({ logger: true });

server.post('/slack/send-message', sendParagraph);


const start = async () => {
  try {
    await server.listen({
      port: 3002,
      host: 'localhost',
    });
    console.log('Server is running at http://localhost:3002');
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
