
// Enemy class
var Enemy = function(x,y,speed) {
    canvas_width = 705;
    canvas_height = 706;
    bug_width = 82;
    bug_height = 57;

    // The image/sprite for our enemies, this uses
    // a helper to easily load images
    
    if (y == 145 || y == 309){
        this.sprite = "images/enemy-bug-left1.png";         // Loads left facing bugs
    }else {
        this.sprite = 'images/enemy-bug1.png';              // Loads right facing bugs

    }
    this.x = x;
    this.y = y;
    this.speed = speed;
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks

Enemy.prototype.update = function(dt) {
    // multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (this.y == 145 || this.y == 309){
        this.x -= this.speed *dt            // changes x position of bug : moving
        if (this.x < -100){                 // if bug goes off canvas at left
            this.x = canvas_width;          // make it appear from right 
        }
    }else{
        this.x += this.speed*dt;

        if (this.x > canvas_width){         // if bug goes off canvas at right
            this.x = -100;                  //// make it appear from left
        } 
    }

}

// Draws the enemy on the screen
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Player class
var Player = function(x,y){
    this.sprite = "images/char-horn-girl1.png";
    this.x = x;
    this.y = y;
}

Player.prototype.update = function(){

}

// Draws the player on the screen
Player.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Method that handles key input and moves player accordingly
Player.prototype.handleInput = function(keycode){
    switch(keycode){
        case "up":
            this.y -= 82;
            if (this.y < 142){       // if player reaches top edge of canvas
                this.y = 142;        // it does not move more up, off canvas
            }
            break;
        case "down":
            this.y += 82;
            if (this.y > 637){      // if player reaches bottom edge of canvas
                this.y = 637;       // it does not move more down, off canvas
            }   
            break;
        case "left":
            this.x -= 75;
            if (this.x < 15){       // if player reaches left edge of canvas
                this.x = 15;        // it does not move more left, off canvas
            }
            break;
        case "right":
            this.x += 75;
            if (this.x > 615){      // if player reaches right edge of canvas
                this.x = 615;       // it does not move more right, off canvas
            }
            break;
    }
}

//Gem class
var Gems = function(x,y,color){
    this.sprite = "images/Gem "+color+".png";
    this.x = x;
    this.y = y;
    this.color = color;
//    this.visible = true;
}

Gems.prototype.update = function(){
    var count = 0;
    for (g in allGems){                 // iterates through allGems
        if (allGems[g].x < -5){         // and increments counter by 1
            count+= 1;                  // everytime it sees that gem has been collided with
        }                               // and has been moved off canvas
    }
    if (count == allGems.length){       // if all gems are off canvas
        instantiateGems();              // generate another gem 
    }
}

//Draws the gem on the screen
Gems.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Hearts class
var Hearts = function(x,y){
    this.sprite = "images/Heart.png";
    this.x = x;
    this.y = y;
    this.visible = true;
}

// Draws hearts on screen
Hearts.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);   
}

var Star = function(x,y){
    this.sprite = "images/Star.png";
    this.x = x;
    this.y = y;
    this.visible = true;

}



// function to instantiate Enemy
function instantiateEnemy(){
    //create ememy instances of class Enemy and add them to the array allEnemies
    var num;

    // assign number of bugs and their speed for each lane
    for (var lane = 1; lane<5; lane++){
       if (lane == 1){              // if first lane
            y = 227;                // assigns y position of bug
            num = 3;                // the number of bugs
            speed = 100;            // the bugs' speed
        } else if (lane == 2) {     
            y = 309;                // same if second lane
            num = 2;
            speed = 110;
        } else if (lane == 3) {
            y = 391;
            num = 3;                // third lane
            speed = 50;
        } else if (lane == 4){
            y = 473;
            num = 2;                // fourth lane
            speed = 200;            
        }

        // Generate random x position for the first bug in each lane
        var x = Math.floor((Math.random() * 605) + 1);
        for (var i = 0; i<num; i++){

            var enemy = new Enemy(x,y,speed);   // new instance enemy of Class Enemy
            allEnemies.push(enemy);             // add the enemy object into the array allEnemies
            x += 303;                           // increment x position of the new object to be added by 303
        }
    }

}

// function to instantiate Gems
function instantiateGems(){
    gemColors = ["Blue", "Green", "Orange"];
    var x = Math.floor((Math.random() * 640) + 20);         // generate random vale of x within canvas(20 and 640)
    var y = [226,308,390,472];
    var gem = new Gems(x, y[Math.floor(Math.random()*y.length)], gemColors[Math.floor(Math.random()*gemColors.length)]);
    allGems.push(gem);
}

function instantiateHearts(){
    x = 10;
    for (i=0; i<lives; i++){
        var heart = new Hearts(x, 50);
        allHearts.push(heart);
        x+= 50;
    }
}

// create a new player instance of the class Player
var player = new Player(315, 635);


var newGame = function(){
    time_elapsed = 0;       // initialize variables
    lives = 3;
    allEnemies = [];
    allGems = [];
    allHearts = [];
    gemsCollected = {
        blue: 0,
        green: 0,
        orange: 0
    };

    instantiateEnemy();     // calling instantiating function for enemies
    instantiateHearts();
    instantiateGems();      // calling instantiating function for gems
}


newGame();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. 
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
