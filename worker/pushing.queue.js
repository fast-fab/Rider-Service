// producer.js
const amqp = require('amqplib');

async function produceMessage() {
  const connection = await amqp.connect('amqp://localhost'); //figure out where is it listening , it needs to listen to the kafka request to produce
  const channel = await connection.createChannel();
  const queue = 'hello'; //probably the queues name

  await channel.assertQueue(queue);
  const message = 'Hello, RabbitMQ!'; //similar will pass on a the string
  channel.sendToQueue(queue, Buffer.from(message),{ persistent: true }); //this might be pushing it to the queue

  console.log(`Sent: ${message}`);
  
  setTimeout(() => {
    connection.close();
  }, 500);
}

produceMessage();