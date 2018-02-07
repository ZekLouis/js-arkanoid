var Brick = function(x,y,width,height,level) {
    Entity.call(this, x, y, width, height);
    this.level = level;
    this.x = x;
    this.y = y;
};

Brick.prototype = Object.create(Entity.prototype);

Brick.prototype.constructor = Brick;

Brick.prototype.downLevel = function() {
    this.level--
};