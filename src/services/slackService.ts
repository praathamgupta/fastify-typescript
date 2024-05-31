import { WebClient, WebAPICallResult } from '@slack/web-api';
import { Channels } from '../enums/slackChannels';
import dotenv from 'dotenv';

dotenv.config();

const slackToken = process.env.SLACK_TOKEN;
const slackClient = new WebClient(slackToken);

export async function sendMessageToChannel(channel: Channels, text: string): Promise<boolean> {
  try {
    const result: WebAPICallResult = await slackClient.chat.postMessage({
      channel: channel,
      text: text,
    });

    if (!result.ok) {
      console.error('Error from Slack API:', result);
      throw new Error(`Slack API error: ${result.error}`);
    }

    console.log('Message sent to Slack:', result);
    return true;
  } catch (error) {
    console.error('Error sending message to Slack:', error);
    return false;
  }
}
