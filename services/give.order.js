const axios = require("axios");

class PlacingOrder {
    // Function to create an order
    async createShiprocketOrder({
        order_id,
        order_date,
        pickup_location,
        billing_customer_name,
        billing_last_name,
        billing_address,
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
        try {
            // ADDED THIS CHECK IN USER-SERVICE
            // First, check location availability
            // const isServiceable = await locationVerifier(billing_pincode, latitude, longitude, billing_pincode, latitude, longitude);

            // if (!isServiceable) {
            //     return { error: "Service not available in that region" };
            // }

            // If serviceable, proceed with order creation
            const response = await axios.post(
                "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
                {
                    order_id,
                    order_date,
                    pickup_location,
                    billing_customer_name,
                    billing_last_name,
                    billing_address,
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
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${process.env.SHIPROCKET_TOKEN}`
                    }
                }
            );

            return response;
        } catch (error) {
            console.error("Error creating order:", error.response?.data || error.message);
            throw error;
        }
    }


    async getItOutForDelivery(shipment_id) {
        try {
            const response = await axios.post(
                "https://apiv2.shiprocket.in/v1/external/courier/assign/awb",
                {
                    shipment_id: shipment_id
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${process.env.SHIPROCKET_TOKEN}`
                    }
                }
            );

            return response.data;
        } catch (error) {
            console.error("Error assigning AWB:", error.response?.data || error.message);
            throw error;
        }
    }
}

module.exports = {
    PlacingOrder
}