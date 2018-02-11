var Malus = function(x, y, vx, vy, width, height) {
    Entity.call(this, x, y, width, height);
    this.vx = vx;
    this.vy = vy;
};

Malus.prototype = Object.create(Entity.prototype);

Malus.prototype.constructor = Malus;

Malus.prototype.update = function() {
    this.x += this.vx;
    this.y += this.vy;
};

Malus.prototype.setXY = function(x,y) {
    this.x = x;
    this.y = y;
};

Malus.prototype.setVelocity = function(x,y) {
    this.vx = x;
    this.vy = y;
};