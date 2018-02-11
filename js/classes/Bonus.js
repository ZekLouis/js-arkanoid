var Bonus = function(x, y, vx, vy, width, height) {
    Entity.call(this, x, y, width, height);
    this.vx = vx;
    this.vy = vy;
};

Bonus.prototype = Object.create(Entity.prototype);

Bonus.prototype.constructor = Bonus;

Bonus.prototype.update = function() {
    this.x += this.vx;
    this.y += this.vy;
};

Bonus.prototype.setXY = function(x,y) {
    this.x = x;
    this.y = y;
};

Bonus.prototype.setVelocity = function(x,y) {
    this.vx = x;
    this.vy = y;
};