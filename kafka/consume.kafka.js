const { Kafka } = require('kafkajs');
const { DummykafkaConfig } = require('../config/kafka.config');
const { PlacingOrder } = require('../services/give.order')
const placeOrder = new PlacingOrder()

class ConsumingRiderClass {
  constructor() {
    this.kafka = new Kafka({
      clientId: DummykafkaConfig.clientId,
      brokers: DummykafkaConfig.brokers
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
      topics: [DummykafkaConfig.topics.acceptedOrder],
      fromBeginning: true
    });

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const key = message.key ? message.key.toString() : null;
          const valueString = message.value.toString();
          const parsedData = JSON.parse(valueString);
          // create order
          const placingOrder = placeOrder.createShiprocketOrder({
            order_id: parsedData.order_id,
            order_date: parsedData.order_date,
            pickup_location: parsedData.pickup_location,
            billing_customer_name: parsedData.billing_customer_name,
            billing_last_name: parsedData.billing_last_name,
            billing_address: parsedData.billing_address,
            billing_city: parsedData.billing_city,
            billing_pincode: parsedData.billing_pincode,
            billing_state: parsedData.billing_state,
            billing_country: parsedData.billing_country,
            billing_email: parsedData.billing_email,
            billing_phone: parsedData.billing_phone,
            shipping_is_billing: parsedData.shipping_is_billing,
            order_items: parsedData.order_items,
            payment_method: parsedData.payment_method,
            length: parsedData.length,
            breadth: parsedData.breadth,
            height: parsedData.height,
            weight: parsedData.weight,
            sub_total: parsedData.sub_total,
            collect_shipping_fees: parsedData.collect_shipping_fees,
            shipping_method: parsedData.shipping_method,
            longitude: parsedData.longitude,
            latitude: parsedData.latitude
          })
          const assigningAWBNumber = placeOrder.getItOutForDelivery(parsedData.shipment_id)
          // testing ka idea ni hai  but this should get the work done
        } catch (error) {
          console.error("Error processing message:", error);
        }
      }
    });
  }
}

module.exports = {
  ConsumingRiderClass
};
