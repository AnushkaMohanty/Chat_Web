const express=require('express');
const path=require('path');
const app=express();
const bodyParser=require('body-parser');
const Message=require('./models/message');
const http=require('http').Server(app);
const io=require('socket.io')(http);
const mongoose=require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/chat-app',{
    useNewUrlParser:true
});
const db=mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once("open",()=>{
    console.log("database connected");
})
io.on('connection',()=>{
    console.log('a user is connected');
})
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}))
app.use(express.static(__dirname));
app.set('views',path.join(__dirname,'views'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'interface.html'));
});
app.get('/messages',async(req,res)=>{
try{
   const messages=await Message.find({});
   res.send(messages);
}
catch(err){
    console.error('error fetching messages:',err);
    res.status(500).send('error fetching mssg');
}
})
app.post('/messages',async(req,res)=>{
try{
    const message=new Message(req.body);
    await message.save();
    io.emit('message',req.body);
    res.sendStatus(200);
}
catch(err){
    console.error('error saving message',err);
    res.status(500).send('error saving mssg');
}
})
http.listen(3000, ()=>{
    console.log("LISTENING ON PORT 3000");
})