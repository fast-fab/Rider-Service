const { createClient } = require("redis");

const client = createClient({
    url: "redis://localhost:6379" // Adjust this if using a different Redis host
});

// Handle errors
client.on("error", (err) => {
    console.error("Redis Client Error:", err);
});

// Connect once and reuse
client.connect();

module.exports = client; // ✅ Correct export
