let socket = io();
let settings={};

let noiseValue = 0.1;

let particleColor = 1;
let newFlow = false;

//draws flowfield when - debug = true
let debug = false;

function setup(){
    createCanvas(windowWidth,windowHeight);
    background(25,25,25);
    pixelDensity(2); //retina sollte 2 haben

    settings.w = width;
    settings.h = height;
    settings.vehicles = [];

    //zum local laufen lassen
    //socket=io.connect("http://localhost:3000");

    socket.emit('get',settings); //einmalige Anmeldung

    socket.on('get',getSettings);
    socket.on('update',updateSettings);
    socket.on('updateColor',updaateColor);
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

function updaateColor(data){
    particleColor = data;
}
function draw(){
    background(25,25,25,2);
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
        //draw ellipse
        if (particleColor === 0){
            fill(255,231,70);
        } else if (particleColor === 1){
            fill(255,89,100);
        } else if (particleColor === 2){
            fill(153,213,201);
        }
        else if (particleColor === 3){
            fill(229,99,153);
        }
            noStroke();
            ellipseMode(CENTER)
            ellipse(0, 0, vehicle.r*2)
            noFill();
            if (particleColor === 0){
                stroke(255,231,70);
            } else if (particleColor === 1){
                stroke(255,89,100);
            } else if (particleColor === 2){
                stroke(153,213,201);
            }
            else if (particleColor === 3){
                stroke(229,99,153);
            }
            strokeWeight(1);
            bezier(0,-vehicle.r*2,0,vehicle.r*2,0,vehicle.r*2,map(noise(noiseValue),0,1,-vehicle.r*4,vehicle.r*4),vehicle.r*6);
            pop();
            noiseValue += 0.01;
        }
    }
}

function keyPressed(){
    if (keyCode === 82){//R
        if(particleColor===0){
            particleColor ++;
        }else if(particleColor ==1){
            particleColor++
        }else if(particleColor ==2){
            particleColor++
        }else if(particleColor ==3){
            particleColor = 0;
        }
        socket.emit('color',particleColor);
    }
    if (keyCode === 70){ //F
        newFlow = true;
        socket.emit('newFlowField',newFlow);
        newFlow = false;
    }
}