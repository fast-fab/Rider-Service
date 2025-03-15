const {ConsumingRiderClass}=require("../kafka/consume.kafka")
const consume=new ConsumingRiderClass()

async function consumingMessages(){
    let count=0;
    const a=await consume.consumerfunction()
    console.log("count:",count,typeof a)
    console.log("count:",count,JSON.parse(a))
}

consumingMessages()