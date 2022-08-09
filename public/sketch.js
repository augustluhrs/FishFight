/*
    ~ * ~ * ~ * 
    CLIENT
    ~ * ~ * ~ * 
*/

//
// ASSET LOAD
//

let font;

function preload(){
    font = loadFont('assets/MochiyPopOne-Regular.ttf');
}

//
//  SOCKET SERVER STUFF
//

//open and connect the input socket
let socket = io('/');

//listen for the confirmation of connection 
socket.on('connect', () => {
    console.log('now connected to server');
});

//
// SETUP AND VARIABLES
//

// let statsDiv, colorDiv, readyDiv, nameDiv;
let statsButton, colorButton, readyButton, nameInput;
let yesButton, noButton;
let type = "";
let state = "stats";

let xAxis = Math.floor(Math.random() * 16);
let yAxis = Math.floor(Math.random() * 16);
let fish = {
    primaryColor: randomHex(),
    secondaryColor: randomHex(),
    strength: yAxis,
    defense: 16 - yAxis,
    speed: xAxis,
    size: 16 - xAxis,
    position: {x: 0, y: 0}, //will get overwritten on server
}

let statsSlider = {
    xPos: 0, 
    yPos: 0,
    xVal: 0,
    yVal: 0,
    xCenter: 0,
    yCenter: 0,
    w: 0,
    h: 0
}

function setup(){
    createCanvas(windowWidth - 5, windowHeight - 5); //TODO better way of ensuring scrollbars don't show up
    background(82,135,39);

    //layout
    ellipseMode(CENTER);
    rectMode(CENTER);
    imageMode(CENTER);
    angleMode(RADIANS);
    textFont(font);
    textAlign(CENTER, CENTER);
    textSize(width/30);
    strokeWeight(2);

    //UI
    // nameDiv = createDiv.position()
    nameInput = createInput("FISH NAME").class("inputs").position(width/4, height / 10);
    nameInput.center("horizontal");
    statsButton = createButton("STATS").class("buttons").position(width/4, 9 * height / 10).mousePressed(() => {
        state = "stats";
    });
    colorButton = createButton("COLOR").class("buttons").position(2*width/4, 9 * height / 10).mousePressed(() => {
        state = "color";
    });
    readyButton = createButton("READY").class("buttons").position(3*width/4, 9 * height / 10).mousePressed(() => {
        state = "ready";
        yesButton.show();
        noButton.show();
        statsButton.hide();
        colorButton.hide();
        readyButton.hide();
    });
    // readyButton.hide();
    yesButton = createButton("YES").class("buttons").position(width/3, 8 * height / 10).mousePressed(() => {
        fish.name = nameInput.value();
        
        socket.emit("newFish", fish);
    });
    yesButton.hide();
    noButton = createButton("NO").class("buttons").position(2*width/3, 8 * height / 10).mousePressed(() => {
        yesButton.hide();
        noButton.hide();
        state = "stats";
        statsButton.show();
        colorButton.show();
        readyButton.show();
    });
    noButton.hide();

    //stats slider
    statsSlider = {
        xVal: fish.speed,
        yVal: fish.strength,
        xCenter: width/2,
        yCenter: 7 * height / 10,
        w: 3 * height / 10,
        h: 3 * height / 10,
        xPos: map(fish.speed, 0, 16, width/2 - 3 * height / 10 / 2, width/2 + 3 * height / 10 / 2), 
        yPos: map(fish.strength, 0, 16, 7 * height / 10 - 3 * height / 10 / 2, 7 * height / 10 + 3 * height / 10 / 2),
    }

    fish.position.x = width/2;
    fish.position.y = 4 * height / 10;

    type = checkType();
};

//
// MAIN
//

function draw(){
    background(82,135,39);
    push();
    stroke(0);
    fill(255);
    text(type, width / 2, 2 * height / 10);
    pop();

    updateFish();
    displayFish();

    if (state == "stats"){
        type = checkType();
        displayStatsSlider();
    } else if (state == "color") {


    } else if (state == "ready") {
        text("Send this fish to the Pond?", width / 2, 6 * height / 10);
    }
}

function mouseDragged(){
    //for statsSlider
    if (state == "stats"){
        let ss = statsSlider;
        if(mouseX >= ss.xCenter - ss.w / 2 &&
        mouseX <= ss.xCenter + ss.w / 2 &&
        mouseY >= ss.yCenter - ss.h / 2 &&
        mouseY <= ss.yCenter + ss.h / 2) {
            ss.xPos = mouseX;
            ss.yPos = mouseY;
            ss.xVal = map(ss.xPos, ss.xCenter - ss.w / 2, ss.xCenter + ss.w / 2, 0, 16);
            ss.yVal = map(ss.yPos, ss.yCenter - ss.h / 2, ss.yCenter + ss.h / 2, 16, 0);
        }
    }
    
}

function updateFish(){  //redundant from defaults.js
    // fish.primaryColor = randomHex(),
    // fish.secondaryColor = randomHex(),
    fish.strength = statsSlider.yVal,
    fish.defense = 16 - statsSlider.yVal,
    fish.speed = statsSlider.xVal,
    fish.size = 16 - statsSlider.xVal,
    fish.bodyLength = map(fish.size, 16, 0, 5 * 2, 100 * 2);
    fish.bodyWidth = map(fish.size, 0, 16, 5, 100);
    fish.frontFinSize = map(fish.strength, 0, 16, fish.bodyWidth * 0.1, fish.bodyWidth * 0.6);
    fish.backFinSize = map(fish.defense, 0, 16, fish.bodyLength * 0.1, fish.bodyLength * 0.6);
}

function displayFish(){
    push();
    translate(fish.position.x, fish.position.y);

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

function displayStatsSlider(){
    push();
    let ss = statsSlider;
    //background rectangle
    fill(45, 225, 194, 100);
    rect(ss.xCenter, ss.yCenter, ss.w, ss.h, 10); //rounded corners

    //axes
    stroke(0,100);
    line(ss.xCenter - ss.w / 2, ss.yCenter, ss.xCenter + ss.w / 2, ss.yCenter);
    line(ss.xCenter, ss.yCenter - ss.h / 2, ss.xCenter, ss.yCenter + ss.h / 2);

    //indicator ellipse
    stroke(0);
    fill(255);
    ellipse(ss.xPos, ss.yPos, ss.w / 12);
    pop();
}

function checkType(){
    let species = "";
    if (fish.strength < 10 && fish.defense < 10 && fish.speed < 10 && fish.size < 10){
        species = "Jack";
    } else {
        if (fish.strength > fish.size && fish.strength > fish.speed){
            species = "Strong ";
        } else if (fish.defense > fish.size && fish.defense > fish.speed){
            species = "Wary ";
        } else if (fish.speed > fish.strength && fish.speed > fish.defense){
            species = "Fast ";
        } else {
            species = "Big ";
        }
    
        if (fish.strength > 8 && fish.speed > 8){
            species += "Striker";
        } else if (fish.defense > 8 && fish.speed > 8){
            species += "Dodger";
        } else if (fish.defense > 8 && fish.size > 8){
            species += "Tank";
        } else {
            species += "Brawler ";
        }
    }
   
    return species;
}

function randomHex(){ // thanks https://css-tricks.com/snippets/javascript/random-hex-color/
    var randomColor = Math.floor(Math.random()*16777215).toString(16);
    return "#" + randomColor;
}
