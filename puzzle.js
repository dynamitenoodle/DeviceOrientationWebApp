    // window functions
    window.onload = function() { start(); };
    //window.addEventListener("keypress", handleInput, true);

    // the update loop interval
    setInterval(gameLoop, 1000 / 33);

    // attributes
    let c = document.getElementById("myCanvas");
    let ctx = c.getContext("2d");
    let back = new Image();

    // ball stuff
    // let ball   = document.querySelector('.ball');
    let radius = 10;
    let garden = document.querySelector('.garden');
    let output = document.querySelector('.output');

    let maxX = c.clientWidth  - radius;
    let maxY = c.clientHeight - radius;

    // movement stuff, the 1st number is x and the 2nd number is y
    let position = [240, 240];
    let velocity = [0, 0];
    let acceleration = [0, 0];
    let force = [0, 0];
    let maxSpeed = 15;

    // labryrinth walls
    let walls = [[150, 75, 100, 100]];

    // user Input
    let keysPressed = {};

    document.addEventListener("keydown", function(e) {
        keysPressed[e.keyCode] = true;
    });

    document.addEventListener("keyup", function(e) {
        keysPressed[e.keyCode] = false;
    });

    window.addEventListener("deviceorientation", handleOrientation, true);
    let xOrient = 0;
    let yOrient = 0;

    // what happens at the start of the game
    function start(){
        drawGameBoard();
        drawBall(position);
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

        // drawing steps
        drawGameBoard();
        for (let i = 0; i < walls.length; i++){
            drawLabryrinth(position, walls[i]);            
        }
        drawBall(position);
    }
    
    // drawing the game board
    function drawGameBoard(pos){
        // background
        ctx.fillStyle = "black";
        
        ctx.fillRect(0, 0, 500, 500);
        ctx.clearRect(15, 15, 470, 470);
        //ctx.fill();
    }

    // drawing the ball
    function drawBall(pos){
        ctx.beginPath();
        ctx.arc(pos[0], pos[1], radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'red';
        ctx.fill();
        ctx.lineWidth = 5;
        ctx.strokeStyle = '#003300';
        ctx.stroke;

        
        // the bounding box of the circle
        //ctx.rect(pos[0] - radius, pos[1] - radius, radius * 2, radius * 2);
        ctx.rect(pos[0] - radius, pos[1] - radius, radius * 2, radius * 2);        
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.stroke();
        
    }

    // drawing the labyrinth
    function drawLabryrinth(pos, wallBox){
        ctx.fillStyle = 'blue';
        ctx.fillRect(wallBox[0], wallBox[1], wallBox[2], wallBox[3]);   
    }

    // collisions with the borders
    function checkBorders(pos){
        ballBox = [pos[0] - radius, pos[1] - radius, radius * 2, radius * 2];
        borders = [15, 15, maxX-15, maxY-15];

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
        let leaway = 5;
        let rightWall = wallBox[0] + wallBox[2];
        let leftWall = wallBox[0];
        let botWall = wallBox[1] + wallBox[3];
        let topWall = wallBox[1];

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

        if (check){ 
            // left Wall
            if (pos[0] + radius > leftWall && pos[0] + radius < leftWall + leaway){
                //pos[0] = leftWall - radius;
                velocity[0] = -velocity[0];
            }

            // right Wall
            if (pos[0] - radius < rightWall && pos[0] - radius > rightWall - leaway){
                //pos[0] = rightWall + radius;
                velocity[0] = -velocity[0];
            }

             // top Wall
            if (pos[1] + radius > topWall && pos[1] + radius < topWall + leaway) {
                //pos[1] = top - radius;
                velocity[1] = -velocity[1];
            }

            // right Wall
            if (pos[1] - radius < botWall && pos[1] - radius > botWall - leaway){
                //pos[1] = rightWall + radius;
                velocity[1] = -velocity[1];
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
    }

    function handleOrientation(event) {
      let x = event.beta;  // In degree in the range [-180,180]
      let y = event.gamma; // In degree in the range [-90,90]

      output.innerHTML  = "beta / X : " + x + "\n";
      output.innerHTML += "gamma / Y: " + y + "\n";

      // Because we don't want to have the device upside down
      // We constrain the x value to the range [-90,90]
      if (x >  90) { x =  90};
      if (x < -90) { x = -90};

      setValues(x, y);
    }

    function setValues(x, y){
        xOrient = x;
        yOrient = y;
    }

    function movement(pos, x, y){
        // testing basic movement
        let modify = 10;
        x = x / modify;
        y = y / modify;
        console.dir("X: " + x + "  Y: " + y);
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

        // bail out early is theres no movement
        if ((x == 0 && y == 0) && (velocity[0] == 0 && velocity[1] == 0))
            return pos;

        else if (x == 0 && y == 0){
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