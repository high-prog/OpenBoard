let optionsCont = document.querySelector(".options-cont");
let toolsCont = document.querySelector(".tools-cont");
let pencilTool = document.querySelector(".pencil-tool");
let eraserTool = document.querySelector(".eraser-tool");
let pencil = document.querySelector("#pencil");
let eraser = document.querySelector("#eraser");
let sticky = document.querySelector("#stickyNote");
let upload = document.querySelector("#upload");


let pencilFlag = false;
let eraserFlag = false;
let optionFlag = true; //true => tools are visible vice versa

optionsCont.addEventListener("click",(e)=>{
    optionFlag = !optionFlag;
    
    
    if(optionFlag){
        openTools();
    }else{
        closeTools();
    }
})

function openTools(){
    let iconElem = optionsCont.children[0];
    iconElem.classList.remove("fa-bars");
    iconElem.classList.add("fa-xmark");
    toolsCont.style.display = "flex";
    // pencilTool.style.display = "block";
    // eraserTool.style.display = "flex";

}

function closeTools(){
    let iconElem = optionsCont.children[0];
    iconElem.classList.remove("fa-xmark");
    iconElem.classList.add("fa-bars");
    toolsCont.style.display = "none";
    pencilTool.style.display = "none";
    eraserTool.style.display = "none";
}

pencil.addEventListener("click",(e)=>{
    pencilFlag = !pencilFlag;
    eraserFlag = false;
    if(pencilFlag){
        pencilTool.style.display = "block";
    }else{
        pencilTool.style.display = "none";
    }
})

eraser.addEventListener("click",(e)=>{
    eraserFlag = !eraserFlag;
    if(eraserFlag){
         eraserTool.style.display = "flex";
    }else{
        eraserTool.style.display = "none";
    }
})

upload.addEventListener("click",(e) => {
    //open file explorer
    let input = document.createElement("input");
    input.setAttribute("type", "file");
    input.click();

    input.addEventListener("change",(e)=>{
        let file = input.files[0];
        let url = URL.createObjectURL(file);

        let stickyCont = document.createElement("div");
    stickyCont.setAttribute("class","sticky-cont");
    stickyCont.innerHTML = `
    <div class="header">
        <div class="minimize"></div>
        <div class="remove"></div>
    </div>
    <div class="note-cont">
        <img src = "${url}"/>
    </div>
    `;

    document.body.appendChild(stickyCont);


    let minimize = stickyCont.querySelector(".minimize");
    let remove = stickyCont.querySelector(".remove");
    noteActions(minimize, remove, stickyCont);

    stickyCont.onmousedown = (e) => {
        dragnDrop(stickyCont,e);
    };

    stickyCont.ondragstart = () =>{
        return false;
    }


    })

})

sticky.addEventListener("click",(e)=>{
    let stickyCont = document.createElement("div");
    stickyCont.setAttribute("class","sticky-cont");
    stickyCont.innerHTML = `
    <div class="header">
        <div class="minimize"></div>
        <div class="remove"></div>
    </div>
    <div class="note-cont">
        <textarea></textarea>
    </div>
    `;

    document.body.appendChild(stickyCont);


    let minimize = stickyCont.querySelector(".minimize");
    let remove = stickyCont.querySelector(".remove");
    noteActions(minimize, remove, stickyCont);

    stickyCont.onmousedown = (e) => {
        dragnDrop(stickyCont,e);
    };

    stickyCont.ondragstart = () =>{
        return false;
    }


});



function noteActions(minimize, remove, stickyCont){
    remove.addEventListener("click",(e)=>{
        stickyCont.remove();
    });

    minimize.addEventListener("click",(e)=>{
        let noteCont = stickyCont.querySelector(".note-cont")
        let display = getComputedStyle(noteCont).getPropertyValue("display");
        if(display === "none"){
            noteCont.style.display = "block";
        }else{
            noteCont.style.display = "none";
        }
    })
}



function dragnDrop(element , event){
    let shiftX = event.clientX - element.getBoundingClientRect().left;
    let shiftY = event.clientY - element.getBoundingClientRect().top;
  
    element.style.position = 'absolute';
    element.style.zIndex = 1000;
  
    moveAt(event.pageX, event.pageY);
  
    // moves the ball at (pageX, pageY) coordinates
    // taking initial shifts into account
    function moveAt(pageX, pageY) {
        element.style.left = pageX - shiftX + 'px';
        element.style.top = pageY - shiftY + 'px';
    }
  
    function onMouseMove(event) {
      moveAt(event.pageX, event.pageY);
    }
  
    // move the ball on mousemove
    document.addEventListener('mousemove', onMouseMove);
  
    // drop the ball, remove unneeded handlers
    element.onmouseup = function() {
      document.removeEventListener('mousemove', onMouseMove);
      element.onmouseup = null;
    };
  
}