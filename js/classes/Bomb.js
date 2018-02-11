var Bomb = function(x, y, vx, vy, width, height) {
    Entity.call(this, x, y, width, height);
    this.vx = vx;
    this.vy = vy;
};

Bomb.prototype = Object.create(Entity.prototype);

Bomb.prototype.constructor = Bomb;

Bomb.prototype.update = function() {
    this.x += this.vx;
    this.y += this.vy;
};

Bomb.prototype.setXY = function(x,y) {
    this.x = x;
    this.y = y;
};

Bomb.prototype.setVelocity = function(x,y) {
    this.vx = x;
    this.vy = y;
};