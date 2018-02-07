var View = function(){
    this.gamediv = document.querySelector('#game');
    this.brick_template = document.querySelector('.brick');
    this.player_template = document.querySelector('.player');
    this.ball_tempalte = document.querySelector('.ball');
    this.vies = document.querySelector('#vies');
};

View.prototype.clean = function(){
    this.gamediv.innerHTML = "";
};

View.prototype.render = function(data) {
    if(data.running){
        this.vies.innerText = data.player.lives
        this.clean();
        this.render_bricks(data.bricks);
        this.render_player(data.player);
        this.render_balls(data.balls)
    } else {
        this.gameover();
    }
};

View.prototype.render_bricks = function(bricks) {
    for(var brick in bricks) {
        this.render_element(bricks[brick], this.brick_template)
    }
};

View.prototype.render_player = function(player) {
    this.render_element(player, this.player_template)
};

View.prototype.render_balls = function(balls) {
    for(var ball in balls) {
        this.render_element(balls[ball], this.ball_tempalte)
    }
};

View.prototype.render_element = function(element, template){
    var new_element = document.importNode(template.content, true);
    var el = new_element.querySelector('div.sprite');

    el.style.width = element.width+"px";
    el.style.height = element.height+"px";
    el.style.top = element.y+"px";
    el.style.left = element.x+"px";
    if(typeof element.level !== 'undefined') {
        el.className += ' level-' + element.level
    }

    this.gamediv.appendChild(new_element);
};

View.prototype.gameover = function(){
    var gameover = document.querySelector(".gameover");
    gameover.style.zIndex = 1;
};