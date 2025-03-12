const { dummyProducer } = require('../kafka/dummy.producer'); // Adjust path if needed

(async () => {
    const producer = new dummyProducer();
    
    const orderData = {
        order_id: "12345",
        order_date: new Date().toISOString(),
        pickup_location: "Warehouse A",
        billing_customer_name: "John",
        billing_last_name: "Doe",
        billing_address: "123 Main St",
        billing_address_2: "Apt 4B",
        billing_city: "New York",
        billing_pincode: "10001",
        billing_state: "NY",
        billing_country: "USA",
        billing_email: "johndoe@example.com",
        billing_phone: "+1234567890",
        shipping_is_billing: true,
        order_items: [
            { item_id: "A1", quantity: 2, price: 50 },
            { item_id: "B2", quantity: 1, price: 30 }
        ],
        payment_method: "Credit Card",
        length: 10,
        breadth: 5,
        height: 8,
        weight: 2.5,
        sub_total: 130,
        collect_shipping_fees: false,
        shipping_method: "Express",
        longitude: -74.006,
        latitude: 40.7128
    };

    try {
        await producer.produceMessages(orderData);
        console.log("Message produced successfully");
    } catch (error) {
        console.error("Error producing message:", error);
    }
})();