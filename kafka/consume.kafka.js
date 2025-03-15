const { Kafka } = require('kafkajs')
const { DummykafkaConfig } = require('../config/kafka.config')

class ConsumingRiderClass {
  constructor() {
    this.kafka = new Kafka({
      clientId: DummykafkaConfig.clientId,
      brokers: DummykafkaConfig.brokers
    })
    this.consumer = this.kafka.consumer({ groupId: 'lol' })
    this.isConnected = false;
  }
  async connect() {
    try {
        if (!this.isConnected) {
            await this.consumer.connect();
            this.isConnected = true;
            console.log('consumer connected successfully');
        }
    } catch (error) {
        console.error('consumer connection failed:', error);
        throw error;
    }
}
  async consumerfunction() {
    const c=await this.connect()
    const b=await this.consumer.subscribe({
      topics: [DummykafkaConfig.topics.acceptedOrder],
      fromBeginning: true
    })
    console.log("subscribed",b)
    const a = await this.consumer.run({
      eachMessage: async ({ topic,partition, message }) => {
        console.log(message)
        console.log({
          topic: topic.toString(),
          key: message.key.toString(),
          value: message.value.toString()
        })
      }
    })
    console.log(a,"consumed")
  }
}


module.exports = {
  ConsumingRiderClass
}