// Enemies our player must avoid
// Enemy class
var Enemy = function(x,y,speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    canvas_width = 705;
    canvas_height = 706;
    bug_width = 82;
    bug_height = 57;

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
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
            if (this.y < 60){       // if player reaches top edge of canvas
                this.y = 61;        // it does not move more up, off canvas
            }
            break;
        case "down":
            this.y += 82;
            if (this.y > 553){      // if player reaches bottom edge of canvas
                this.y = 553;       // it does not move more down, off canvas
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

// function to create ememy instances of class Enemy and add them to the array allEnemies
function instantiateEnemies(){
    allEnemies = [];
    var num;

    // assign number of bugs and their speed for each lane
    for (var lane = 1; lane<5; lane++){
       if (lane == 1){              // if first lane
            y = 145;                // assigns y position of bug
            num = 3;                // the number of bugs
            speed = 100;            // the bugs' speed
        } else if (lane == 2) {     
            y = 227;                // same if second lane
            num = 2;
            speed = 110;
        } else if (lane == 3) {
            y = 309;
            num = 3;                // third lane
            speed = 50;
        } else if (lane == 4){
            y = 391;
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

// create a new player instance of the class Player
var player = new Player(315, 553);

// calling instantiating function for enemies
instantiateEnemies();



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
