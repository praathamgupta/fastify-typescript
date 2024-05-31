import { FastifyInstance } from 'fastify';
import Producer from '../queue/producer';
import { Channels } from '../enums/slackChannels';

export default async function messageRoutes(fastify: FastifyInstance) {
  fastify.post('/send-paragraph', async (request, reply) => {
    const { paragraph, channel } = request.body as { paragraph: string; channel: keyof typeof Channels };
    const producer = await Producer.getInstance();
    await producer.sendMessage({ paragraph, channel });
    reply.send({ success: true, message: 'Paragraph sent to RabbitMQ for processing.' });
  });
}
