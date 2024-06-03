import amqp from 'amqplib';

class Producer {
  private static instance: Producer;
  private channel: amqp.Channel | null = null;
  private readonly queueName: string = 'slack_messages';

  private constructor() {}

  public static async getInstance(): Promise<Producer>
  {
    if (!Producer.instance) {
      Producer.instance = new Producer();
      await Producer.instance.connect();
    }
    return Producer.instance;
  }

  private async connect()
  {
    const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
    this.channel = await connection.createChannel();
    await this.channel.assertQueue(this.queueName, { durable: true });
  }

  public async sendMessage(message: any) {
    if (this.channel) {
      this.channel.sendToQueue(this.queueName, Buffer.from(JSON.stringify(message)), { persistent: true });
      console.log(`Message sent to RabbitMQ: ${JSON.stringify(message)}`);
    } else {
      throw new Error('Channel is not initialized.');
    }
  }
}

export default Producer;
