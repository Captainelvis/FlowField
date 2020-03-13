//äquivalent zu = p5 noise(value);
var SimplexNoise = require('simplex-noise');
//äquivalent zu = p5 createVEctor(x,y);
var Victor = require('victor');

class FlowField {
    constructor(r,cols,rows,field){
        //how large is each cell of the flow field
        this.resolution = r;
        this.cols = cols;
        this.rows = rows;
        this.field = field;
        this.noiseSeed = this.getRandomInt(0,1000);
        this.init();
    }
    //äquivalent zu = p5 map(value, value.min, value.max, new.min, new.max);
    scale (num, in_min, in_max, out_min, out_max) {
        return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
      }
    //äuivalent zu = p5 random(min,max);
    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }

    init(){
        this.simplex = new SimplexNoise(this.noiseSeed);
        let xoff = 0;
        for (let i = 0; i < this.cols; i++){
            let yoff = 0;
            for (let j = 0; j < this.rows; j++){
                let theta = this.scale(this.simplex.noise2D(xoff,yoff),0,1,0,6.28318530717958647693); //letzte Zahl ist die Konstante TWO_PI (p5.js)
                theta += 0.001;
                this.field[i][j] = new Victor(Math.cos(theta), Math.sin(theta));
                yoff += 0.01;
            }
            xoff += 0.01;
        }
    }
    //Die number kann sich nur zwischen dem min.Wert und dem max-Wert befinden
    constrainNumber(val, min, max) {
        return val > max ? max : val < min ? min : val;
    }
    //für die vehicles zum schauen wo der nächste vektor ist
    lookup(lookup) {
        let column = Math.floor(this.constrainNumber(lookup.x / this.resolution, 0, this.cols - 1));
        let row = Math.floor(this.constrainNumber(lookup.y / this.resolution, 0, this.rows - 1));
        return new Victor(this.field[column][row].x,this.field[column][row].y);  
    }
}
module.exports = FlowField;