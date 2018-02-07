var Entity = function(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.width = width;
    this.height = height;
};

Entity.prototype.move = function(mx, my){
    this.vx += mx;
    this.vy += my;
};

Entity.prototype.update = function() {
    this.x += this.vx;
    this.y += this.vy;
};