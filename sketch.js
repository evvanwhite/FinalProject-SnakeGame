let snake;
let food;
let gameOver = false;
let highScore = 0;
let eatSound;

function preload() {
  eatSound = loadSound('sounds/correct-choice-43861.mp3'); 
  hitSound = loadSound('sounds/knife-thrust-into-wall-7017.mp3');
  floorImg = loadImage('images/floor.png')
}

function setup() {
  createCanvas(400, 400);
  frameRate(10);
  snake = new Snake();
  food = makeFood();
}

function draw() {
  background(220);
  image(floorImg, - 225, - 25);
  
  if (!gameOver) {
        snake.update();
        snake.checkCollision();
        snake.show();
  }
  else {
    background(220);
    fill(255, 0, 0);
    textSize(32);
    textAlign(CENTER, CENTER);
    text('Game Over!', width / 2, height / 2);
    text(`High Score: ${highScore}`, width / 2, height / 3);
    text('Press R to Retry', width / 2, height / 2 + 50);
    text('Press T to Save Canvas', width / 2, height / 2 + 100);
    noLoop(); // Stop the game loop
  }

  if (snake.eat(food)) {
    food = makeFood();
   }

  fill(255, 0, 0);
  rect(food.x, food.y, 20, 20);
}

//This will check what WASD key you press and set the direction of the snake to that way by changing the width or height by one and setting the other variable to zero. Snake speed will keep moving that direction if the speed of the other direction equals zero.
    function keyPressed() {
      if (!gameOver) {
        if (key === 'W' || key === 'w' && snake.ySpeed === 0) {
          snake.setDirection(0, -1);
        } else if (key === 'S' || key === 's' && snake.ySpeed === 0) {
          snake.setDirection(0, 1);
        } else if (key === 'A' || key === 'a' && snake.xSpeed === 0) {
          snake.setDirection(-1, 0);
        } else if (key === 'D' || key === 'd' && snake.xSpeed === 0) {
          snake.setDirection(1, 0);
        }
      }
      if (gameOver) {
        if (key === 'R' || key === 'r')
        {
          resetGame();
        }
        else if(key === 'T' || key === 't')
          {
            saveCanvas();
          }
      }
    }

//This function will make the food for the snake and set the location to a random location set within a boundary on the canvas. Floor selects the closest integer value (less than or equal to parameter)
function makeFood() {
  const cols = floor(width / 20);
  const rows = floor(height / 20);
  let foodPos;

  do {
    foodPos = createVector(floor(random(cols)), floor(random(rows)));
    foodPos.mult(20);
  } while (snake.collidesWith(foodPos));

  return foodPos;
}

//creates the snake and is used as the constructor which is called in the setup
class Snake {
      constructor() {
        this.body = [createVector(0, 0)];
        this.xSpeed = 1;
        this.ySpeed = 0;
      }
  
  //This Method was added so that food does not spawn inside of the snakes body
collidesWith(position) {
  for (let i = 0; i < this.body.length; i++) {
    const segment = this.body[i];
    if (position.x === segment.x && position.y === segment.y) {
      return true;
    }
  }
  return false;
}

//sets the directional movements
  setDirection(x, y) {
        this.xSpeed = x;
        this.ySpeed = y;
      }
  update() {
        const head = this.body[this.body.length - 1].copy();
        this.body.shift();
        head.x += this.xSpeed * 20;
        head.y += this.ySpeed * 20;
        this.body.push(head);
      }
  
  checkCollision() {
  const head = this.body[this.body.length - 1];
  for (let i = 0; i < this.body.length - 1; i++) {
    const segment = this.body[i];
    if (head.x < 0 || head.x >= width || head.y < 0 || head.y >= height) {
          gameOver = true;
          hitSound.play();
          updateHighScore();
        }
  }

  for (let i = 0; i < this.body.length - 1; i++) {
    const segment = this.body[i];
    if (head.x === segment.x && head.y === segment.y) {
      gameOver = true;
      hitSound.play();
      updateHighScore();
    }
  }
}

  eat(food) {
        const head = this.body[this.body.length - 1];
        if (head.x === food.x && head.y === food.y) {
        this.body.push(createVector(head.x, head.y));
        eatSound.play();
      return true;
    }
    return false;
}

  show() {
        for (let i = 0; i < this.body.length; i++) {
          fill(58, 235, 52);
          noStroke();
          rect(this.body[i].x, this.body[i].y, 20, 20);
        }
      }
}

function updateHighScore() {
      highScore = max(highScore, snake.body.length - 1);
    }
function resetGame() {
  gameOver = false;
  snake = new Snake();
  food = makeFood();
  loop(); // Restart the game loop
}