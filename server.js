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
// let players = {}; 
let school = [];

//
// MAIN
//

setInterval( () => {
  let oldSchool = structuredClone(school);
  for (let fish of school){
    fish.swim(oldSchool);
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
    strength: xAxis,
    defense: 16 - xAxis,
    speed: yAxis,
    size: 16 - yAxis
  }

  school.push(new Fish(stats));
  console.log("new fish");
  console.log(stats);
}
