console.log("main.js loaded");

class Liquid{
    constructor({x_, y_, w_, h_, c_}){
        this.x = x_;
        this.y = y_;
        this.w = w_;
        this.h = h_;
        this.c = c_;
    }
    display(){
        noStroke();
        fill(175);
        rect(this.x, this.y, this.w, this.h);
    }
}

class Mover{
    constructor({x_,y_, vx, vy, ax, ay, mass_, topSpeed}){
        this.location = new Pvector(x_, y_);
        this.velocity = new Pvector(vx, vy);
        this.acceleration = new Pvector(ax, ay);
        this.mass = mass_;
        this.topSpeed = topSpeed;
    }
    display(){
        stroke(0);
        fill(random(255),random(255),random(255));
        ellipse(this.location.x, this.location.y, this.mass*3, this.mass*3);
    }
    update(){
        this.velocity.add(this.acceleration);
        this.location.add(this.velocity);

        this.acceleration.multiply(0);
        
    }
    checkForWalls(){
        if(this.location.x > width){
            this.velocity.x *= -1;
        }else if(this.location.x < 0){
            this.velocity.x *= -1;
        }

        if(this.location.y > height){
            this.velocity.y *=-1;
        }else if(this.location.y < 0){
            this.velocity.y *=-1;
        }
    }
    limit(max){
        if(this.velocity.magnitude() > this.topSpeed){
            this.velocity.normalize();
            this.velocity.multiply(this.topSpeed);
        }
    }
    applyForce(forceToAdd){
        var force = forceToAdd.get();
        force.divide(this.mass);
        this.acceleration.add(force);

    }
}

var ballArr;
var mu;
var liquid;
var liquidParam;

function setup(){

    createCanvas(innerWidth, innerHeight);
    ballArr = [];

    mu = 0.001
    liquidParam = {
        x_: 0,
        y_: innerHeight/2,
        w_: innerWidth/2,
        h_: innerHeight/2,
        c_: 0.01,
    }
    pool = new Liquid(liquidParam);
    
    
}
var t = 0;
function draw(){
    background(255);
    pool.display();
    if(mouseIsPressed){
        var moveInfo = {
        x_: mouseX,
        y_: mouseY,
        vx: 0,
        vy: 0,
        ax: 0,
        ay: 0,
        mass_: random(.01,2),
        topSpeed: 10,
        }
    ballArr.push(new Mover(moveInfo));
    }
    for(var i = 0; i < ballArr.length; i++){
        var wind = new Pvector(random(.05),0);
        var gravity = new Pvector(0,0.1 * (ballArr[i].mass));
        var friction = ballArr[i].velocity.get();
        friction.multiply(-1);
        friction.normalize();
        friction.multiply(mu);

        var speed = ballArr[i].velocity.magnitude();
        var dragMagnitude = mu * speed * speed;
        drag = ballArr[i].velocity.get();
        drag.multiply(-1);
        drag.normalize();
        drag.multiply(dragMagnitude);

        //ballArr[i].applyForce(friction);
        ballArr[i].applyForce(drag);
        ballArr[i].applyForce(wind);
        ballArr[i].applyForce(gravity);

        ballArr[i].display();
        ballArr[i].update();
        ballArr[i].checkForWalls();
        ballArr[i].limit();
    }
}