const kafkaConfig = {
    clientId: 'rider-service',
    brokers: process.env.KAFKA_BROKERS?.split(',') || ['localhost:9093'],
    topics: {
        acceptedOrder: 'accepted-order'
    }
};

module.exports = {
    kafkaConfig
}

