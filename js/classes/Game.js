var Game = function(){
    var self = this;
    this.config = config;

    this.data = {
        gameLevel: 1,
        bricks: [],
        balls: [],
        bombs: [],
        bonus: [],
        malus: [],
        bonuses_text: [],
        player: new Player((self.config.width / 2 - self.config.player.width/2), (self.config.height - self.config.player.height - self.config.marginBottom), self.config.player.width, self.config.player.height),
        running: true,
        win: false,
        stop: true
    };
};

Game.prototype.continue = function(){
    // check if game is over or the game is win
    if(!this.data.running || this.data.win)
        return;

    // if there is bricks which are not level 4 the level is not over
    if (this.levelEnded() === true && !this.data.stop) {
        this.nextLevel()
    }

    // check for every ball
    for(var ball in this.data.balls){
        var ballobj = this.data.balls[ball];
        if (typeof  ballobj === 'undefined') {
            break
        }
        // if the ball is stick to the player set the x and y same as the player
        if (ballobj.sticky && !ballobj.shooter) {
            ballobj.setXY(this.data.player.x + this.data.player.width/2 - ballobj.width/2, this.data.player.y - ballobj.height);
        }

        // ball out of the playing frame
        this.ballOutOfTheFrame(ballobj, ball);

        // update position is the ball is not removed
        if (typeof this.data.balls[ball] !== 'undefined') {
            this.data.balls[ball].update();
        }

        // check collision between bricks and balls
        for(var brick in this.data.bricks){
            this.col(ball,brick);
        }

        if (!ballobj.shooter) {
            this.ballCollidePlayer(ballobj);
        }
    }

    for(var bomb in this.data.bombs){
        if (this.data.bombs[bomb].y + this.data.bombs[bomb].height > this.config.height) {
            this.data.bombs.splice(bomb, 1);
        } else {
            var collision = this.col_object(this.data.bombs[bomb], this.data.player);
            this.data.bombs[bomb].update();
            if(collision !== 'none' && bomb > -1) {
                this.data.bombs.splice(bomb, 1);
                this.data.player.lives--;
                this.init();
            }
        }
    }

    for(var bon in this.data.bonus){
        if (this.data.bonus[bon].y + this.data.bonus[bon].height > this.config.height) {
            this.data.bonus.splice(bon, 1);
        } else {
            var collision = this.col_object(this.data.bonus[bon], this.data.player);
            this.data.bonus[bon].update();
            if(collision !== 'none' && bon > -1) {
                this.data.bonus.splice(bon, 1);
                this.pickBonus();
            }
        }
    }

    for(var mal in this.data.malus){
        if (this.data.malus[mal].y + this.data.malus[mal].height > this.config.height) {
            this.data.malus.splice(mal, 1);
        } else {
            var collision = this.col_object(this.data.malus[mal], this.data.player);
            this.data.malus[mal].update();
            if(collision !== 'none' && mal > -1) {
                this.data.malus.splice(mal, 1);
                this.pickMalus();
            }
        }
    }

    if (this.data.player.x < 0) {
        this.data.player.setVelocity(0, 0);
        this.data.player.x = 1;
        for(var ball in this.data.balls) {
            this.data.balls[ball].vx = this.data.balls[ball].sticky ? 0 : this.data.balls[ball].vx;
        }
    } else if (this.data.player.x + this.data.player.width > this.config.width) {
        this.data.player.setVelocity(0, 0);
        this.data.player.x = this.config.width - 1 - this.data.player.width;
        for(var ball in this.data.balls) {
            this.data.balls[ball].vx = this.data.balls[ball].sticky ? 0 : this.data.balls[ball].vx;
        }
    }
    this.data.player.update()
};

Game.prototype.col = function(iball, ibrick){
    var brick = this.data.bricks[ibrick];
    var ball = this.data.balls[iball];

    if(typeof ball !== "undefined"){
        var collision = this.col_object(ball, brick);
        if(collision !== 'none') {
            if(ibrick > -1){
                if (this.data.balls[iball].shooter) {
                    this.data.balls.splice(iball, 1);
                } else {
                    if(collision === 'bottom' || collision === 'top') {
                        this.data.balls[iball].vy = -this.data.balls[iball].vy;
                    } else if (collision === 'left' || collision === 'right'){
                        this.data.balls[iball].vx = -this.data.balls[iball].vx;
                    }
                }
                if (brick.level === 1) {
                    this.data.bricks.splice(ibrick, 1);
                    this.spawnItem(brick);
                } else if (brick.level !== 4) {
                    this.data.bricks[ibrick].downLevel()
                }
            }
        }
    }
};

Game.prototype.col_object = function(r2, r1) {
    var dx=(r1.x+r1.width/2)-(r2.x+r2.width/2);
    var dy=(r1.y+r1.height/2)-(r2.y+r2.height/2);
    var width=(r1.width+r2.width)/2;
    var height=(r1.height+r2.height)/2;
    var crossWidth=width*dy;
    var crossHeight=height*dx;
    var collision='none';
    if(Math.abs(dx)<=width && Math.abs(dy)<=height){
        if(crossWidth>crossHeight){
            collision=(crossWidth>(-crossHeight))?'bottom':'left';
        }else{
            collision=(crossWidth>-(crossHeight))?'right':'top';
        }
    }
    return(collision);
};

Game.prototype.start = function() {
    this.generateBricks();
    this.generateBall();
};

Game.prototype.generateBricks = function(){
    var self = this;
    switch (self.data.gameLevel) {
        default:
        case 1:
            var config = levels[self.data.gameLevel];
            for(var j = 0; j < config.length; j++) {
                var row = config[j];
                for(var i = 0; i < row.length; i++) {
                    var level = row[i];
                    if (level !== 0) {
                        self.data.bricks.push(new Brick(i*80 + 10, j*40 + 10, 70, 30, level));
                    }
                }
            }
            break;
    }
};

Game.prototype.clean = function() {
    this.data.balls = [];
};

Game.prototype.init = function() {
    this.data.stop = true;
    var self = this;
    self.clean();
    self.data.player.setCoord((self.config.width / 2 - self.config.player.width/2), (self.config.height - self.config.player.height - self.config.marginBottom), self.config.player.width, self.config.player.height);
    self.data.player.setVelocity(0,0);
    self.generateBall();
};

Game.prototype.generateBall = function() {
    var self = this;
    var ballx = this.data.player.x + this.data.player.width/2 - self.config.ball.width/2;
    var bally = this.data.player.y - self.config.ball.height;
    this.data.balls.push(new Ball(ballx, bally, self.config.ball.width, self.config.ball.height))
};

Game.prototype.nextLevel = function() {
    this.data.gameLevel++;
    if (this.data.gameLevel > 6) {
        this.data.win = true
    } else {
        this.init();
        this.data.bricks = [];
        this.data.bombs = [];
        this.data.bonus = [];
        this.data.malus = [];
        this.data.bricks = [];
        this.data.missiles = [];
        this.generateBricks();
        this.data.player.lives = 3
    }
};

Game.prototype.playerLeft = function() {
    if(!this.data.running)
        return;
    if (this.data.player.x > 0) {
        this.data.player.move(-this.config.player.speed);
    }
};

Game.prototype.playerRight = function() {
    if(!this.data.running)
        return;
    if (this.data.player.x + this.data.player.width < this.config.width) {
        this.data.player.move(this.config.player.speed);
    }
};

Game.prototype.stopPlayer = function () {
    this.data.player.setVelocity(0,0);
};

Game.prototype.enableBonuses = function () {
    this.data.stop = false;
    for(var ball in this.data.balls){
        if (this.data.balls[ball].sticky) {
            this.data.balls[ball].sticky = false;
            if (!this.data.balls[ball].shooter) {
                this.data.balls[ball].vx = this.config.ball.speed / 3;
            }
            this.data.balls[ball].vy = -this.config.ball.speed;
        }
    }

    if(this.data.player.shooter) {
        var ball = new Ball((this.data.player.x + this.data.player.width / 2) , (this.data.player.y - 5), 5, 20);
        ball.setVelocity(0, -this.config.ball.speed * 2);
        ball.shooter = true
        ball.sticky = false
        this.data.balls.push(ball)
    }
};

Game.prototype.levelEnded = function() {
    var end = true;
    for(var brick in this.data.bricks){
        if (this.data.bricks[brick].level !== 4) {
            return false
        }
    }
    return end
};

Game.prototype.ballOutOfTheFrame = function(ballobj, ball) {
    if (ballobj.x + ballobj.width > this.config.width) {
        ballobj.vx = -(Math.abs(ballobj.vx))
    } else if (ballobj.x < 0 ){
        ballobj.vx = Math.abs(ballobj.vx)
    }

    if (ballobj.y <= 0) {
        if (!ballobj.shooter) {
            ballobj.vy = -(ballobj.vy)
        } else {
            this.data.balls.splice(ball, 1);
        }
    } else if (ballobj.y + ballobj.height >= this.config.height) {
        var size = 0;
        for (var ball in this.data.balls) {
            if (!this.data.balls[ball].shooter) {
                size++
            }
        }
        if (size <= 1) {
            if (this.data.player.lives === 1) {
                this.data.running = false
            } else {
                this.data.player.lives--;
                this.init();
            }
        } else {
            if (ballobj.y + ballobj.height >= this.config.height) {
                this.data.balls.splice(ball, 1);
            }
        }
    }
};

Game.prototype.ballCollidePlayer = function(ballobj) {
    if (this.col_object(ballobj, this.data.player) === 'bottom' && !ballobj.sticky) {
        ballobj.vy = -(Math.abs(ballobj.vy))
        var center_ball = ballobj.x + ( ballobj.width / 2 );
        var center_player = this.data.player.x + ( this.data.player.width / 2);
        // if the ball hit the player in the center, go straight, if hit on the left, go on the left, if hit on the right go on the right
        if (center_ball > center_player + this.config.player.center_zone / 2) {
            ballobj.vx = this.config.ball.speed / 3
        } else if (center_ball < center_player - this.config.player.center_zone / 2) {
            ballobj.vx = -(this.config.ball.speed / 3)
        } else {
            ballobj.vx = 0
        }
    }
};

Game.prototype.spawnItem = function(brick) {
    var self = this;
    var rand = Math.random();
    if (rand > 0.90) {
        this.data.bombs.push(new Bomb((brick.x + brick.width / 2) , (brick.y + brick.height / 2), 0, this.config.ball.speed * 1.25, 20, 20))
    } else if (rand > 0.80) {
        this.data.bonus.push(new Bonus((brick.x + brick.width / 2) , (brick.y + brick.height / 2), 0, this.config.ball.speed / 2, 20, 20))
    } else if (rand > 0.70) {
        this.data.malus.push(new Malus((brick.x + brick.width / 2) , (brick.y + brick.height / 2), 0, this.config.ball.speed / 2, 20, 20))
    }
};

Game.prototype.pickBonus = function() {
    var self = this;
    var bonus = this.config.bonus_list[Math.floor(Math.random()*this.config.bonus_list.length)];
    switch (bonus) {
        case 'extended_player':
            this.data.bonuses_text.push(':) - Extended Player');
            this.data.player.width = this.config.player.width * 1.5;
            setTimeout(function() {
                self.data.player.width = self.config.player.width
            }, 20 * 1000);
            break;
        case 'shooter_player':
            this.data.bonuses_text.push(':) - Shooter');
            this.data.player.shooter = true;
            setTimeout(function() {
                self.data.player.shooter = false;
            }, 15 * 1000);
            break;
        case 'extra_balls':
            this.data.bonuses_text.push(':) - Extra balls');
            this.generateBall();
            this.enableBonuses();
            setTimeout(function() {
                self.generateBall();
                self.enableBonuses();
            }, 2000);
            setTimeout(function() {
                self.generateBall();
                self.enableBonuses();
            }, 4000);
            break;
        case 'extra_speed_player':
            this.data.bonuses_text.push(':) - Extra speed for the player');
            this.data.player.factor = 1.5;
            setTimeout(function() {
                self.data.player.factor = 1
            }, 30 * 1000);
            break;
    }
    console.log(bonus)
};

Game.prototype.pickMalus = function() {
    var self = this;
    var malus = this.config.malus_list[Math.floor(Math.random()*this.config.malus_list.length)];
    switch (malus) {
        case 'smaller_player':
            this.data.bonuses_text.push(':( - Smaller player');
            this.data.player.width = this.config.player.width * 0.75;
            setTimeout(function() {
                self.data.player.width = self.config.player.width;
            }, 20 * 1000);
            break;
        case 'reverse_direction':
            this.data.bonuses_text.push(':( - Reverse direction');
            var tmp = Game.prototype.playerLeft;
            Game.prototype.playerLeft = Game.prototype.playerRight;
            Game.prototype.playerRight = tmp;
            setTimeout(function() {
                tmp = Game.prototype.playerLeft;
                Game.prototype.playerLeft = Game.prototype.playerRight;
                Game.prototype.playerRight = tmp;
            }, 15 * 1000);
            break;
        case 'smaller_speed':
            this.data.bonuses_text.push(':( - Less speed for the player');
            this.data.player.factor = 0.5;
            setTimeout(function() {
                self.data.player.factor = 1;
            }, 10 * 1000);
        case 'extra_speed_ball':
            this.data.bonuses_text.push(':( - More speed for the balls');
            for(var ball in this.data.balls){
                self.data.balls[ball].vy = 1.5 * self.config.ball.speed;
                setTimeout(function() {
                    if(typeof self.data.balls[ball] !== 'undefined') {
                        self.data.balls[ball].vy = self.config.ball.speed
                    }
                }, 10 * 1000);
            }
            break;
    }
    console.log(malus)
};