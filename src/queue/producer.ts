import amqp from 'amqplib';

class Producer {
  private static instance: Producer;
  private channel: amqp.Channel | null = null;
  private readonly queueName: string = 'slack_messages';

  private constructor() {}

  public static async getInstance(): Promise<Producer> {
    if (!Producer.instance) {
      Producer.instance = new Producer();
      await Producer.instance.connect();
    }
    return Producer.instance;
  }

  private async connect() {
    const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
    this.channel = await connection.createChannel();
    await this.channel.assertQueue(this.queueName, { durable: true });
  }

  public async sendMessage(paragraph: string, channels: string[], servics: string) {
    if (!this.channel) {
      throw new Error('Channel is not initialized.');
    }

    const message = JSON.stringify({ paragraph, channels, servics });
    this.channel.sendToQueue(this.queueName, Buffer.from(message), {
      persistent: true
    });
    console.log('Message sent to RabbitMQ:', message);
  }
}

export default Producer;
