const mongoose=require('mongoose');

const messageSchema=new mongoose.Schema({
    message:{
        type:String,
        required:[true,"Message Field Cannot Be Empty"]
    }
})

const Message=mongoose.model('Message',messageSchema);
module.exports=Message;