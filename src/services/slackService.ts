
import { WebClient } from '@slack/web-api';
import { SlackChannels, ChannelIds } from '../enums/slackChannels';

const slackToken = 'xoxb-7190218543681-7202644883169-LaqIAeOjrw6xnLkYsTsnitQb';
const slackClient = new WebClient(slackToken);

export async function sendMessageToChannel(channel: any, text: string): Promise<boolean> {
  try {
    const channelId = ChannelIds[channel];
    if (!channelId) {
      throw new Error(`Channel '${channel}' not found.`);
    }

    const result = await slackClient.chat.postMessage({
      channel: channelId,
      text: text,
    });

    console.log('Message sent to Slack:', result);
    return true;
  } catch (error) {
    console.error('Error sending message to Slack:', error);
    return false;
  }
}
