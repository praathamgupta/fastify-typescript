import { WebClient, WebAPICallResult } from '@slack/web-api';
import { Channels } from '../enums/slackChannels';
import { connect } from 'amqplib';
import dotenv from 'dotenv';

dotenv.config();

const slackToken = process.env.SLACK_TOKEN;

if (!slackToken) {
  console.error('SLACK_TOKEN is not set. Please check your environment variables.');
  process.exit(1); // Exit the process if SLACK_TOKEN is not set
}

console.log('SLACK_TOKEN is set:', slackToken); // Debug log to verify the token

const slackClient = new WebClient(slackToken);
const rabbitMQUrl = process.env.RABBITMQ_URL || 'amqp://localhost';

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

export async function consumeMessagesFromQueue(queueName: string): Promise<void> {
  try {
    const connection = await connect(rabbitMQUrl);
    const channel = await connection.createChannel();

    await channel.assertQueue(queueName, { durable: true });
    console.log(`Waiting for messages in queue '${queueName}'. To exit, press CTRL+C`);

    channel.consume(queueName, async (message) => {
      console.log('Received message from RabbitMQ');

      if (message) {
        const messageContent = message.content.toString();
        try {
          const { paragraph, channel: slackChannel } = JSON.parse(messageContent);
          await sendMessageToChannel(slackChannel, paragraph);
          console.log(`Message sent to Slack channel '${slackChannel}'`);
          channel.ack(message);
        } catch (error) {
          console.error('Error parsing or sending message to Slack:', error);
          channel.nack(message, false, false);
        }
      }
    }, { noAck: false });
  } catch (error) {
    console.error('Error consuming messages from queue:', error);
  }
}
