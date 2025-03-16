const { ConsumingRiderClass } = require("../kafka/consume.kafka");
const consume = new ConsumingRiderClass();

async function consumingMessages() {
    try {
        const message = await consume.consumerfunction();
    }catch(e){
        console.log("error:",e)
        return "error consuming"
    }
}

consumingMessages();
