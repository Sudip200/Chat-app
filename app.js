const { time } = require("console");
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const socketio = require("socket.io");

const app=express()
const server =http.createServer(app)
const io=socketio(server)

const PORT = process.env.PORT || 3000;
const db=[{
 user:"Sudipto",
 message:"Hello",
 time:new Date()
}]

//app.use(express.static(__dirname+"public"))
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
  });
  
io.on('connection',(socket)=>{
    console.log("Connected")
     db.map((messages)=>{
        socket.emit("load messages",messages)
     })

   socket.on("new message",(data)=>{
    const {user,message}=data
    const newMessage = {
        user,
        message,
        time: new Date(),
      };
       db.push(newMessage)
       io.emit("new message",newMessage)
    //   newMessage.save((err) => {
    //     if (err) console.log(err);
    //     io.emit("new message", newMessage);
    //   });
})
   socket.on("disconnect", () => {
    console.log("User disconnected");
  })
}
)
server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });