    // window functions
    window.onload = function() { start(); };
    //window.addEventListener("keypress", handleInput, true);

    // the update loop interval
    setInterval(gameLoop, 1000 / 33);

    // attributes
    let c = document.getElementById("myCanvas");
    let ctx = c.getContext("2d");
    let back = new Image();
    let levelHTML = document.getElementById("level");

    // ball stuff
    // let ball   = document.querySelector('.ball');
    let radius = 8;
    let garden = document.querySelector('.garden');
    let output = document.querySelector('.output');

    let maxX = c.clientWidth  - radius;
    let maxY = c.clientHeight - radius;

    let color = "purple";

    // the win location
    let winBox = [];

    // movement stuff, the 1st number is x and the 2nd number is y
    let position = [125, 125];
    let velocity = [0, 0];
    let acceleration = [0, 0];
    let force = [0, 0];
    let maxSpeed = 10;

    // Screen Size
    let screenHeight = c.height;
    let screenWidth = c.width;
    let screenBorder = 5;

    // labryrinth walls
    let walls = [];

    // user Input
    let keysPressed = {};
    document.addEventListener("keydown", function(e) {
        keysPressed[e.keyCode] = true;
    });
    document.addEventListener("keyup", function(e) {
        keysPressed[e.keyCode] = false;
    });

    // orientation
    window.addEventListener("deviceorientation", handleOrientation, true);
    let xOrient = 0;
    let yOrient = 0;

    let xOrientOffset = 0;
    let yOrientOffset = 0;

    let gamma = 0;
    let beta = 0;

    // Button press
    let resetBtn = document.getElementById("resetButton");
    resetBtn.onclick = function() {
        xOrientOffset = gamma;
        yOrientOffset = beta;
    };

    // the game setup stuff
    let level = 1;

    // what happens at the start of the game
    function start(){
        if(window.location.pathname == "/index.html" || window.location.pathname == "/DeviceOrientationWebApp/index.html"){
            level = 0;
        }

        setup(level);
        drawGameBoard();
        drawBall(position);
        console.dir(window.location.pathname);
    }

    // the game loop
    function gameLoop() {
        // Do stuff.
        position = movement(position, xOrient, yOrient);
        acceleration = [0, 0];

        // Collision checks
        checkBorders(position);

        for (let i = 0; i < walls.length; i++){
            checkLabryrinth(position, walls[i]);            
        }

        // when the player wins
        if (checkLabryrinth(position, winBox)){
            reset();            
            level++;
            levelHTML.innerHTML = "Level " + level;
            setup(level);
        }

        // drawing steps
        drawGameBoard();
        for (let i = 0; i < walls.length; i++){
            drawLabryrinth(position, walls[i]);            
        }

        drawWin();

        drawBall(position);
    }

    function setup(levelNum){
        if (levelNum == 1){
            winBox = [220, 220, 15, 15]; 
            position = [20, 20];
            addWalls(40, 0, 20, 200);
            addWalls(90, 50, 20, 200);
            addWalls(140, 0, 20, 200);
            addWalls(190, 50, 20, 200);
        }

        if (levelNum == 2){
            winBox = [100, 50, 10, 10]
            position = [240, 240];
        }

        else {
            winBox = [];
            walls = [];
        }
    }

    // add the walls to the array
    function addWalls(x, y, width, height){
        walls[walls.length] = [x, y, width, height];
    }

    // draw the win spot
    function drawWin(){
        ctx.fillStyle = "green";
        ctx.fillRect(winBox[0], winBox[1], winBox[2], winBox[3]);
    }
    
    // reset function
    function reset() {
        // reset the numbers
        position = [0, 0];
        velocity = [0, 0];
        force = [0, 0];
        acceleration = [0, 0];
        walls = [];
        keysPressed = {};
        winBox = [];
    }

    // drawing the game board
    function drawGameBoard(pos){
        // background
        ctx.fillStyle = "black";
        
        ctx.fillRect(0, 0, screenWidth, screenHeight);
        ctx.clearRect(screenBorder, screenBorder, screenWidth - (screenBorder * 2), screenHeight - (screenBorder * 2));
        //ctx.fill();
    }

    // drawing the ball
    function drawBall(pos){
        ctx.beginPath();
        ctx.arc(pos[0], pos[1], radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.lineWidth = 5;
        ctx.strokeStyle = '#003300';
        ctx.stroke;

/*
        // the bounding box of the circle
        //ctx.rect(pos[0] - radius, pos[1] - radius, radius * 2, radius * 2);
        ctx.rect(pos[0] - radius, pos[1] - radius, radius * 2, radius * 2);        
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.stroke();
*/
    }

    // drawing the labyrinth
    function drawLabryrinth(pos, wallBox){
        ctx.fillStyle = 'black';
        ctx.fillRect(wallBox[0], wallBox[1], wallBox[2], wallBox[3]);   
    }

    // collisions with the borders
    function checkBorders(pos){
        ballBox = [pos[0] - radius, pos[1] - radius, radius * 2, radius * 2];
        borders = [screenBorder, screenBorder, screenWidth - (screenBorder * 2), screenHeight - (screenBorder * 2)];

        //bounce that ball if it hits a side
        if (ballBox[0] < borders[0]){
            pos[0] = borders[0] + radius;
            velocity[0] = -velocity[0];
        }

        if (ballBox[0] + (radius) > borders[2]){
            pos[0] = borders[2];
            velocity[0] = -velocity[0];
        }

        if (ballBox[1] < borders[1]){
            pos[1] = borders[1] + radius;
            velocity[1] = -velocity[1];
        }

        if (ballBox[1] + radius > borders[3]){
            pos[1] = borders[3];
            velocity[1] = -velocity[1];
        }
    }

    // collisions within the labyrinth
    function checkLabryrinth(pos, wallBox){
        // values for ease
        let leaway = 10;
        let rightWall = wallBox[0] + wallBox[2];
        let leftWall = wallBox[0];
        let botWall = wallBox[1] + wallBox[3];
        let topWall = wallBox[1];

        // check booleans
        let checkX = false;
        let checkY = false;
        let check = false;

        // in range check
        if (pos[0] + radius > leftWall && pos[0] - radius < rightWall ){
            checkX = true;
        }

        if (pos[1] + radius > topWall && pos[1] - radius < botWall){
            checkY = true;
        }

        if (checkX && checkY){
            check = true;
        }

        // the actual collision checks
        if (check){ 
            // left Wall
            if (pos[0] + radius > leftWall && pos[0] + radius < leftWall + leaway){
                pos[0] = leftWall - radius;
                velocity[0] = -velocity[0];
                console.dir("left");
                return true;
            }

            // right Wall
            else if (pos[0] - radius < rightWall && pos[0] - radius > rightWall - leaway){
                pos[0] = rightWall + radius;
                velocity[0] = -velocity[0];
                console.dir("right");
                return true;
            }

             // top Wall
            else if (pos[1] + radius > topWall && pos[1] + radius < topWall + leaway) {
                pos[1] = topWall - radius;
                velocity[1] = -velocity[1];
                console.dir("top");
                return true;
            }

            // bot Wall
            else if (pos[1] - radius < botWall && pos[1] - radius > botWall - leaway){
                pos[1] = botWall + radius;
                velocity[1] = -velocity[1];
                console.dir("bot");
                return true;
            }
        }
    }
/*
        // bounce that ball if it hits a side
        
        if (ballBox[0] > wallBox[0] && check){
            pos[0] = wallBox[0] + radius;
            velocity[0] = -velocity[0];
        }

        if (ballBox[0] + (radius) < wallBox[0] + wallBox[2] && check){
            pos[0] = wallBox[0] + wallBox[2];
            velocity[0] = -velocity[0];
        }

        if (ballBox[1] > wallBox[1] && check){
            pos[1] = wallBox[1] + radius;
            velocity[1] = -velocity[1];
        }

        if (ballBox[1] + radius < wallBox[1] + wallBox[3] && check){
            pos[1] = wallBox[1] + wallBox[3];
            velocity[1] = -velocity[1];
        }
        

        if (check){
            output.innerHTML = "in range";
        }
        else {
            output.innerHTML = "";
        }

        let rightWall = wallBox[0] + wallBox[2];
        console.dir("check: " + check);
        console.dir("check2: " + (ballBox[0] - radius <= rightWall + leaway && ballBox[0] > rightWall - (wallBox[2])));
        console.dir("check3: " + (ballBox[0] - radius >= rightWall - leaway));
        console.dir((ballBox[0] - radius) + "   " + (wallBox[0] + wallBox[2] - leaway));

        if (check){
            // right wall
            let rightWall = wallBox[0] + wallBox[2];
            if (ballBox[0] - radius <= rightWall + leaway && ballBox[0] > rightWall - (wallBox[2]) && ballBox[0] - radius >= rightWall - leaway){
                ballBox[0] = rightWall + radius;
                velocity[0] = -velocity[0];
                console.dir("Right");
                
            }
         
            // left wall
            if (ballBox[0] + radius >= wallBox[0] - leaway && ballBox[0] < wallBox[0] + (wallBox[2]) && ballBox[0] + radius <= wallBox[0] + leaway){
                ballBox[0] = wallBox[0] - radius;
                velocity[0] = -velocity[0];
                console.dir("Left");
                
            }
         
            // bottom wall
            let botWall = wallBox[1] + wallBox[3];
            if (ballBox[1] - radius <= botWall + leaway && ballBox[1] > botWall - (wallBox[3]) && ballBox[1] - radius >= botWall - leaway){
                ballBox[1] = botWall + radius;
                velocity[1] = -velocity[1];
                console.dir("Bot");
            }
         
            // top wall
            if (ballBox[1] + radius >= wallBox[1] - leaway && ballBox[1] < wallBox[1] + (wallBox[3]) && ballBox[1] + radius <= wallBox[1] + leaway){
                ballBox[1] = wallBox[1] - radius;
                velocity[1] = -velocity[1];
                console.dir("Top");
                
            }
        }
        else {
            output.innerHTML = "";
        }
*/

    function handleOrientation(event) {
      let x = event.gamma; // In degree in the range [-90,90]      
      let y = event.beta;  // In degree in the range [-180,180]

      gamma = x;
      beta = y;

    /*
      output.innerHTML  = "gamma : " + gamma + "\n";
      output.innerHTML += "beta : " + beta + "\n";
      output.innerHTML += "xOffset: " + xOrientOffset + "\n";
      output.innerHTML += "yOffset: " + yOrientOffset + "\n";
    */
      if (xOrientOffset != 0 || yOrientOffset != 0) {
        x -= xOrientOffset;
        y -= yOrientOffset;
      }

      // Because we don't want to have the device upside down
      // We constrain the x and y value to the range [-90,90]
      if (x >  90) { x =  90};
      if (x < -90) { x = -90};
      if (y > 90) { y = 90};
      if (y < -90) { y = -90};

      /*
      output.innerHTML += "X : " + x + "\n";
      output.innerHTML += "Y: " + y + "\n";
      */

      setValues(x, y);
    }

    function setValues(x, y){
        xOrient = x;
        yOrient = y;
    }

    function movement(pos, x, y){
        // testing basic movement
        let modify = 20;
        let direction = 10;
        x = x / modify;
        y = y / modify;

        // w:119  a:97  d:100  s:115
        if (keysPressed["65"]){
            // output.innerHTML += "a";
            x -= direction;
        }
        if (keysPressed["68"]){
            // output.innerHTML += "d";
            x += direction;
        }
        if (keysPressed["83"]){
            // output.innerHTML += "s";
            y += direction;
        }
        if (keysPressed["87"]){
            // output.innerHTML += "w";
            y -= direction;
        }

        // bail out early is theres no movement
        if ((x > -.1 && x < .1 && y > -.1 && y < .1) && (velocity[0] == 0 && velocity[1] == 0))
            return pos;

        else if (x > -.1 && x < .1 && y > -.1 && y < .1){
            velocity[0] = velocity[0] * .9;
            velocity[1] = velocity[1] * .9;
            pos = updatePosition(pos);
            return pos;
        }

        let seekForce = [0, 0];
        seekForce = seek(pos, x, y); 
        applyForce(seekForce);
        pos = updatePosition(pos);
        return pos;
    }
/*
        let x = 0;
        let y = 0;

        // w:119  a:97  d:100  s:115
        if (keysPressed["65"]){
            // output.innerHTML += "a";
            x -= direction;
        }
        if (keysPressed["68"]){
            // output.innerHTML += "d";
            x += direction;
        }
        if (keysPressed["83"]){
            // output.innerHTML += "s";
            y += direction;
        }
        if (keysPressed["87"]){
            // output.innerHTML += "w";
            y -= direction;
        }
*/
    // calculating the direction you want the ball to go
    function seek(pos, x, y){        
        let wantedPos = [0, 0];

        wantedPos[0] = (pos[0] + x) - pos[0];
        wantedPos[1] = (pos[1] + y) - pos[1];

        //normalize
        wantedPos = normalize(wantedPos);

        wantedPos = [wantedPos[0] * maxSpeed, wantedPos[1] * maxSpeed];
        let steer = [wantedPos[0] - velocity[0], wantedPos[1] - velocity[1]];

        if (steer[0] + steer[1] > maxSpeed){
            steer = normalize(steer);
            steer = [steer[0] * maxSpeed, steer[1] * maxSpeed];
        }

        return steer;
    }

    // the force snuff
    function applyForce(newForce){
        // output.innerHTML = "Force: " + force + "\n";
        acceleration[0] += newForce[0] * (1 / 33);
        acceleration[1] += newForce[1] * (1 / 33);
    }

    // normalizing
    function normalize(vector){
        let magnitude = Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1]);
        vector = [vector[0] / magnitude, vector[1] / magnitude];
        return vector;
    }

    // the force snuff
    function updatePosition(pos){
        // output.innerHTML += "Acceleration: " + acceleration + "\n";
        velocity[0] += acceleration[0];
        velocity[1] += acceleration[1];
        // output.innerHTML += "Velocity: " + velocity + "\n";
        //console.dir("Velocity:" + velocity);
        pos[0] += velocity[0];
        pos[1] += velocity[1];

        // set the movement
        // ball.style.left = pos[0] + "px";
        // ball.style.top = pos[1] + "px";

        return pos;
    }

/*
    function handleInput(event) {
        let key = event.keyCode || event.which;
        let speed = 1;

        let x = ballLeft;
        let y = ballTop;

        console.log(`X: ${x} y: ${y}\nKey: ${key}`);

        // w:119  a:97  d:100  s:115
        if (key == 97){
            // output.innerHTML += "a";
            x -= speed;
        }

        if (key == 100){
            // output.innerHTML += "d";
            x += speed;
        }

        if (key == 115){
            // output.innerHTML += "s";
            y += speed;
        }

        if (key == 119){
            // output.innerHTML += "w";
            y -= speed;
        }

        ballLeft = x;
        ballTop = y;
    }
*/