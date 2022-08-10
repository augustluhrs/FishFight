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
let canvas;
let statsDiv, colorDiv, readyDiv, nameDiv, yesDiv, noDiv;
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

//from defaults.js
const finMin = 3;
const finMax = 40;
const widthMin = 10;
const widthMax = 80;
const lengthMin = 50;
const lengthMax = 100;

function setup(){
    canvas = createCanvas(windowWidth - 5, windowHeight - 5); //TODO better way of ensuring scrollbars don't show up
    canvas.id("canvas");
    background(82,135,39);

    //layout
    ellipseMode(CENTER);
    rectMode(CENTER);
    imageMode(CENTER);
    angleMode(RADIANS);
    textFont(font);
    textAlign(CENTER, CENTER);
    textSize(width/40);
    strokeWeight(2);

    //UI
    // nameDiv = createDiv("").position(0, height / 10).size(width, height / 10).class("divs").id("nameDiv");
    // nameInput = createInput("FISH NAME").class("inputs").parent("nameDiv");
    nameInput = createInput("FISH NAME").class("inputs").position(0, 0.5 * height / 10).size(width/2, height/10);
    nameInput.center("horizontal");
    statsDiv = createDiv("").id("statsDiv").class("divs").position(0, 9 * height/10).size(width/3, height/10);
    statsButton = createButton("STATS").class("buttons").mousePressed(() => {
        state = "stats";
    });
    statsButton.size(width/7, height/14).parent("statsDiv");
    // statsButton.size(width/7, height/14).parent("statsDiv").center("horizontal");
    colorDiv = createDiv("").id("colorDiv").class("divs").position(width/3, 9 * height/10).size(width/3, height/10);
    // colorDiv.center("horizontal");
    colorButton = createButton("COLOR").class("buttons").mousePressed(() => {
        state = "color";
    });
    // colorButton.size(width/7, height/14).parent("colorDiv");
    colorButton.size(width/7, height/14).parent("colorDiv");
    // colorButton.center("horizontal");
    readyDiv = createDiv("").id("readyDiv").class("divs").position(2*width/3, 9 * height/10).size(width/3, height/10);
    readyButton = createButton("READY").class("buttons").mousePressed(() => {
        state = "ready";
        yesButton.show();
        noButton.show();
        statsButton.hide();
        colorButton.hide();
        readyButton.hide();
    });
    readyButton.size(width/7, height/14).parent("readyDiv");

    yesDiv = createDiv("").id("yesDiv").class("divs").position(0, 7 * height/10).size(width/2, height/10);
    yesButton = createButton("YES").class("buttons").parent("yesDiv").size(width/7, height/14).mousePressed(() => {
        fish.name = nameInput.value();
        socket.emit("newFish", fish);
    });
    yesButton.hide();
    noDiv = createDiv("").id("noDiv").class("divs").position(width/2, 7 * height/10).size(width/2, height/10);
    noButton = createButton("NO").class("buttons").parent("noDiv").size(width/7, height/14).mousePressed(() => {
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
        yCenter: 6.5 * height / 10,
        w: 3 * height / 10,
        h: 3 * height / 10,
        xPos: map(fish.speed, 0, 16, width/2 - 3 * height / 10 / 2, width/2 + 3 * height / 10 / 2), 
        yPos: map(fish.strength, 0, 16, 6.5 * height / 10 + 3 * height / 10 / 2, 6.5 * height / 10 - 3 * height / 10 / 2),
    }

    fish.position.x = width/2;
    fish.position.y = 3.5 * height / 10;

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
    textSize(width/20);
    text("the", width / 2, 1.75 * height / 10);
    textSize(width/15);
    text(type, width / 2, 2.25 * height / 10);
    pop();

    updateFish();
    displayFish();

    if (state == "stats"){
        type = checkType();
        displayStatsSlider();
    } else if (state == "color") {


    } else if (state == "ready") {
        push();
        textSize(width/20);
        text("Send this fish to the Pond?", width / 2, 6 * height / 10);
        pop();
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
    fish.bodyLength = map(fish.size, 16, 0, lengthMin, lengthMax);
    fish.bodyWidth = map(fish.size, 0, 16, widthMin, widthMax);
    fish.frontFinSize = map(fish.strength, 0, 16, finMin, finMax);
    fish.backFinSize = map(fish.defense, 0, 16, finMin, finMax);
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
    ellipse((-fish.bodyLength / 2) + (fish.bodyLength / 8), 0, 10, 10);

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

    //labels
    textSize(width/20);
    textAlign(CENTER, BOTTOM);
    text("Strength", ss.xCenter, ss.yCenter - ss.h / 1.9);
    textAlign(LEFT, CENTER);
    text("Speed", ss.xCenter + ss.w / 1.9, ss.yCenter);
    textAlign(CENTER, TOP);
    text("Defense", ss.xCenter, ss.yCenter + ss.h / 1.9);
    textAlign(RIGHT, CENTER);
    text("Bulk",  ss.xCenter - ss.w / 1.9, ss.yCenter);

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
