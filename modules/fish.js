//
// fesh
//

// const DNA = require("./DNA");
const Victor = require("victor");
const D = require("./defaults");
const lerp = require('lerp');
// const Ecosystem = require("./ecosystem");
const Foid = require("./flocking");

class Fish {
    constructor(stats){
        this.id = stats.id || D.generate_ID();
        this.name = stats.name || "fish";
        this.age = stats.age || 0;
        this.creator = stats.creator || "anon";
        this.primaryColor = stats.primaryColor || "#000000";
        this.secondaryColor = stats.secondaryColor || "#FFFFFF";
        this.position = stats.position || new Victor(Math.random() * D.worldSize.width, Math.random() * D.worldSize.height);
        this.direction = stats.direction || 0;

        //fighting stats
        this.strength = stats.strength || 8;
        this.defense = stats.defense || 8;
        this.size = stats.size || 8;
        this.speed = stats.speed || 8;

        //flocking and display stats derived from fighting stats
        // this.r = stats.r || D.map(this.size, 0, 16, D.sizeMin, D.sizeMax);
        this.maxSpeed = stats.maxSpeed || D.map(this.speed, 0, 16, D.speedMin, D.speedMax);
        this.bodyLength = stats.bodyLength || D.map(this.size, 16, 0, D.sizeMax / 2, D.sizeMax);
        this.bodyWidth = stats.bodyLength || D.map(this.size, 0, 16, D.sizeMax / 4, D.sizeMax);
        this.frontFinSize = stats.frontFinSize || D.map(this.strength, 0, 16, this.bodyWidth * D.finMin, this.bodyWidth * D.finMax);
        this.backFinSize = stats.backFinSize || D.map(this.defense, 0, 16, this.bodyLength * D.finMin, this.bodyLength * D.finMax);

        this.foid = new Foid(this);
    }

    swim(school){
        let [vel, dir] = this.foid.run(school);
        this.position.add(vel);
        
        //to smooth jittery rotation
        if (Math.abs(this.direction - dir) > 3.14){
            if(this.direction > dir){
                dir += 6.28;
            } else {
                dir -= 6.28
            }
        }
        this.direction = lerp(this.direction, dir, 0.2);
    }

    // display(){ //client side

    // }
}

module.exports = Fish;