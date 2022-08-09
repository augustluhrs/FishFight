/*
    ~ * ~ * ~ * 
    CLIENT
    ~ * ~ * ~ * 
*/

//
//  SOCKET SERVER STUFF
//

//open and connect the input socket
let socket = io('/');
let playerID;

//listen for the confirmation of connection 
socket.on('connect', () => {
    console.log('now connected to server');
    playerID = socket.id;
});

function setup(){
    createCanvas(windowWidth - 5, windowHeight - 5); //TODO better way of ensuring scrollbars don't show up
    background(82,135,39);
    // image(forest, width/2, height/2, windowWidth, windowHeight);

    //layout
    rectMode(CENTER);
    imageMode(CENTER);
    angleMode(RADIANS);
    // textFont(font);
    textAlign(CENTER, CENTER);
    strokeWeight(2);
};

function draw(){

}