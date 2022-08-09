/*
    ~ * ~ * ~ * 
    CLIENT
    ~ * ~ * ~ * 
*/

//
// ASSET LOAD
//

let water;

function preload(){
    water = loadImage('../assets/waterBackdrop.jpg')
}

//
//  SOCKET SERVER STUFF
//

//open and connect the input socket
let socket = io('/screen');
let playerID;

//listen for the confirmation of connection 
socket.on('connect', () => {
    console.log('now connected to server');
    playerID = socket.id;
});

socket.on('update', (data) => {
    school = data.school;
})

//
// SETUP AND VARIABLES
//

let school = [];
let randomFishButton;

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
    randomFishButton = createButton("RANDOM FISH").mousePressed(() => {socket.emit("randomFish")});
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
    ellipse((-fish.bodyLength / 2) + (fish.bodyLength / 10), 0, 10, 10);
    
    pop();
}
