import fastify from 'fastify';
import dotenv from 'dotenv';
import messageRoutes from './routes/messageRoutes';
import Consumer from './queue/consumer';

dotenv.config();

const app = fastify({ logger: true });

app.register(messageRoutes);

const start = async () => {
  try {
    await app.listen(3000);
    const consumer = await Consumer.getInstance();
    await consumer.consumeMessages();
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
