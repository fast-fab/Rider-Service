const { Kafka } = require('kafkajs');
const { kafkaConfig } = require('../config/kafka.config');
const { RedisServices } = require('../services/redis.services')
const redis = new RedisServices()

class ConsumingRiderClass {
  constructor() {
    this.kafka = new Kafka({
      clientId: kafkaConfig.clientId,
      brokers: kafkaConfig.brokers
    });
    this.consumer = this.kafka.consumer({ groupId: 'lol' });
    this.isConnected = false;
  }

  async connect() {
    try {
      if (!this.isConnected) {
        await this.consumer.connect();
        this.isConnected = true;
        console.log('Consumer connected successfully');
      }
    } catch (error) {
      console.error('Consumer connection failed:', error);
      throw error;
    }
  }

  async consumerfunction() {
    await this.connect();

    await this.consumer.subscribe({
      topics: [kafkaConfig.topics.acceptedOrder],
      fromBeginning: true
    });

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const key = message.key ? message.key.toString() : "No Key";
          const valueString = message.value.toString();
          const parsedData = JSON.parse(valueString);
          await redis.pushingToQueue(parsedData);
          console.log(`✅ Successfully pushed to Redis queue`);
        } catch (error) {
          console.error("❌ Error processing message:", error);
        }
      }
    });
}

}

module.exports = {
  ConsumingRiderClass
};
