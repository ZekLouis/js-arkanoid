var Game = function(){
    var self = this;
    this.config = {
        height: 780,
        width: 655,
        reverse: false,
        player: {
            height: 20,
            width: 150,
            speed: 10,
            center_zone: 50
        },
        ball: {
            height: 10,
            width: 10,
            speed: 7
        },
        marginBottom: 5
    };

    this.data = {
        gameLevel: 6,
        bricks: [],
        balls: [],
        player: new Player((self.config.width / 2 - self.config.player.width/2), (self.config.height - self.config.player.height - self.config.marginBottom), self.config.player.width, self.config.player.height),
        running: true,
        win: false
    };
};

Game.prototype.continue = function(){
    // check if game is done

    if(!this.data.running || this.data.win)
        return;

    var end = true
    for(var brick in this.data.bricks){
        if (this.data.bricks[brick].level !== 4) {
            end = false
        }
    }

    if (end) {
        this.nextLevel()
    }

    for(var ball in this.data.balls){
        var ballobj = this.data.balls[ball];

        // ball out of the playing frame
        if (ballobj.x + ballobj.width > this.config.width) {
            ballobj.vx = -(Math.abs(ballobj.vx))
        } else if (ballobj.x < 0 ){
            ballobj.vx = Math.abs(ballobj.vx)
        }

        if (ballobj.y <= 0) {
            ballobj.vy = -(ballobj.vy)
        } else if (ballobj.y + ballobj.height >= this.config.height) {
            if (this.data.balls.length <= 1) {
                if (this.data.player.lives === 1) {
                    this.data.running = false
                } else {
                    this.data.player.lives--;
                    // ballobj.vy = -(Math.abs(ballobj.vy))
                    this.init();
                }
            } else {
                if (ballobj.y + ballobj.height >= this.config.height) {
                    this.data.balls.splice(ball, 1);
                }
            }
        }

        if (typeof this.data.balls[ball] !== 'undefined') {
            this.data.balls[ball].update();
        }

        for(var brick in this.data.bricks){
            this.col(ball,brick);
        }

        if (this.col_object(ballobj, this.data.player) === 'bottom' && !ballobj.sticky) {
            ballobj.vy = -(Math.abs(ballobj.vy))
            var center_ball = ballobj.x + ( ballobj.width / 2 );
            var center_player = this.data.player.x + ( this.data.player.width / 2);
            if (center_ball > center_player + this.config.player.center_zone / 2) {
                ballobj.vx = this.config.ball.speed / 3
            } else if (center_ball < center_player - this.config.player.center_zone / 2) {
                ballobj.vx = -(this.config.ball.speed / 3)
            } else {
                ballobj.vx = 0
            }
        }

        /* if (ballobj.y + ballobj.height >= this.config.height) {
            this.data.balls.splice(ball, 1);
        } */
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
    // console.log(this.data.player)
    this.data.player.update()
};

Game.prototype.col = function(iball, ibrick){
    var brick = this.data.bricks[ibrick];
    var ball = this.data.balls[iball];

    if(typeof ball !== "undefined"){
        var collision = this.col_object(ball, brick);
        if(collision !== 'none') {
            if(ibrick > -1){
                if(collision === 'bottom' || collision === 'top') {
                    this.data.balls[iball].vy = -this.data.balls[iball].vy;
                } else if (collision === 'left' || collision === 'right'){
                    this.data.balls[iball].vx = -this.data.balls[iball].vx;
                }
                if (brick.level === 1) {
                    this.data.bricks.splice(ibrick, 1);
                } else if (brick.level !== 4) {
                    this.data.bricks[ibrick].downLevel()
                }
            }
        }
    }
};

Game.prototype.col_object = function(r2, r1) {
    /* return !(
    ((a.y + a.height) < (b.y)) ||
    (a.y > (b.y + b.height)) ||
    ((a.x + a.width) < b.x) ||
    (a.x > (b.x + b.width))); */
    var dx=(r1.x+r1.width/2)-(r2.x+r2.width/2);
    var dy=(r1.y+r1.height/2)-(r2.y+r2.height/2);
    var width=(r1.width+r2.width)/2;
    var height=(r1.height+r2.height)/2;
    var crossWidth=width*dy;
    var crossHeight=height*dx;
    var collision='none';
    //
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
    this.data.balls = []
};

Game.prototype.init = function() {
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
        this.generateBricks();
    }
};

Game.prototype.playerLeft = function() {
    if(!this.data.running)
        return;
    if (this.data.player.x > 0) {
        this.data.player.move("-", this.config.player.speed);
        for(var ball in this.data.balls){
            var ballobj = this.data.balls[ball];

            if (ballobj.sticky) {
                ballobj.setXY(this.data.player.x + this.data.player.width/2 - ballobj.width/2, this.data.player.y - ballobj.height)
            }

            this.data.balls[ball] = ballobj;
        }
    }
};

Game.prototype.playerRight = function() {
    if(!this.data.running)
        return;
    if (this.data.player.x + this.data.player.width < this.config.width) {
        this.data.player.move("+",this.config.player.speed);
        for(var ball in this.data.balls){
            var ballobj = this.data.balls[ball];

            if (ballobj.sticky) {
                ballobj.setXY(this.data.player.x + this.data.player.width/2 - ballobj.width/2, this.data.player.y - ballobj.height)
            }

            this.data.balls[ball] = ballobj;
        }
    }
};

Game.prototype.stopPlayer = function () {
    this.data.player.setVelocity(0,0);
    for(var ball in this.data.balls){
        var ballobj = this.data.balls[ball];

        if (ballobj.sticky) {
            ballobj.setXY(this.data.player.x + this.data.player.width/2 - ballobj.width/2, this.data.player.y - ballobj.height)
        }

        this.data.balls[ball] = ballobj;
    }
};

Game.prototype.enableBonuses = function () {
    for(var ball in this.data.balls){
        if (this.data.balls[ball].sticky) {
            this.data.balls[ball].sticky = false;
            this.data.balls[ball].vx = this.config.ball.speed / 3;
            this.data.balls[ball].vy = -this.config.ball.speed;
        }
    }
};