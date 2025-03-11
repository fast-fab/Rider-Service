const { Kafka } = require('kafkajs');
const { kafkaConfig } = require('../../config/kafka.config');

class OrderAcceptingService {

    constructor() {
        this.kafka = new Kafka({
            clientId: kafkaConfig.clientId,
            brokers: kafkaConfig.brokers
        });
        this.consumer = this.kafka.consumer({groupId:'rider-service'});
    }

    
  async connect() {
    try {
      await this.consumer.connect();
      console.log('Consumer connected successfully');

      await this.consumer.subscribe({
        topics: [,
          kafkaConfig.topics.acceptedOrder
        ],
        fromBeginning: true
      });
    } catch (error) {
      console.error('Consumer connection failed:', error);
      throw error;
    }
  }

    async subscribe() {
        await this.connect()
        await consumer.subscribe({ topic: 'test-topic', fromBeginning: true })
        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                console.log("topic is:",topic,{
                    value: message.value.toString(),
                })
            },
        })
    }
}

module.exports = {
    OrderAcceptingService
}