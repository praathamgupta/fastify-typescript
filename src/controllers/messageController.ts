
import { FastifyReply, FastifyRequest } from 'fastify';
import { sendMessageToChannel } from '../services/slackService';
import { SlackChannels } from '../enums/slackChannels';

interface ParagraphRequestBody {
  paragraph: string;
  channel: SlackChannels;
}

export const sendParagraph = async (request: FastifyRequest<{ Body: ParagraphRequestBody }>, reply: FastifyReply) => {
  const { paragraph, channel } = request.body;

  console.log('Received paragraph:', paragraph);
  console.log('Target channel:', channel);

  const success = await sendMessageToChannel(channel as any, paragraph);

  if (success) {
    reply.send({ success: true, message: 'Paragraph sent to Slack successfully' });
  } else {
    reply.status(500).send({ success: false, message: 'Failed to send paragraph to Slack' });
  }
};
