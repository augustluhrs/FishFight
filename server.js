/*
    ~ * ~ * ~ * 
    SERVER
    ~ * ~ * ~ * 
*/

// structured clone for node 16
const structuredClone = require('realistic-structured-clone');

//create server
let port = process.env.PORT || 8000;
let express = require('express');
const e = require('express');
let app = express();
let server = require('http').createServer(app).listen(port, function(){
  console.log('Server is listening at port: ', port);
});

//where we look for files
app.use(express.static('public'));

//create socket connection
let io = require('socket.io')(server);

//
// GAME VARIABLES
//

const D = require("./modules/defaults");
const Fish = require("./modules/fish");
const lerp = require('lerp');
const Victor = require('victor');
// let players = {}; 
let school = [];
let isBait = false;
let baitPos = {x: 0, y: 0};
// let baitVec = new Victor(0, 0);

//
// MAIN
//

setInterval( () => {
  let oldSchool = structuredClone(school);
  for (let fish of school){
    fish.swim(oldSchool, isBait, baitPos);
  }

  screen.emit("update", {school: school});
}, 10);

//
// SERVER EVENTS
//

//clients
var inputs = io.of('/')
//listen for anyone connecting to default namespace
inputs.on('connection', (socket) => {
  console.log('new input client!: ' + socket.id);

  socket.on("newFish", (data) => {
    school.push(new Fish(data));
    console.log("new fish from " + socket.id);
    console.log(data);
  });

  //listen for this client to disconnect
  socket.on('disconnect', () => {
    console.log('input client disconnected: ' + socket.id);
  });

});

var screen = io.of('/screen')
//listen for anyone connecting to default namespace
screen.on('connection', (socket) => {
  console.log('new screen client!: ' + socket.id);

  socket.on("randomFish", () => {
    addRandomFish();
  });

  socket.on("baitToggle", () => {
    isBait = !isBait;
    console.log("Bait: " + isBait);
    screen.emit("baitToggle", isBait);
  });

  socket.on("baitPos", (data) => {
    baitPos.x = lerp(baitPos.x, data.x, 0.4);
    baitPos.y = lerp(baitPos.y, data.y, 0.4);
    // let dataVec = new Victor(data.x, data.y);
    // baitVec.mix(dataVec, 0.4);
    screen.emit("baitPos", baitPos);
  });

  //listen for this client to disconnect
  socket.on('disconnect', () => {
    console.log('screen client disconnected: ' + socket.id);
  });

});

//
//  GAME FUNCTIONS
//

function addRandomFish(){
  let xAxis = Math.floor(Math.random() * 16);
  let yAxis = Math.floor(Math.random() * 16);

  let stats = {
    name: "Fish " + school.length,
    primaryColor: D.randomHex(),
    secondaryColor: D.randomHex(),
    strength: yAxis,
    defense: 16 - yAxis,
    speed: xAxis,
    size: 16 - xAxis
  }

  school.push(new Fish(stats));
  console.log("new fish");
  console.log(stats);
}
