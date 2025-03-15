const { Kafka } = require('kafkajs')
const { DummykafkaConfig } = require('../config/kafka.config')

class ConsumingRiderClass {
  constructor() {
    this.kafka = new Kafka({
      clientId: DummykafkaConfig.clientId,
      brokers: DummykafkaConfig.brokers,
      topics: DummykafkaConfig.topics.acceptedOrder
    })
    this.consumer = this.kafka.consumer({ groupId: 'lol' })
  }

  async consumerfunction() {
    await this.consumer.connect()
    console.log("connected")
    await this.consumer.subscribe({
      topics: [DummykafkaConfig.topics.acceptedOrder],
      fromBeginning: true
    })
    console.log("subscribed",DummykafkaConfig.topics.acceptedOrder)
    const a = await this.consumer.run({
      eachMessage: async ({ topics, message }) => {
        console.log(message)
        console.log({
          topics: topics.toString(),
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