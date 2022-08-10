/*
    ~ * ~ * ~ * 
    CLIENT
    ~ * ~ * ~ * 
*/

//
// ASSET LOAD
//

let water;
let bait;

function preload(){
    water = loadImage('../assets/waterBackdrop.jpg');
    bait = loadImage('../assets/bait.png');
}

//
//  SOCKET SERVER STUFF
//

//open and connect the input socket
let socket = io('/screen');

//listen for the confirmation of connection 
socket.on('connect', () => {
    console.log('now connected to server');
});

socket.on('update', (data) => {
    school = data.school;
})

socket.on('baitToggle', (data) => {
    isBait = data;
});

socket.on('baitPos', (data) => { //data is a Victor
    baitPos.x = data.x;
    baitPos.y = data.y;
});

//
// SETUP AND VARIABLES
//

let school = [];
let randomFishButton, clearFishButton;
let isBait = false;
let baitPos = {x: 0, y: 0};

function setup(){
    createCanvas(1920, 1080);
    
    //layout
    ellipseMode(CENTER);
    rectMode(CENTER);
    // imageMode(CENTER);
    angleMode(RADIANS);
    // textFont(font);
    textAlign(CENTER, CENTER);
    noStroke();
    
    // background(82,135,39);
    // image(water, width/2, height/2, windowWidth, windowHeight);

    //UI
    randomFishButton = createButton("RANDOM FISH").class("buttons").mousePressed(() => {socket.emit("randomFish")});
    clearFishButton = createButton("CLEAR ALL FISH").class("buttons").mousePressed(() => {socket.emit("clearFish")});
};

//
// MAIN
//

function draw(){
    image(water, 0, 0, windowWidth, windowHeight);

    // image(water, width/2, height/2, windowWidth, windowHeight);

    for(let fish of school){
        displayFish(fish);
    }

    if (isBait){
        image(bait, baitPos.x, baitPos.y, 60, 90);
        socket.emit("baitPos", {x: mouseX, y: mouseY});
    }
}

function displayFish(fish){
    push();

    //rotation from direction
    translate(fish.position.x, fish.position.y);
    rotate(fish.direction + PI);

    //back fin
    fill(fish.secondaryColor);
    let back = fish.backFinSize;
    let offset = fish.bodyLength / 1.8;
    triangle(-back + offset, 0, back + offset, -back, back + offset, back);

    //body
    fill(fish.primaryColor);
    ellipse(0, 0, fish.bodyLength, fish.bodyWidth);

    //front fin
    fill(fish.secondaryColor);
    let front = fish.frontFinSize / 2;
    triangle(-front, 0, front, -front, front, front);

    //eye
    fill(0);
    ellipse((-fish.bodyLength / 2) + (fish.bodyLength / 8), 0, 10, 10);

    pop();
}

function mouseClicked(){
    if (mouseY < height){ //to prevent from triggering when clicking fish button
        socket.emit('baitToggle');
    }
}
