//äquivalent zu = p5 createVector(x,y);
class Vehicle {
    constructor(x,y,ms,mf,w,h){
        this.position = createVector(x,y);
        this.acceleration = createVector(0,0);
        this.velocity = createVector(0,0);
        this.r = 3;
        this.maxspeed = ms || 4;
        this.maxforce = mf || 0.5;
        this.ellipseSize = this.r * 3;
        this.totalWidth = w;
        this.maxHeight = h;
        this.resetAcceleration = createVector(0,0);  
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
        desired.mult(this.maxspeed);
        //steering is desired minus velocity
        let steer = desired.sub(this.velocity);
        steer.limit(this.maxforce); //limit to maximum steering force
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
        this.velocity.limit(4,);
        this.position.add(this.velocity);
        //reset acceleration to 0
        this.acceleration.mult(this.resetAcceleration);
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
