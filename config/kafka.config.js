const kafkaConfig = {
    clientId: 'rider-service',
    brokers: process.env.KAFKA_BROKERS?.split(',') || ['localhost:9093'],
    topics: {
        acceptedOrder: 'accepted-order'
    }
};
const DummykafkaConfig={
    clientId:'seller-service',
    brokers:['localhost:9093'],
    topics:{
        acceptedOrder:'accepted-order'
    }
}

module.exports = {
    kafkaConfig,
    DummykafkaConfig
}

