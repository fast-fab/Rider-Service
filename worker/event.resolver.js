// yeh queue se uthayega aur phir order place krega
// batch request
const amqp = require('amqplib');

async function consumeMessage() {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  const queue = 'hello';

  await channel.assertQueue(queue);
  console.log('Waiting for messages...');

  channel.consume(queue, (message) => {
    const content = message.content.toString();
    console.log(`Received: ${content}`);
  }, { noAck: true });
}

consumeMessage();