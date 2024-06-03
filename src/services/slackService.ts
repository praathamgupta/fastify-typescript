import { WebClient, WebAPICallResult } from '@slack/web-api';
import dotenv from 'dotenv';
import moment from 'moment-timezone';
import { executeQuery } from  '../services/postgresService';

dotenv.config();

const slackToken = process.env.SLACK_TOKEN;
const slackClient = new WebClient(slackToken);

export async function sendMessageToChannel(channels: string[], text: string, servics: string): Promise<boolean[]> {
  // Get the current timestamp in IST
  const timestamp = moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
  const messageText = `${text}\n\nServices: ${servics}\n\nSent at: ${timestamp}`;

  const results = await Promise.all(channels.map(async (channel) => {
    try {
      const result: WebAPICallResult = await slackClient.chat.postMessage({
        channel: channel,
        text: messageText,
      });

      if (!result.ok) {
        console.error('Error from Slack API:', result);
        throw new Error(`Slack API error: ${result.error}`);
      }

      console.log('Message sent to Slack:', result);

      const queryText = 'INSERT INTO slack_alert_messages (paragraph, channel, servics, timestamp) VALUES ($1, $2, $3, $4)';
      const queryValues = [text, channel, servics, timestamp];
      await executeQuery(queryText, queryValues);

      return true;
    } catch (error) {
      console.error('Error sending message to Slack:', error);
      return false;
    }
  }));

  return results;
}
