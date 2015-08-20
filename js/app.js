// Enemies our player must avoid
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
        this.sprite = "images/enemy-bug-left1.png";
    }else {
        this.sprite = 'images/enemy-bug1.png';

    }
    this.x = x;
    this.y = y;
    this.speed = speed;
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (this.y == 145 || this.y == 309){
        this.x -= this.speed *dt
        if (this.x < -100){
            this.x = canvas_width;
        }
    }else{
        this.x += this.speed*dt;

        if (this.x > canvas_width){
            this.x = -100;
        } 
    }

}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(x,y){
    this.sprite = "images/char-horn-girl1.png";
    this.x = x;
    this.y = y;
}

Player.prototype.update = function(){

}

Player.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Player.prototype.handleInput = function(keycode){
    switch(keycode){
        case "up":
            this.y -= 82;
            if (this.y < 60){
                this.y = 61;
            }
            break;
        case "down":
            this.y += 82;
            console.log(this.y);
            if (this.y > 553){
                this.y = 553;
            }
            break;
        case "left":
            this.x -= 75;
            if (this.x < 15){
                this.x = 15;
            }
            break;
        case "right":
            this.x += 75;
            if (this.x > 615){
                this.x = 615;
            }
            break;
    }
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
function instantiateEnemies(){
    allEnemies = [];
    var num;

    for (var lane = 1; lane<5; lane++){
       if (lane == 1){
            y = 145;
            num = 3;
            speed = 100;
        } else if (lane == 2) {
            y = 227;
            num = 2;
            speed = 110;
        } else if (lane == 3) {
            y = 309;
            num = 3;
            speed = 50;
        } else if (lane == 4){
            y = 391;
            num = 2;
            speed = 200;
        }
        var x = Math.floor((Math.random() * 605) + 1);
        for (var i = 0; i<num; i++){
            var enemy = new Enemy(x,y,speed);
            allEnemies.push(enemy);
            x += 303;
        }
    }
}

// Place the player object in a variable called player
var player = new Player(315, 553);

instantiateEnemies();




// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
