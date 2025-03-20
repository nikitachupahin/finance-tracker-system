import amqp from 'amqplib';

let channel;

export const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect('amqp://localhost'); // или другой адрес
    channel = await connection.createChannel();
    await channel.assertQueue('transactionQueue', { durable: true });
    console.log('Connected to RabbitMQ (Publisher)');
  } catch (error) {
    console.error('RabbitMQ Connection Error:', error);
  }
};

export const publishTransaction = (message) => {
  if (!channel) {
    console.error('RabbitMQ channel is not established!');
    return;
  }
  channel.sendToQueue('transactionQueue', Buffer.from(JSON.stringify(message)), {
    persistent: true,
  });
};
