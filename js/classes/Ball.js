var Ball = function(x, y, width, height) {
    Entity.call(this, x, y, width, height);
    this.sticky = true
};

Ball.prototype = Object.create(Entity.prototype);

Ball.prototype.constructor = Ball;

Ball.prototype.update = function() {
    if(this.sticky) {
        this.vx *= 0.95;
        this.vy *= 0.95;
    }
    this.x += this.vx;
    this.y += this.vy;
};

Ball.prototype.setXY = function(x,y) {
    this.x = x;
    this.y = y;
};

Ball.prototype.setVelocity = function(x,y) {
    this.vx = x;
    this.vy = y;
};