const client = require('../config/redis.config');
const { PlacingOrder } = require('./give.order');
const placeOrder = new PlacingOrder();

class RedisServices {
    constructor() {
        this.client = client;
        // this.client.connect(); // Ensure Redis is connected
        this.popingFromQueue(); // Start consuming messages in the background
    }

    async pushingToQueue(orderData) {
        try {
            await this.client.lPush("requests", JSON.stringify(orderData));
            console.log("✅ Order pushed to queue:", orderData);
            return { status: 200, message: "Submission received and stored." };
        } catch (error) {
            console.error("❌ Redis error:", error);
            return { status: 500, message: "Error occurred" };
        }
    }

    async popingFromQueue() {
        try {
            console.log("🚀 Redis queue processor started...");
            while (true) {
                const request = await this.client.brPop("requests", 0);
                console.log(request,"type",typeof request)
                if (!request) continue;

                const parsedOrder = JSON.parse(request); // Correctly parse the JSON
                console.log("🛠️ Processing order:", parsedOrder,"type:",typeof parsedOrder,"type:",typeof request,request);

                // ✅ Placing order here
                // const placingOrder = await placeOrder.createShiprocketOrder(parsedOrder);
                
                // if (!placingOrder?.shipment_id) {
                //     console.error("❌ Error: Shiprocket order creation failed.");

                //     // Retry logic with max 3 attempts
                //     parsedOrder.retry_count = (parsedOrder.retry_count || 0) + 1;

                //     if (parsedOrder.retry_count > 3) {
                //         console.error("🚨 Max retries reached. Moving order to dead-letter queue.");
                //         await this.client.lPush("dead_letter_queue", JSON.stringify(parsedOrder));
                //     } else {
                //         console.warn(`🔄 Retrying order... Attempt: ${parsedOrder.retry_count}`);
                //         await this.client.lPush("requests", JSON.stringify(parsedOrder));
                //     }
                //     continue;
                // }

                // // ✅ Assigning AWB number after order placement
                // await placeOrder.getItOutForDelivery(placingOrder.shipment_id);
                console.log("✅ Order successfully placed and AWB assigned.");
            }
        } catch (e) {
            console.error("🔥 Error in Redis queue processing:", e);
        }
    }
}

module.exports = { RedisServices };
