//
// for utility functions and misc global variables
//

const worldSize = {
    width: 1920,
    height: 1080
}

//fish display scales (ba dum tss)
// const finMin = 10;
// const finMax = 100;
const finMin = .1;
const finMax = .6;
const sizeMin = 5;
const sizeMax = 100; //will be doubled in display
const speedMin = .1;
const speedMax = 2;

function map(n, start1, stop1, start2, stop2) {
    const newval = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
    return newval;
}

function generate_ID() { //grabbed from https://gist.github.com/gordonbrander/2230317 -- thanks!
    return '_' + Math.random().toString(36).substr(2, 9);
}

//thanks to Tim Down https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
}

function randomHex(){ // thanks https://css-tricks.com/snippets/javascript/random-hex-color/
    var randomColor = Math.floor(Math.random()*16777215).toString(16);
    return "#" + randomColor;
}

exports.worldSize = worldSize;
exports.map = map;
exports.generate_ID = generate_ID;
exports.hexToRgb = hexToRgb;
exports.randomHex = randomHex;
exports.sizeMin = sizeMin;
exports.sizeMax = sizeMax;
exports.finMin = finMin;
exports.finMax = finMax;
exports.speedMin = speedMin;
exports.speedMax = speedMax;
