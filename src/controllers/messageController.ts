import { FastifyReply, FastifyRequest } from 'fastify';
import { sendMessageToRabbitMQ } from '../services/rabbitMQService';

interface ParagraphRequestBody {
  paragraph: string;
  channel: string;
}

export const sendParagraph = async (request: FastifyRequest<{ Body: ParagraphRequestBody }>, reply: FastifyReply) => {
  const { paragraph, channel } = request.body;

  try {
    await sendMessageToRabbitMQ({ paragraph, channel });
    reply.send({ success: true, message: 'Paragraph sent to RabbitMQ for processing.' });
  } catch (error) {
    console.error('Error sending paragraph to RabbitMQ:', error);
    reply.status(500).send({ success: false, message: 'Failed to send paragraph to RabbitMQ.' });
  }
};
