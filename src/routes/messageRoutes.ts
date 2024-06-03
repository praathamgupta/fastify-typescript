import { FastifyInstance } from 'fastify';
import Producer from '../queue/producer';

export default async function messageRoutes(fastify: FastifyInstance) {
  fastify.post('/send-paragraph', async (request, reply) => {
    const { paragraph, channels, servics } = request.body as { paragraph: string; channels: string[]; servics: string };
    const producer = await Producer.getInstance();
    await producer.sendMessage(paragraph, channels, servics);
    reply.send({ success: true, message: 'Paragraph sent to RabbitMQ for processing.' });
  });
}
