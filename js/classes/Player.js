var Player = function(x, y, width, height) {
    Entity.call(this, x, y, width, height);
    this.lives = 3;
    this.factor = 1;
    this.shooter = false;
};

Player.prototype = Object.create(Entity.prototype);

Player.prototype.constructor = Player;

Player.prototype.move = function(x) {
    this.vx += x;
    this.vx = Math.max(-10, this.vx);
};

Player.prototype.update = function() {
    // this.vx *= 0.8;
    this.x += this.vx * this.factor;
};

Player.prototype.setVelocity = function(x,y) {
    this.vx = x;
    this.vy = y;
};

Player.prototype.setCoord = function(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
};
