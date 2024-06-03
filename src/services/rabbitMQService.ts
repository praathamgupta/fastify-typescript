import amqp from 'amqplib/callback_api';

const rabbitMQUrl = 'amqp://localhost';

export async function sendMessageToRabbitMQ(message: any): Promise<void> {
        const queue = 'slack_messages';
        channel.assertQueue(queue, { durable: true }, (queueError) => {
          channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true });
          console.log(`Message sent to RabbitMQ: ${JSON.stringify(message)}`);
          setTimeout(() => {
            connection.close();
            resolve();
          }, 500);
        });
      });
    });
  });
}
