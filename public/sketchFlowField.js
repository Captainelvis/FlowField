let socket;
let settings={};

//draws flowfield when - debug = true
let debug = false;

function setup(){
    createCanvas(windowWidth,windowHeight);
    background(255);
    pixelDensity(1); //retina sollte 2 haben

    settings.w = width;
    settings.h = height;
    settings.vehicles = [];

    // socket=io.connect("http://localhost:3000");
    socket=io.connect("http://10.155.117.116:3000");
    socket.emit('get',settings); //einmalige Anmeldung

    socket.on('get',getSettings);
    socket.on('update',updateSettings);
}

function getSettings(data){
    settings=data;
}

function updateSettings(data){
    settings.vehicles = data;

    settings.flowField = data;
    if (debug == true) {
        displayFlow();
    }
}

function draw(){
    background(255,10);
    displayVehicles();
}
//draw every vector
function displayFlow(){
    let localX = 0; //wird benötigt damit nicht neben dem Screen gezeichnet wird
    for (let i = floor(settings.offsetbeginX/settings.resolution); i < floor(settings.offsetendX/settings.resolution); i++){
        for(let j = 0; j< settings.rows; j++){
            this.drawVectorFlow(settings.field[i][j], localX * settings.resolution, j * settings.resolution, settings.resolution-1);
        }
        localX ++;
    }
}
function drawVectorFlow(v,x,y,scayl){
    let vec = createVector(v.x,v.y); 
    push();
    //translate location to render Vector
    translate(x,y);
    stroke(0,100);
    //call vector heading function to get direction (pointing to right is heading of 0)
    rotate(vec.heading());
    //calculate length of vector & scale it
    let len = vec.mag() * scayl;
    //draw 
    stroke(0);
    strokeWeight(2);
    line(0,0,len,0);
    pop();
}

function displayVehicles(){
    for (let i = 0; i< settings.vehicles.length; i++){
        let vehicle = settings.vehicles[i];
        //check if position is on screen
        if (vehicle.position.x > settings.offsetbeginX && vehicle.position.x < settings.offsetendX){
            //draw triangle rotated in direction of velocity
            let localPosX = vehicle.position.x - settings.offsetbeginX;
            let veloVect = createVector(vehicle.velocity.x,vehicle.velocity.y);
            let theta = veloVect.heading() + PI / 2;
    
            push();
            translate(localPosX, vehicle.position.y);
            rotate(theta);
            fill(0);
            noStroke();
            ellipseMode(CENTER)
            ellipse(0, 0, vehicle.r)
//Draw SpermienSchwanz
            // noFill();
            // stroke(0,100,0);
            // strokeWeight(0.3);
            //bezier(0,-this.r*2,0,this.r*2,0,this.r*2,map(noise(this.xOffNoise),0,1,-this.r*4,this.r*4),this.r*6);
            pop();
        }
    }
}