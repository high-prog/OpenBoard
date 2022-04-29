let canvas = document.querySelector("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


let pencilColors = document.querySelectorAll(".pencil-color");
let pencilWidthElem = document.querySelector(".pencil-width");
let eraserWidthElem = document.querySelector(".eraser-width");
let pencilColor = "red";
let eraserColor = "white";
let pencilWidth = pencilWidthElem.value;
let eraserWidth = eraserWidthElem.value
let download = document.querySelector("#download");
let undo = document.querySelector("#undo");
let redo = document.querySelector("#redo");


let undoRedoTracker = []; // Data 
let track = 0; //represent which action from to tracker array;


let mousedown = false;
//API
let tool = canvas.getContext('2d');

tool.strokeStyle = pencilColor;
tool.lineWidth = pencilWidth;

//when clicked mouse button beginPath and when mouse moves fill that path
canvas.addEventListener("mousedown", (e) => {
    mousedown = true;
    // startDraw({
    //     x: e.clientX - 1 ,
    //     y: e.clientY - 1
    // });

    let data = {
        x: e.clientX - 1 ,
        y: e.clientY - 1
    }
    socket.emit("startDraw", data); //sending to server
});

canvas.addEventListener("mousemove", (e) => {
    if (mousedown) {

        let data = {
            x: e.clientX -1 ,
            y: e.clientY -1 ,
            color : eraserFlag ? eraserColor : pencilColor,
            width : eraserFlag ? eraserWidth : pencilWidth 
        }
        socket.emit("drawStroke",data);
        // drawStroke({
        //     x: e.clientX -1 ,
        //     y: e.clientY -1 ,
        //     color : eraserFlag ? eraserColor : pencilColor,
        //     width : eraserFlag ? eraserWidth : pencilWidth 
        // });
    }
});
canvas.addEventListener("mouseup", (e) => {
    mousedown = false;

    let url = canvas.toDataURL();
    undoRedoTracker.push(url);
    track = undoRedoTracker.length-1;
})

function startDraw(strokeObj) {
    tool.beginPath();
    tool.moveTo(strokeObj.x, strokeObj.y); //clientX => horizontal value of mouse similarly clientY
}

function drawStroke(strokeObj) {
    tool.strokeStyle = strokeObj.color;
    tool.lineWidth = strokeObj.width;
    tool.lineTo(strokeObj.x, strokeObj.y);
    tool.stroke();
}

pencilColors.forEach((colorElem) => {
    colorElem.addEventListener("click", (e) => {
        eraserFlag - false;
        let color = colorElem.classList[0];
        pencilColor = color;
        tool.strokeStyle = color;
    })
})

pencilWidthElem.addEventListener("change", (e) => {
    pencilWidth = pencilWidthElem.value;
    tool.lineWidth = pencilWidth;
})

eraserWidthElem.addEventListener("change", (e) => {
    eraserWidth = eraserWidthElem.value;
    tool.lineWidth = eraserWidth;
})

eraser.addEventListener("click", (e) => {
    if (eraserFlag) {
        tool.strokeStyle = "white";
        tool.lineWidth = eraserWidth;
    } else {
        tool.strokeStyle = pencilColor;
        tool.lineWidth = pencilWidth;
    }
})

download.addEventListener("click",(e)=>{

    let url = canvas.toDataURL();


    let a = document.createElement("a");
    a.href = url;
    a.download = "board.jpeg";
    a.click();
})

undo.addEventListener("click",(e)=>{
    if(track>0) track--;
    let data = {
        trackValue : track,
        undoRedoTracker,   
    }
    socket.emit("undoRedo", data);
})

redo.addEventListener("click",(e)=>{
    if(track < undoRedoTracker.length-1) track++;
    let data = {
        trackValue : track,
        undoRedoTracker
    }
    socket.emit("undoRedo",data);
})

function undoRedo(trackObj){
    track = trackObj.trackValue;
    undoRedoTracker = trackObj.undoRedoTracker;
    let url = undoRedoTracker[track];

    let img = new Image(); //creates new Image  reference element
    img.src = url;
    img.onload = (e) =>{
        tool.drawImage(img, 0 , 0, canvas.width,canvas.height);
    }
}

socket.on("startDraw",(data)=>{
    //data represents data from server
    startDraw(data);
})

socket.on("drawStroke", (data) => {
    drawStroke(data);
})

socket.on("undoRedo", (data)=> {
    undoRedo(data);
})