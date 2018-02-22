/*
    Kent State University
    CS 44105/54105 Web Programming I
    Fall 2017
    Assignment 3
    The World’s Hardest Game 2 Remake
    worldshardestgame.js
    Author 1: Abdulkareem Alali, aalali1@kent.edu
    Author 2: Andrew Gast, agast@kent.edu
*/

var canvas = document.querySelector("canvas");
var context = canvas.getContext("2d");

const DARKBLUE = 'rgb(0,0,139)';
const YELLOW = 'rgb(255,255,0)';
const BACKGROUND_IMAGE = "images/world-hardest-game-2-bg-level-1.png";
const SCREENS = {
    screen1 : {
        //???
    },
    screen2 : {
        //???
    },
    screen3 : {
        gameCenterWall : {
            top : 100,
            bottom : 355,
            }
    }
}
const BALLS = {
    pair1 : {
        ball1 : ["p1b1", 400, 225, 11, 4.1, DARKBLUE],
        ball2 : ["p1b2", 443, 225, 11, 4.1, DARKBLUE]
    },
    pair2 : {
        ball1 : ["p2b1", 486, 225, 11, -4.1, DARKBLUE],
        ball2 : ["p2b2", 529, 225, 11, -4.1, DARKBLUE]
    },
    pair3 : {
        ball1 : ["p3b1", 572, 225, 11, 4.1, DARKBLUE],
        ball2 : ["p3b2", 615, 225, 11, 4.1, DARKBLUE]
    }
}
const COINS = {
    coin1 : ["c1", 421.5, 265, 11, 11, 0, 0, 2 * Math.PI, YELLOW],
    coin2 : ["c2", 507.5, 185, 11, 11, 0, 0, 2 * Math.PI, YELLOW],
    coin3 : ["c3", 593.5, 265, 11, 11, 0, 0, 2 * Math.PI, YELLOW]
}

var s_punch;
var s_collect;
var s_music;
var deaths = 0;
var coinsCollected = 0;
var myGamePiece;
var obs;
var gameStarted = false;
var paused = false;

//var getSpan = document.getElementsByTagName('span');

var s1 = document.createElement('span');
var s2 = document.createElement('span');
//Insert mute and pause buttons
var muteBtn = document.createTextNode("Mute");
var pauseBtn = document.createTextNode("Pause");
s1.appendChild(pauseBtn);
s2.appendChild(muteBtn);
var para = document.getElementsByTagName("p")[0];
para.insertBefore(s2, para.childNodes[2]);
para.insertBefore(s1, para.childNodes[2]);



var mouseX;
var mouseY;

//Mute button
document.getElementsByTagName("span")[3].addEventListener("click", function(){
    music.paused ? music.play() : music.pause();
});

//Pause button
document.getElementsByTagName("span")[2].addEventListener("click", function(){
    togglePause();
});

// When game loads, show intro screen (screen 1)
window.addEventListener("load",
    intro_screen
);

window.addEventListener("click", checkPos);

//Stop the screen from moving/scrolling when pressing arrow keys
window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);

window.addEventListener("keydown", function(e){
    if(e.keyCode == 17 && e.keyCode == 77 && game_start){
        music.paused ? music.play() : music.pause();
    }
});

window.addEventListener("keydown", function(e){
    if(e.keyCode == 17 && e.keyCode == 80 && game_start){
        togglePause();
    }
});

//If clicked in the right spot, go to screen 2. *doesnt work, so: start game
function checkPos(e) {
    var mousePos = getMousePos(canvas, e);
    if((mousePos.x > 409 && mousePos.x < 593) && (mousePos.y > 344 && mousePos.y < 404)) {
        startGame();
        // window.removeEventListener("click", checkPos);
        // clearCanvas();
        // warning_screen();
    }
}

function getMousePos(canvas, e) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}

//Screen 1
function intro_screen(){
    var grd=context.createLinearGradient(0,1600,1000,0);
    grd.addColorStop(0,"black");
    grd.addColorStop(0.5,"grey");
    grd.addColorStop(1,"black");


    context.fillStyle=grd;
    context.fillRect(0,0,canvas.width,canvas.height);

    //white border
    context.font = "bold 150px mono45-headline, monospace";
    context.strokeStyle = "white";
    context.lineWidth = 7;
    context.strokeText("HARDEST GAME", 10, 235);

    context.font = "30px Arial";
    context.fillStyle = "white";
    context.fillText("THE WORLD'S", 10, 120);

    context.font = "bold 150px mono45-headline, monospace";
    var gradient = context.createLinearGradient(0, 0, 0, 200);
    gradient.addColorStop("0", "white");
    gradient.addColorStop("1.0", '#1f509c');
    context.fillStyle = gradient;
    context.fillText("HARDEST GAME", 10, 235);

    //black border
    context.lineWidth = 3;
    context.strokeStyle = "black";
    context.strokeText("HARDEST GAME", 10, 235);


    context.font = "30px Arial";
    context.fillStyle = "white";
    context.fillText("VERSION 2.0", 805, 275);

    //context.fillStyle = "white";
    context.font = "bold 70px Arial";
    context.fillText("BEGIN", 405, 400);
}
//Screen 2
/*THIS WILL NEVER WORK NO MATTER WHAT I TRY!*/
function warning_screen(){
    //gameStarted = true;
    clearCanvas();
    var grd=context.createLinearGradient(0,0,0,200);
    grd.addColorStop(0,"white");
    grd.addColorStop(1, '#afb1fe');

    context.fillStyle=grd;
    context.fillRect(0,0,canvas.width,canvas.height);
    context.font = "40px Arial";
    context.fillStyle = "black";
    context.fillText("YOU DON'T STAND A CHANCE.", 180, 245);
    sleep(2000);
    startGame();
}

function clearCanvas(){context.clearRect(0, 0, canvas.width, canvas.height);}

function togglePause() {
    if(!paused) {
        paused = true;
    } else if (paused) {
        paused = false;
    }
}

function startGame(){
    window.removeEventListener("click", checkPos);

    gameStarted = true;
    clearCanvas();
    //document.getElementById('deaths').innerHTML = deaths;
    game.init();
    obs = new obstacles(game);
    myGamePiece = new component(30, 30, "red", 240, 210);
    //initialize audio files
    s_punch = new Audio("soundeffects/RealisticPunch.mp3");
    s_collect = new Audio("soundeffects/CoinCollect.wav");
    music = new Audio("soundeffects/World'sHardestGame2ThemeSong.mp3");
    //Loop music
    music.addEventListener('ended', function() {
        this.currentTime = 0;
        this.play();
    }, false);

    music.play();
}

function resetGame() {
    deaths++;
    coinsCollected = 0;
    game.clear();
    document.getElementsByTagName("span")[5].innerHTML = deaths;
    obs = new obstacles(game);
    myGamePiece = new component(30, 30, "red", 240, 210);
    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0
}

//Engine
var game = {
    init : function() {
        this.canvas = canvas;
        this.context = context;
        this.interval = setInterval(update, 20);

        //Listen for key input to move game piece
        window.addEventListener('keydown', function (e) {
            game.keys = (game.keys || []);
            game.keys[e.keyCode] = (e.type == "keydown");
        })
        window.addEventListener('keyup', function (e) {
            game.keys[e.keyCode] = (e.type == "keydown");
        })
    },
    drawBackground: function(){
        if (this.context != undefined){
            var img = new Image;
            img.src = BACKGROUND_IMAGE;
            this.context.drawImage(img, 0, 0);
        }
        myGamePiece.update();
    },
    stop : function() {
        clearInterval(this.interval);
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    getContext: function(){
        return this.context;
    }
}
//used for timed waits
function sleep(miliseconds) {
   var currentTime = new Date().getTime();
   while (currentTime + miliseconds >= new Date().getTime()) {
   }
}

function obstacles(game){
    //create the array of balls that will be animated
    this.game = game;
    this.balls = [ ball.construct(BALLS.pair1.ball1),
                   ball.construct(BALLS.pair1.ball2),
                   ball.construct(BALLS.pair2.ball1),
                   ball.construct(BALLS.pair2.ball2),
                   ball.construct(BALLS.pair3.ball1),
                   ball.construct(BALLS.pair3.ball2)
                ];
    this.coins = [  coin.construct(COINS.coin1),
                    coin.construct(COINS.coin2),
                    coin.construct(COINS.coin3)
                    ];
    this.animate = function(){
        //loop through the balls array & draw the balls
        this.game.drawBackground();
        for (var i = 0; i < this.balls.length; i++){
            this.balls[i].animate(this.game.getContext());
        }
        //draw the coins
        for (var i = 0; i < this.coins.length; i++){
            this.coins[i].animate(this.game.getContext());
        }
        // check ball collision
        for (var i = 0; i < obs.balls.length; i++){
            if (myGamePiece.ballCollide(obs.balls[i])) {
                if(!music.paused){
                    s_punch.play();
                }
                //start game over
                resetGame();
            }
        }
        //check coin collision
        for (var i = 0; i < obs.coins.length; i++) {
            if (myGamePiece.coinCollide(obs.coins[i])) {
                coinsCollected++;
                if(!music.paused){
                    s_collect.play();
                }
                //delete coin
                obs.coins[i].destroy();
            }
        }
    }
}

function coin(name, x, y, Xradius, Yradius, rotation, startAngle, endAngle, color){
    this.name = name,
    this.speed = 0;
    this.x = x,
    this.y = y,
    this.Xradius = Xradius,
    this.Yradius = Yradius,
    this.rotation = rotation,
    this.startAngle = startAngle,
    this.endAngle = endAngle,
    this.color = color,
    this.animate = function(ctx){
        //Draw coin
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.ellipse(this.x, this.y, this.Xradius, this.Yradius, this.rotation, this.startAngle, this.endAngle);
        ctx.fill()
        //rotate coins
        if(this.Xradius == 11) {
            this.speed = -1;
        }
        if(this.Xradius == 0) {
            this.speed = 1;
        }
        this.Xradius += this.speed;
    }
    this.destroy = function() {
        this.x = null;
        this.y = null;
        this.Xradius = 0;
        this.Yradius = 0;
    }
}

function component(width, height, color, x, y) {
    this.width = width,
    this.height = height,
    this.speedX = 0,
    this.speedY = 0,
    this.x = x,
    this.y = y,
    this.update = function() {
        ctx = game.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    this.newPos = function() {
        //control speed and direction when pressing keys
        myGamePiece.speedX = 0;
        myGamePiece.speedY = 0;
        if (game.keys && game.keys[37]) {myGamePiece.speedX = -3.9; }
        if (game.keys && game.keys[39]) {myGamePiece.speedX = 3.9; }
        if (game.keys && game.keys[38]) {myGamePiece.speedY = -3.9; }
        if (game.keys && game.keys[40]) {myGamePiece.speedY = 3.9; }
        //if all coins collected and enter endzone, winning scenario
        if(coinsCollected == 3 && this.x > 730) {
            myGamePiece.speedX = 0;
            myGamePiece.speedY = 0;
            alert("You made it!");
            deaths = -1;
            resetGame();
        }

        //Left area
            // left : x=212
            // top : y=143
            // bottom : y=309

        // Center area
            // left : x=381
            // right : x=634
            // top : y=100
            // bottom : y=355,

        //Right area
            // right : x=801
            // top : y=143
            // bottom : y=309

        //Left area constraints
        if (this.x >= 212 && this.x < 383 && this.y >= 143 && this.y + (this.height) <= 309){
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 212) {this.x = 212;}
            //if (this.x > 383) {this.x = 383;}
            if (this.y < 143) {this.y = 143;}
            if (this.y + (this.height) > 309) {this.y = 309 - (this.height);}
        }

        //Center area constraints
        if (this.x >= 383 && this.x + (this.width) <= 634 && this.y >= 102 && this.y + (this.height) <= 351) {
            this.x += this.speedX;
            this.y += this.speedY;
            //left corner walls
            if (this.x < 383 && (this.y < 143 || this.y + (this.height) > 309)) {this.x = 384;}
            //right corner walls
            if (this.x + (this.width) > 634 && (this.y < 143 || this.y + (this.height) > 309)) {this.x = 634 - (this.width);}
            //top and bottom walls
            if (this.y < 102) {this.y = 102;}
            if (this.y + (this.height) > 351) {this.y = 351 - (this.height);}
        }

        //Right area constraints
        if (this.x + (this.width) >= 634 && this.x + (this.width) <= 801 && this.y >= 143 && this.y + (this.height) <= 309){
            this.x += this.speedX;
            this.y += this.speedY;
            //if (this.x < 634) {this.x = 634;}
            if (this.x + (this.width) > 801) {this.x = 801 - (this.width);}
            if (this.y < 143) {this.y = 143;}
            if (this.y + (this.height) > 309) {this.y = 309 - (this.height);}

        }
    }

    this.ballCollide = function(ball) {
        var distX = Math.abs(ball.x - this.x-this.width/2);
        var distY = Math.abs(ball.y - this.y-this.height/2);

        if (distX > (this.width/2 + ball.radius)) { return false; }
        if (distY > (this.height/2 + ball.radius)) { return false; }

        if (distX <= (this.width/2)) { return true; }
        if (distY <= (this.height/2)) { return true; }

        var dx=distX-this.width/2;
        var dy=distY-this.height/2;
        return (dx*dx+dy*dy<=(ball.radius*ball.radius));
    }
    this.coinCollide = function(coin) {
        var distX = Math.abs(coin.x - this.x-this.width/2);
        var distY = Math.abs(coin.y - this.y-this.height/2);

        if (distX > (this.width/2 + coin.Xradius)) { return false; }
        if (distY > (this.height/2 + coin.Xradius)) { return false; }

        if (distX <= (this.width/2)) { return true; }
        if (distY <= (this.height/2)) { return true; }

        var dx=distX-this.width/2;
        var dy=distY-this.height/2;
        return (dx*dx+dy*dy<=(coin.Xradius*coin.Xradius));
    }
}

function ball(name, x, y, radius, speed, color){
    this.name = name,
    this.x = x,
    this.y = y,
    this.radius = radius,
    this.speed = speed,
    this.color = color,
    this.animate = function(ctx){
        //Draw ball
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        ctx.fill()

        //Animate
        var wall = SCREENS.screen3.gameCenterWall;
        //if near a wall, bounce the other way
        if (this.y - this.radius + this.speed < wall.top
         || this.y + this.radius + this.speed > wall.bottom){
          this.speed = -this.speed;
        }
        this.y += this.speed
    }
}

function update() {
    if(!paused) {
        game.clear();
        obs.animate();
        myGamePiece.newPos();
    }
}
