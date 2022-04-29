const express = require("express"); //returns function
const socket = require("socket.io"); //function


const app = express(); //initializing the app and server ready

app.use(express.static("public")) // whenever connects to server this will route to static filess(displaying index.html)

let port = 3000;

let server = app.listen(port, () => {
    console.log("listening to port " + port);
}) //listening at port 3000

let io = socket(server); //server connection

io.on("connection", (socket) => {
    console.log("Made socket connection");

    //recieved data
    socket.on("startDraw",(data) => {
        //transfer to all connected computers
        io.sockets.emit("startDraw",data); 
    })

    socket.on("drawStroke", (data) => {
        io.sockets.emit("drawStroke", data);
    })

    socket.on("undoRedo", (data)=> {
        io.sockets.emit("undoRedo", data);
    })

}) //similar to event listener when connecting to the server




