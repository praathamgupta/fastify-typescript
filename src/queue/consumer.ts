import amqp from 'amqplib';
import { sendMessageToChannel } from '../services/slackService';

class Consumer {
  private static instance: Consumer;
  private channel: amqp.Channel | null = null;
  private readonly queueName: string = 'slack_messages';

  private constructor() {}

  public static async getInstance(): Promise<Consumer> {
    if (!Consumer.instance) {
      Consumer.instance = new Consumer();
      await Consumer.instance.connect();
    }
    return Consumer.instance;
  }

  private async connect() {
    const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
    this.channel = await connection.createChannel();
    await this.channel.assertQueue(this.queueName, { durable: true });
  }

  public async consumeMessages() {
    if (!this.channel) {
      throw new Error('Channel is not initialized.');
    }

    console.log(`Waiting for messages in queue '${this.queueName}'. To exit, press CTRL+C`);
    this.channel.consume(this.queueName, async (message) => {
      if (message) {
        const messageContent = message.content.toString();
        try {
          const { paragraph, channels, servics } = JSON.parse(messageContent);
          const results = await sendMessageToChannel(channels, paragraph, servics);
          const allSuccess = results.every(result => result === true);
          if (allSuccess) {
            this.channel!.ack(message);
          } else {
            this.channel!.nack(message, false, false);
          }
        } catch (error) {
          console.error('Error parsing or sending message to Slack:', error);
          this.channel!.nack(message, false, false);
        }
      }
    }, { noAck: false });
  }
}

export default Consumer;
