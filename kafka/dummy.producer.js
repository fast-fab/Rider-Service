const { DummykafkaConfig } = require('../config/kafka.config')
const {Kafka} = require('kafkajs')
let counter = 0;
class dummyProducer {
    constructor() {
        this.kafka = new Kafka({
            clientId: DummykafkaConfig.clientId,
            brokers: DummykafkaConfig.brokers
        });

        this.producer = this.kafka.producer();
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

    async produceMessages({
        order_id,
        order_date,
        pickup_location,
        billing_customer_name,
        billing_last_name,
        billing_address,
        billing_address_2,
        billing_city,
        billing_pincode,
        billing_state,
        billing_country,
        billing_email,
        billing_phone,
        shipping_is_billing,
        order_items,
        payment_method,
        length,
        breadth,
        height,
        weight,
        sub_total,
        collect_shipping_fees,
        shipping_method,
        longitude,
        latitude
    }) {
        await this.connect()
        counter++; //incerment counter for key
        var message = {
            order_id,
            order_date,
            pickup_location,
            billing_customer_name,
            billing_last_name,
            billing_address,
            billing_address_2,
            billing_city,
            billing_pincode,
            billing_state,
            billing_country,
            billing_email,
            billing_phone,
            shipping_is_billing,
            order_items,
            payment_method,
            length,
            breadth,
            height,
            weight,
            sub_total,
            collect_shipping_fees,
            shipping_method,
            longitude,
            latitude
        }
        console.log(message)
        console.log("here")
        const req = await this.producer.send({
            topic: DummykafkaConfig.topics.acceptedOrder,
            messages: [{
                key: counter, value: JSON.stringify(message), partition: 0
            }]
        })
        console.log(req)
    }
}
module.exports = {
    dummyProducer
}