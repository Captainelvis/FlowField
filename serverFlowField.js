//FlowField Class einbinden
var FlowField = require('./server/flowField.js');
var flowField = [];
//Vehicle Class einbinden
var Vehicle = require('./server/flowFieldVehicle.js');
var vehicles = [];

//Socket server Zeug
let port = process.env.PORT || 3000;
var express = require('express');
var app = express();

const http = require('http').createServer(app);
const path = require('path');
const publicPath = path.join(__dirname + '/public');
app.use(express.static(publicPath));
http.listen(port, () => "App listening on Port: " + port)
//console.log("my server is running"); //connected
var io = require('socket.io')(http);
io.on('connection', newConnection);
let settings={}

//Allgemeine Variablen für das FLowField
var maxH = 0;
var totalW = 0;
var resolution = 15;
var cols;
var rows;
var field;
//Anzahl particle pro CLient
var vehicleNumber = 4;
//Anzahl Clients
var totalClients=0;
var socketIds=[];

//wir fürs FlowField benötigt
function make2Darray(n){
    let array = [];
    for (let i = 0; i < n; i++){
        array[i] = [];
    }
    return array;
}
//äquivalent zu = p5 random(min,max) 
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }




function newConnection(socket){
    console.log('new Connection = '+socket.id);
    socket.on('get', startMsg);

    function startMsg(data){
        if(!socketIds.includes(socket.id)) {
            socketIds.push(socket.id);
            totalW+=data.w;
            if (data.h > maxH){
                maxH = data.h;
            }
            totalClients++;
            cols=totalW/resolution;
            rows=maxH/resolution;
            field=make2Darray(cols);
            flowField = new FlowField(resolution,cols,rows,field);
            for (let i = 0; i<vehicleNumber; i++){
                vehicles.push(new Vehicle(getRandomInt(0,totalW),getRandomInt(0,maxH),getRandomInt(0.1,2),getRandomInt(0.1,5),totalW,maxH))
            }
        }
        settings={
            id: totalClients,
            socketid: socket.id,
            offsetbeginX: totalW - data.w,
            offsetendX: totalW,
            resolution: resolution,
            cols: flowField.cols,
            rows: flowField.rows,
            field: flowField.field,
            flowfield: flowField,
            vehicles: vehicles
        }
        io.to(socket.id).emit('get', settings);//msg geht an client der gesendet hat
    }
    //alle so und so viele Sekunden/Frames wird die funktion aufgreufen
    setInterval(function(){
        if(vehicles.length > 0){
            calcVehicles();
        }
        io.sockets.emit('update', vehicles); //msg geht an alle clients
    }, 33); // 1000 ms / 30 -> 33.3333  -> 30FPS /// p5 arbeitet mit ca, 60FPS, 30FPS genügt

    setInterval(function(){
        flowField = new FlowField(flowField.resolution,flowField.cols,flowField.rows,flowField.field);
        io.sockets.emit('update', flowField); //msg geht an alle clients
    }, getRandomInt(4200,42000));
}

function calcVehicles(){
    for (let i=0; i<vehicles.length; i++){
         vehicles[i].follow(flowField);
         vehicles[i].run();
    }
}
