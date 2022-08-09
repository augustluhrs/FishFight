//
//  the flocking methods that the fish use to move in a school
//

const Victor = require('victor');
// const Fish = require('./fish');
const D = require('./defaults');

class Foid { //fish boid
    constructor(fish){
        this.acceleration = new Victor(0, 0);
        this.velocity = new Victor(D.map(Math.random(), 0, 1, -1, 1), D.map(Math.random(), 0, 1, -1, 1));
        this.position = fish.position;
        // this.r = fish.r;
        this.perceptionRadius = fish.perceptionRadius || 100;
        this.maxSpeed = fish.maxSpeed;
        this.maxForce = fish.maxForce || 0.05;
        this.desiredSeparation = fish.desiredSeparation || 25; //based on strength
        this.separationBias = fish.separationBias || 5;
        this.desiredFlockSize = fish.desiredFlockSize || 100;
        this.alignmentBias = fish.alignmentBias || 1;
        this.cohesionBias = fish.cohesionBias || 1.5;
        // this.hunger = fish.hunger || 10; //to mult food seeking
    }

    run (school) { //main function
        this.flock(school);
        // let snack = this.graze(surroundings.foodAround);
        // let mate = this.cruise(self, surroundings.neighbors); //findMate() -- needs self for mating info
        this.bounds();
        this.update();
        this.position.add(this.velocity);
        return [this.velocity, this.velocity.direction()];
    }

    flock (school) {
        let separation = this.separation(school);
        let alignment = this.alignment(school);
        let cohesion = this.cohesion(school);

        separation.multiply(new Victor(this.separationBias, this.separationBias));
        alignment.multiply(new Victor(this.alignmentBias, this.alignmentBias));
        cohesion.multiply(new Victor(this.cohesionBias, this.cohesionBias));

        this.applyForce(separation);
        this.applyForce(alignment);
        this.applyForce(cohesion);
    }

    bounds() {
        if (this.position.x > D.worldSize.width - 10) {this.applyForce(new Victor(-1, 0))}
        if (this.position.x < 10) {this.applyForce(new Victor(1, 0))}
        if (this.position.y > D.worldSize.height - 10) {this.applyForce(new Victor(0, -1))}
        if (this.position.y < 10) {this.applyForce(new Victor(0, 1))}
    }

    update() {
        this.velocity.add(this.acceleration);
        this.velocity = this.limit(this.velocity, this.maxSpeed);
        this.acceleration.multiply(new Victor(0, 0));
    }

    applyForce (force) {
        //could add mass or other things later, redundant for now
        this.acceleration.add(force);
    }

    limit (vector, max) { //DIY p5.Vector.limit since Victor.limit isn't the same
        //normalize then mult by max
        vector.normalize();
        vector.multiply(new Victor(max, max));
        return vector;
    }

    separation (school) {
        let steer = new Victor(0, 0);
        let count = 0;
        //for every foid, check if too close
        for (let fish of school) {
            let d = this.position.distance(fish.position);
            if (d > 0 && d < this.desiredSeparation) {
                let diff = this.position.clone();
                diff.subtract(fish.position);
                diff.divide(new Victor(d, d));
                steer.add(diff);
                count++;
            }
        }

        if (count > 0) {
            steer.divide(new Victor(count, count));
        }

        if (steer.magnitude() > 0) {
            steer.normalize();
            steer.multiply(new Victor(this.maxSpeed, this.maxSpeed));
            steer.subtract(this.velocity);
            steer = this.limit(steer, this.maxForce);
        }

        return steer;
    }

    alignment (school) {
        //maybe the biggest fish eventually "lead" the schools?
        let sum = new Victor(0, 0);
        let count = 0;
        for (let fish of school) {
            let d = this.position.distance(fish.position);
            if (d > 0 && d < this.desiredFlockSize) {
                sum.add(fish.foid.velocity);
                count++;
            }
        }

        if (count > 0) {
            sum.divide(new Victor(count, count));
            sum.normalize();
            sum.multiply(new Victor(this.maxSpeed, this.maxSpeed));
            let steer = sum.subtract(this.velocity);
            steer = this.limit(steer, this.maxForce);
            
            return steer;
        } else {
            return new Victor(0, 0);
        }
    }

    cohesion (critters) { 
        let sum = new Victor(0, 0);
        let count = 0;
        for (let critter of critters) {
            let d = this.position.distance(critter.position);
            if (d > 0 && d < this.desiredFlockSize) {
                sum.add(critter.position);
                count++;
            }
        }

        if (count > 0) {
            sum.divide(new Victor(count, count));
            return this.seek(sum)
        } else {
            return new Victor(0, 0);
        }
    }

    seek (target) {
        let desired = target.subtract(this.position);
        desired.normalize();
        desired.multiply(new Victor(this.maxSpeed, this.maxSpeed));
        let steer = desired.subtract(this.velocity);
        steer = this.limit(steer, this.maxForce);

        return steer;
    }
}

module.exports = Foid;
