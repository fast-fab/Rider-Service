const {Kafka}=require('kafkajs')
const {kafkaConfig}=require('../config/kafka.config')

class ConsumingRiderClass{
    constructor(){
      this.kafka=new Kafka({
        clientId:kafkaConfig.clientId,
        brokers:kafkaConfig.brokers,
        topics:kafkaConfig.topics.acceptedOrder
      })
      this.consumer=this.kafka.consumer({groupId:'lol'})
    }

    async consumer(){
      await this.consumer.connect()
      await this.consumer.subscribe({
        topics:[kafkaConfig.topics.acceptedOrder],
        fromBeginning:true
      })

      await this.consumer.run({
        eachMessage:async({topics,message})=>{
          console.log({
            topics:topics.toString(),
            key:message.key.toString(),
            value:message.value.toString()
          })
        }
      })
    }
  }


module.exports={
  ConsumingRiderClass
}