const { DummykafkaConfig } = require('../config/kafka.config');
const { Kafka } = require('kafkajs');

let counter = 0;
class dummyProducer {
    constructor() {
        this.kafka = new Kafka({
            clientId: DummykafkaConfig.clientId,
            brokers: DummykafkaConfig.brokers
        });

        this.producer = this.kafka.producer();
        this.isConnected = false; // Initialize isConnected flag
    }

    async connect() {
        try {
            if (!this.isConnected) {
                await this.producer.connect();
                this.isConnected = true;
                console.log('Producer connected successfully');
            }
        } catch (error) {
            console.error('Producer connection failed:', error);
            throw error;
        }
    }

    async produceMessages(orderData) {
        try {
            await this.connect();
            counter++; // Increment counter for key
            
            const message = JSON.stringify(orderData);

            const req1 = await this.producer.send({
                topic: DummykafkaConfig.topics.acceptedOrder,
                messages: [{ 
                    key: String(counter), 
                    value: message, 
                    partition: 0 
                }]
            });

            console.log("Message sent:", req1);
            return req1;
        } catch (error) {
            console.error("Error producing message:", error);
            throw error;
        }
    }
}

module.exports = {dummyProducer} ;