const http= require('http');
const express= require('express');
const cors= require('cors');
const socketIO= require('socket.io');

const app=express();
const server=http.createServer(app);
const io=socketIO(server);

const users=[{}];
app.use(cors());
app.get("/",(req,res)=>{
    res.send("Running From server")
}) 

io.on("connection",(socket)=>{
    console.log("New Connection");

    socket.on('joined',({loggedInUser})=>{
        users[socket.id]=loggedInUser.name;
        socket.broadcast.emit('userJoined',{user:'Admin:',message:`${users[socket.id]} Has Joined` });
        socket.emit('welcome',{user:'Admin:',message:`welcome to the chat,${users[socket.id]}`})
    });
    socket.on('message',({message,id})=>{
        io.emit('sendMessage',{user:users[id],message,id})
    });
    socket.on('disconnected',()=>{
        socket.broadcast.emit('userLeft',{user:'Admin:',message:`${users[socket.id]} Has Left` });
        console.log('user left');
    });
   
   
});  












const port = 4500||process.env.PORT;
server.listen(port,()=>{
    console.log(`server working on http://localhost:${port}`);
})