let board;
let boardWidth=750;
let boardHeight=250;
let context;

//dino
let dinoWidth=88;
let dinoHeight=94;
let dinoX=50;
let dinoY=boardHeight-dinoHeight;
let dinoImg;

let dino={
    x :dinoX,
    y :dinoY,
    width : dinoWidth,
    height : dinoHeight
}


// cactus
let cactusArray=[];

let cactus1Width=34;
let cactus2Width=69;
let cactus3Width=102;

let cactusHeight=70;
let cactusX=700;
let cactusY=boardHeight-cactusHeight;

let cactus1Img;
let cactus2Img;
let cactus3Img;

//physics
let velocityX=-8;//cactus moving left speed
let velocityY=0;
let gravity=.4;

let gameOver=false;
let score=0;

window.onload=function(){
    board=document.getElementById("board");
    board.height=boardHeight;
    board.width=boardWidth;

    context=board.getContext("2d");//used for drawing on the board
    //draw initial dinosaur
    // context.fillStyle="green";
    // context.fillRect(dino.x,dino.y,dino.width,dino.height);

    dinoImg=new Image();
    dinoImg.src="./images/dino.png";
    dinoImg.onload=function(){
        context.drawImage(dinoImg,dino.x,dino.y,dino.width,dino.height);
    }
    
    cactus1Img=new Image();
    cactus1Img.src="./images/cactus1.png";

    cactus2Img=new Image();
    cactus2Img.src="./images/cactus2.png";

    cactus3Img=new Image();
    cactus3Img.src="./images/cactus3.png";

    requestAnimationFrame(update);
    setInterval(placeCactus,1000);//1000 millseconds=1sec
    
    document.addEventListener("keydown",moveDino);
}

function update(){
    requestAnimationFrame(update);
    if(gameOver){
        return ;
    }
    context.clearRect(0,0,board.width,board.height);
    //dino
    velocityY+=gravity;
    dino.y=Math.min(dino.y+velocityY,dinoY);

    context.drawImage(dinoImg,dino.x,dino.y,dino.width,dino.height);

    //cactus
    for(let i=0; i < cactusArray.length ; i++){
        let cactus=cactusArray[i];
        cactus.x+=velocityX;
        context.drawImage(cactus.img,cactus.x,cactus.y,cactus.width,cactus.height);

        if(detectCollision(dino,cactus)){
            gameOver=true;
            dinoImg.src="./images/dino-dead.png";
            dinoImg.onload=function(){
                context.drawImage(dinoImg,dino.x,dino.y,dino.width,dino.height);
            }

        }
    }
    //score
    context.fillStyle="black";
    context.font="20px courier";
    score++;
    context.fillText(score,5,20);
}



function moveDino(e){
    if(gameOver){
        return ;
    }
    if((e.code =="Space" ||e.code=="ArrowUp") &&dino.y==dinoY){
        velocityY=-10;
    }

}

function placeCactus(){
    if(gameOver){
        return ;
    }
    //place cactus
    let cactus={
        img:null,
        x : cactusX,
        y :cactusY,
        width : null,
        height : cactusHeight
    }
    
    let placeCactusChance=Math.random();//0 - 0.9999...
    if(placeCactusChance>.90){
        cactus.img=cactus3Img;
        cactus.width=cactus3Width;
        cactusArray.push(cactus);
    }
    else if(placeCactusChance>.70){//we get cactus 2
        cactus.img=cactus2Img;
        cactus.width=cactus2Width;
        cactusArray.push(cactus);
    }
    else if(placeCactusChance>.50){//we get cactus 2
        cactus.img=cactus1Img;
        cactus.width=cactus1Width;
        cactusArray.push(cactus);
    }
    
    if(cactusArray.length>5){
        cactusArray.shift();//remove the first element so the their is no limit in the memory
    }

}

function detectCollision(a,b){
    return a.x<b.x+b.width &&//a's top corner doesn't reach b's top right corner
           a.x+a.width>b.x &&//a's top right corner passes b's top left corner
           a.y<b.y +b.height&&//a's top left corner doesn't reach b's bottom left corner
           a.y+a.height>b.y//a's bottom left corner passes b's top left corner
}

