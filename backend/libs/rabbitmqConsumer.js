import amqp from 'amqplib';
import { pool } from '../libs/database.js';

export const connectRabbitMQConsumer = async () => {
  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    await channel.assertQueue('transactionQueue', { durable: true });

    console.log('Connected to RabbitMQ (Goal Service), waiting for messages...');

    channel.consume('transactionQueue', async (msg) => {
      if (msg !== null) {
        const transaction = JSON.parse(msg.content.toString());
        console.log('Received transaction:', transaction);

        try {
          await updateGoalsWithTransaction(transaction.userId, transaction.amount, transaction.type);
          channel.ack(msg); 
        } catch (err) {
          console.error('Failed to update goal:', err);
          channel.nack(msg); 
        }
      }
    });
  } catch (error) {
    console.error('RabbitMQ Consumer Error:', error);
  }
};

const updateGoalsWithTransaction = async (userId, amount, type) => {
  if (type !== 'income') return; 
  
  const goalsResult = await pool.query({
    text: `SELECT * FROM goals WHERE user_id = $1 AND status != 'completed'`,
    values: [userId],
  });

  for (let goal of goalsResult.rows) {
    const newAmount = parseFloat(goal.current_amount) + parseFloat(amount);
    let newStatus = goal.status;
    if (newAmount >= parseFloat(goal.target_amount)) {
      newStatus = 'completed';
    }

    await pool.query({
      text: `UPDATE goals SET current_amount = $1, status = $2 WHERE id = $3`,
      values: [newAmount, newStatus, goal.id],
    });

    console.log(`Goal ${goal.goal_name} updated: current_amount = ${newAmount}, status = ${newStatus}`);
  }
};

