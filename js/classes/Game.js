var Game = function(){
    var self = this;
    this.config = {
        height: 780,
        width: 1024,
        reverse: false,
        gameLevel: 1,
        player: {
            height: 20,
            width: 100,
            speed: 20
        },
        ball: {
            height: 10,
            width: 10,
            speed: 1
        },
        marginBottom: 5
    };

    this.data = {
        bricks: [],
        balls: [],
        player: new Player((self.config.width / 2 - self.config.player.width/2), (self.config.height - self.config.player.height - self.config.marginBottom), self.config.player.width, self.config.player.height),
        running: true
    };
};

Game.prototype.continue = function(){
    // check if game is done
    if(!this.data.running)
        return;

    for(var ball in this.data.balls){
        var ballobj = this.data.balls[ball];

        // ball out of the playing frame
        if (ballobj.x + ballobj.width > this.config.width) {
            ballobj.vx = -(Math.abs(ballobj.vx))
        } else if (ballobj.x < 0 ){
            ballobj.vx = Math.abs(ballobj.vx)
        }

        if (ballobj.y <= 0) {
            ballobj.vy = Math.abs(ballobj.vy)
        } else if (ballobj.y + ballobj.height >= this.config.height) {
            if (this.data.balls.length <= 1) {
                if (this.data.player.lives === 1) {
                    this.data.running = false
                } else {
                    this.data.player.lives --;
                    ballobj.vy = -(Math.abs(ballobj.vy))
                    //this.init();
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

        if (this.col_object(ballobj, this.data.player)) {
            ballobj.vy = -(Math.abs(ballobj.vy))
        }

        /* if (ballobj.y + ballobj.height >= this.config.height) {
            this.data.balls.splice(ball, 1);
        } */
    }

    if (this.data.player.x < 0 || this.data.player.x + this.data.player.width > this.config.width) {
        this.data.player.setVelocity(0, 0);
    }
    this.data.player.update()
};

Game.prototype.col = function(iball, ibrick){
    var brick = this.data.bricks[ibrick];
    var ball = this.data.balls[iball];

    if(typeof ball !== "undefined"){
        var collision = this.col_object(brick, ball);
        if(collision !== 'none') {
            console.log(collision);
            if(ibrick > -1){
                if (brick.level === 1) {
                    this.data.bricks.splice(ibrick, 1);
                } else {
                    this.data.bricks[ibrick].downLevel()
                }
                if(collision === 'bottom' || collision === 'top') {
                    this.data.balls[iball].vy = -this.data.balls[iball].vy;
                } else if (collision === 'left' || collision === 'right'){
                    this.data.balls[iball].vx = -this.data.balls[iball].vx;
                }
            }
        }
    }
};

Game.prototype.col_object = function(r1, r2) {
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
    switch (self.config.gameLevel) {
        default:
        case 1:
            var config = levels[self.config.gameLevel];
            for(var j = 0; j < config.length; j++) {
                var row = config[j];
                for(var i = 0; i < row.length; i++) {
                    var level = row[i];
                    self.data.bricks.push(new Brick(i*100 + 25, j*50 + 20, 70, 30, level));
                }
            }
            break;
    }
};

Game.prototype.clean = function() {
    this.data.balls = []
};

Game.prototype.init = function() {
    console.log('azer')
    var self = this;
    self.clean();
    self.generateBall();
    self.data.player.setCoord((self.config.width / 2 - self.config.player.width/2), (self.config.height - self.config.player.height - self.config.marginBottom), self.config.player.width, self.config.player.height);
};

Game.prototype.generateBall = function() {
    var self = this;
    var ballx = this.data.player.x + this.data.player.width/2 - self.config.ball.width/2;
    var bally = this.data.player.y - self.config.ball.height;
    this.data.balls.push(new Ball(ballx, bally, self.config.ball.width, self.config.ball.height))
};

Game.prototype.nextLevel = function() {
    this.config.gameLevel++;
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
                ballobj.setVelocity(this.data.player.vx, this.data.player.vy)
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
                ballobj.setVelocity(this.data.player.vx, this.data.player.vy)
            }

            this.data.balls[ball] = ballobj;
        }
    }
};

Game.prototype.enableBonuses = function () {
    for(var ball in this.data.balls){
        if (this.data.balls[ball].sticky) {
            this.data.balls[ball].sticky = false;
            this.data.balls[ball].vx = 10;
            this.data.balls[ball].vy = -10;
        }
    }
};