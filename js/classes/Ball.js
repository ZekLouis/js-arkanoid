/**
 * Ball object
 * @param x position
 * @param y position
 * @param width
 * @param height
 * @constructor
 */
var Ball = function(x, y, width, height) {
    Entity.call(this, x, y, width, height);
    this.sticky = true
};

Ball.prototype = Object.create(Entity.prototype);

Ball.prototype.constructor = Ball;

/**
 * Update the ball position regarding to the velocity
 */
Ball.prototype.update = function() {
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