/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */

var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime;

    canvas.width = 705;
    canvas.height = 706;
    bestScore = 0;
    doc.body.appendChild(canvas);

    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        update(dt);
        render();

        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        win.requestAnimationFrame(main);
    };

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */ 
    function init() {
            lastTime = Date.now();
            main();
    }

    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    function update(dt) {
        if (!gamePause){                // if game is not paused
            updateEntities(dt);
            checkCollisions();                       
        }
    }

    /* This is called by the update function  and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to  the object. Do your drawing in your
     * render methods.
     */
    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
        allGems.forEach(function(gem){
            gem.update();
        });
        player.update();
    }

    function checkCollisions(){
       collision_Bugplayer(); 
       collision_Gemplayer();
    }
    
    // function to calculate distance between two objects
    // takes in x and y position of both objects as arguments
    function distance(px,py,ex,ey){
        return Math.sqrt((Math.pow(px - ex, 2)+Math.pow(py - ey,2)));
    }

    // function to check for collision between player and bug
    // returns true if collision is there and false if not.
    function collision_Bugplayer(){
        allEnemies.forEach(function(enemy) {
           if (distance(player.x,player.y,enemy.x,enemy.y) < 78){       // if distance between bug and player is less than 78
                player.x = 315;                                         // send player back to initial position
                player.y = 553;
                if (lives > 1){                                         // if there are still lives left
                    topRowEntities.pop();                               // take away a life                   
                    lives -= 1;
                } else{
                    gameEnded = true;
                    endScreen();
 //                   newGame();
                }
                return true;
           } else {
                return false;

           }
        });
    }

    // function to check for collision between player and gem
    // moves the collided gem off canvas and increments its colorcounter by 1
    function collision_Gemplayer(){
        allGems.forEach(function(gem){
            if (distance(player.x,player.y,gem.x,gem.y) < 70){
                gem.x = -101;
                switch (gem.color){
                    case "Blue":
                        gemsCollected.Blue[0]+= 1;
                        break;
                    case "Green":
                        gemsCollected.Green[0]+= 1;
                        break;
                    case "Orange":
                        gemsCollected.Orange[0]+= 1;
                        break;
                }
                console.log(gemsCollected);
            }
        });
     }
 

    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    function render() {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
            var rowImages = [
                    'images/water-block.png',   // Top row is water
                    'images/grass-block.png',   // Second row is water
                    'images/stone-block.png',   // Row 1 of 4 of stone
                    'images/stone-block.png',   // Row 2 of 4 of stone
                    'images/stone-block.png',   // Row 3 of 4 of stone
                    'images/stone-block.png',   // Row 4 of 4 of stone                
                    'images/grass-block.png',   // Row 1 of 2 of grass
                    'images/grass-block.png'    // Row 2 of 2 of grass
                ],
                numRows = 8,
                numCols = 8,
                row, col;

            /* Loop through the number of rows and columns we've defined above
             * and, using the rowImages array, draw the correct image for that
             * portion of the "grid"
             */
            for (row = 0; row < numRows; row++) {
                for (col = 0; col < numCols; col++) {
                    /* The drawImage function of the canvas' context element
                     * requires 3 parameters: the image to draw, the x coordinate
                     * to start drawing and the y coordinate to start drawing.
                     * We're using our Resources helpers to refer to our images
                     * so that we get the benefits of caching these images, since
                     * we're using the08m over and over.
                     */
                    ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
                }
            }
            if (!gameStarted){
                splashScreen();
            }else if (gameEnded){
                endScreen();
            } else{
                ctx.globalAlpha = 1;
                renderEntities();
            }
    }

    /* This function is called by the render function and is called on each game
     * tick. It's purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
         update(dt);
            render();            
    */
    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */
    
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });
        allGems.forEach(function(gem){
            gem.render();
        });
        topRowEntities.forEach(function(heart){
           heart.render();
        });

        player.render();
    }

    /* This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */

    function splashScreen(){            // Draws a transparent info screen at the start of game
        gameStarted = false;
        gamePause = true;
        splash_width = 605;
        splash_height = 605;

        // draw the screen
        ctx.fillStyle = "green";    
        ctx.globalAlpha = 0.8;          // sets transparency
        ctx.fillRect(50,70,605,605);
        ctx.strokeStyle = "Blue";
        ctx.strokeRect(50,70,605,605);

        // draw the title
        drawGradient();                 // use function to implement gradient
        ctx.font = "80px Orbitron"
        ctx.lineWidth = 2.0;
        ctx.fillStyle = gradient;
        ctx.strokeStyle = "Blue";
        ctx.strokeText("Frogger",splash_width/3.5, splash_height/3.5);
        ctx.fillText("Frogger",splash_width/3.5, splash_height/3.5);

        controlsInstructions();

        ctx.fillText("Press", 125, 660);
        ctx.drawImage(Resources.get("images/space_bar.png"), 230, 630, 150, 30);
        ctx.fillText("to continue....", 400, 660);

    }

    // control instrctions for splashscreen
    function controlsInstructions(){
        //draw the control heading
        ctx.lineJoin = "round";
        ctx.lineWidth = 1;
        ctx.fillStyle = "rgba(240, 240, 240, .3)";
        ctx.fillRect(225, 235, 250, 65);
        ctx.strokeRect(225, 235, 250, 65);
        ctx.font = "35px Orbitron"
        ctx.fillStyle="White";
        ctx.fillText("Controls", 265, 280);

        // draw keys and instrctions
        ctx.drawImage(Resources.get("images/arrow_keys.png"), 125, 320, 150, 100);
        ctx.font = "25px Orbitron";
        ctx.fillStyle = "white" ;
        ctx.fillText("Use Arrow Keys", 320, 340);
        ctx.fillText("to move the player", 320, 375);
        ctx.fillText("across the screen", 320, 410);

        //draw instrctions for pause
        ctx.drawImage(Resources.get("images/p_key.png"), 175, 450, 50, 50);
        ctx.fillText("Press 'P' to Pause", 320, 480);

        //draw instructions for reset game
        ctx.drawImage(Resources.get("images/R_key.png"), 175, 520, 50, 50);
        ctx.fillText("Press 'R' to Reset", 320, 540);
        ctx.fillText("the game", 320, 575);
    }

    // function to render score screen at the end of game
    function endScreen(){

        // draw the screen
        ctx.fillStyle = "green";    
        ctx.globalAlpha = 0.8;          // sets transparency
        ctx.fillRect(50,70,605,605);
        ctx.strokeStyle = "Blue";
        ctx.strokeRect(50,70,605,605);

        //draw the title gems collected
        ctx.lineJoin = "round";
        ctx.lineWidth = 1;
        ctx.fillStyle = "rgba(240, 240, 240, .3)";
        ctx.fillRect(160, 140, 400, 65);
        ctx.strokeRect(160, 140, 400, 65);
        ctx.font = "40px Orbitron"
        ctx.fillStyle= gradient;
        ctx.fillText("Gems Collected", 180, 180);

        // Adds color of gem and the number collected for each color to an array
        var gems_score = [];
        for (var key in gemsCollected){
            gems_score.push(key);
            gems_score.push(gemsCollected[key][0]);
        }

        ctx.fillStyle = "White";
        var multiplier = 10;        // variable that holds points for a blue gem
        var gemTotal = 0;       
        var gemPicX = 220;
        var gemPicY = 230;
        var gemX = 285;
        var gemY = 270;
        for (var i = 0; i< gems_score.length; i++){
            //draws first gem image
            ctx.drawImage(Resources.get("images/Gem "+gems_score[i]+".png"), gemPicX, gemPicY, 50, 50);
            i++;
            gemTotal += gems_score[i] * multiplier;
            //draws gems collected and the points total
            ctx.fillText(" X " + gems_score[i] + " = " + gems_score[i] * multiplier, gemX, gemY);
            multiplier+= 10;        // increments multiplier for next gem which is worth 10 points more
            gemY+= 70;              // increments y position of score rendering
            gemPicY+= 70;           // increments y position of gem rendering
        }
        if (bestScore < gemTotal){  // makes best score the current score if it is more
            bestScore = gemTotal;
        }

        //draws the score
        ctx.lineWidth = 1.1;
        ctx.fillStyle = gradient;
        ctx.strokeStyle = "blue";
        ctx.fillText("Your Score : "+ gemTotal, 170, 500);
        ctx.strokeText("Your Score : "+ gemTotal, 170, 500);

        // draws the best score
        ctx.fillStyle = "Yellow";
        ctx.fillText("Best Score : "+ bestScore, 170, 580);
        ctx.strokeText("Best Score : "+ bestScore, 170, 580);  

        // draws instruction to start a new game
        ctx.font = "30px Orbitron";
        ctx.fillStyle = "white";
        ctx.fillText("Press 'R'  to restart the game", 120, 660);
    }

    // function that computes gradient to be used for splashscreen
    function drawGradient(){
        gradient = ctx.createLinearGradient(0,0,splash_width,0);
        gradient.addColorStop(.20, "magenta");
        gradient.addColorStop(.40, "blue");
        gradient.addColorStop(.60, "red");
        gradient.addColorStop(.80, "orange");
    }

    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug1.png',
        'images/enemy-bug-left1.png',
        'images/char-horn-girl1.png',
        'images/Star.png',
        'images/Gem Blue.png',
        'images/Gem Green.png',
        'images/Gem Orange.png',
        'images/Heart.png',
        'images/Gem Blue_small.png',
        'images/Gem Green_small.png',
        'images/Gem Orange_small.png',
        'images/arrow_keys.png',
        'images/R_key.png',
        'images/p_key.png',
        'images/space_bar.png'
    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developer's can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;

    document.addEventListener("keyup",function(e){
        if (e.keyCode === 32){
            gameStarted = true;
        }
    });

})(this);
