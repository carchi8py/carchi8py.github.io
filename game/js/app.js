var BOX_WIDTH = 101;
var BOX_HEIGHT = 83;
var BUGY = 60;

var winCounter = $('.win').find('.counter');
var loseCounter = $('.lose').find('.counter');

// Enemies our player must avoid
var Enemy = function(x, y) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';

    //Math random return a number 0 to 1. So this give us 
    //Speeds of 1 to 1001
    this.speed = Math.floor(Math.random()*(1000)+1);
    //X and Y are the location of the player
    this.x = x;
    this.y = y;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    if (this.x > BOX_WIDTH*5) {
        this.x = -BOX_WIDTH
        //Make the speed random
        this.speed = Math.floor(Math.random()*(1000)+1);
    } else {
        this.x += dt * this.speed
    }



    //Because the image of the boy has some white space,
    //The box width needs to be 25 pixel smaller for the
    // bug to touch the boy
    if (!(this.x >= player.x + BOX_WIDTH-25 ||
          this.x + BOX_WIDTH-25 < player.x ||
          this.y >= player.y + BOX_HEIGHT-20 ||
          this.y + BOX_HEIGHT-20 < player.y))
    {
        player.lose +=1;
        console.log('Player died ');
        player.reset()
    }
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function(x, y) {
    this.sprite = 'images/char-boy.png';
    this.x = x;
    this.y = y;
    this.win = 0;
    this.lose = 0;
}

Player.prototype.update = function(dt) {
    if (this.y < 10) {
        this.x = BOX_WIDTH*2*dt;
        this.y = BOX_WIDTH*4*dt;
        player.win +=1
        console.log('Player Wins ');
    }
    winCounter.html(player.win);
    loseCounter.html(player.lose);

}

Player.prototype.reset = function() {
    this.x = BOX_WIDTH*2;
    this.y = BOX_WIDTH*4;
}

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Player.prototype.handleInput = function(key){
    switch(key) {
        case 'up':
            if (this.y > 0) {
                this.y -= BOX_HEIGHT;
            }
            break;
        case 'down':
            if (this.y < BOX_WIDTH*4) {
                this.y += BOX_HEIGHT;
            }
            break;
        case 'left':
            if (this.x > 0) {
                this.x -= BOX_WIDTH;
            }
            break;
        case 'right':
            if (this.x < BOX_WIDTH*4) {
                this.x += BOX_WIDTH;
            }
            break;
    }
}


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var en = new Enemy(0, BUGY+BOX_HEIGHT);
var en2 = new Enemy(0, BUGY);
var en3 = new Enemy(0, BUGY+BOX_HEIGHT*2);

var allEnemies = [en, en2, en3];

var player = new Player(BOX_WIDTH*2, BOX_WIDTH*4)



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
