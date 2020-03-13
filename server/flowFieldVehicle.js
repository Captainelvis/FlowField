//äquivalent zu = p5 createVector(x,y);
var Victor = require('victor');

class Vehicle {
    constructor(x,y,ms,mf,w,h){
        this.position = new Victor(x,y);
        this.acceleration = new Victor(0,0);
        this.velocity = new Victor(0,0);
        this.r = 4;
        this.maxspeed = ms || 4;
        this.maxforce = mf || 0.5;
        this.ellipseSize = this.r * 3;
        this.xOffNoise = 0.1;
        this.colorNoise = 0.1;
        this.totalWidth = w;
        this.maxHeight = h;
        this.resetAcceleration = new Victor(0,0);  
    }

    run(){
        this.update();
        this.borders();
    }
    //following flowfield
    follow(flow){
        //what is the vector at that spot in the flowfield
        let desired = flow.lookup(this.position);
        //scale it up by maxspeed
        desired.multiplyScalar(this.maxspeed);
        //steering is desired minus velocity
        let steer = desired.subtract(this.velocity);
        steer.limit(this.maxforce,0.1); //limit to maximum steering force
        this.applyForce(steer);
    }

    applyForce(force){
        //could add Mass A=F/M
        this.acceleration.add(force);
    }

    update(){
        //update velocity
        this.velocity.add(this.acceleration);
        //limit speed
        this.velocity.limit(4,0.75);
        this.position.add(this.velocity);
        //reset acceleration to 0
        this.acceleration.multiply(this.resetAcceleration);
        this.xOffNoise += 0.02;
        this.colorNoise += 0.01;
    }

    borders(){
        if (this.position.x < -this.r) {
            this.position.x = this.totalWidth + this.r;
        }
        if (this.position.y < -this.r) {
            this.position.y = this.maxHeight + this.r;
        }
        if (this.position.x > this.totalWidth + this.r) {
            this.position.x = -this.r;
        }
        if (this.position.y > this.maxHeight + this.r) {
            this.position.y = -this.r;
        }
    }
}

module.exports = Vehicle;