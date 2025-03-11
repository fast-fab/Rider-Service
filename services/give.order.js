const express = require("express");
const axios = require("axios");
const app = express();

// Function to verify location serviceability
async function locationVerifier(pickup_postcode, lat_from, long_from, delivery_pincode, lat_to, long_to) {
    try {
        const response = await axios.get("https://apiv2.shiprocket.in/v1/external/courier/serviceability", {
            params: {
                pickup_postcode,
                lat_from,
                long_from,
                delivery_postcode: delivery_pincode,
                lat_to,
                long_to,
                is_new_hyperlocal: true
            }
        });

        if (response.data.status === true) {
            console.log("Working in that region");
            return true;
        } else {
            console.log("Not operational, stopping process");
            return false;
        }
    } catch (error) {
        console.error("Error in location verification:", error.response?.data || error.message);
        return false;
    }
}

// Function to create an order
async function createShiprocketOrder({
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
    try {
        // First, check location availability
        const isServiceable = await locationVerifier(billing_pincode, latitude, longitude, billing_pincode, latitude, longitude);

        if (!isServiceable) {
            return { error: "Service not available in that region" };
        }

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


async function getItOutForDelivery({ shipment_id, courier_id }) {
    try {
        const getDetails = createShiprocketOrder({
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
        })
        const shipmentid = getDetails.shipment_id
        const courier_id = getDetails.courier_id
        const response = await axios.post(
            "https://apiv2.shiprocket.in/v1/external/courier/assign/awb",
            {
                shipment_id: shipmentid,
                courier_id: courier_id
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
