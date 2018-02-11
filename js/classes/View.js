var View = function(){
    this.gamediv = document.querySelector('#game');

    // TEMPLATES
    this.brick_template = document.querySelector('.brick');
    this.player_template = document.querySelector('.player');
    this.ball_template = document.querySelector('.ball');
    this.bomb_template = document.querySelector('.bomb');
    this.bonus_template = document.querySelector('.bonus');
    this.malus_template = document.querySelector('.malus');

    // TEXT BONUSES
    this.text_1 = document.querySelector('#bon-1');
    this.text_2 = document.querySelector('#bon-2');
    this.text_3 = document.querySelector('#bon-3');
    this.text_4 = document.querySelector('#bon-4');

    // VIEW ELEMENTS
    this.lives = document.querySelector('.lives');
    this.level = document.querySelector('.level');
    this.level_val = document.querySelector('#level');
    this.win_screen = document.querySelector('.win')
};

View.prototype.clean = function(){
    this.gamediv.innerHTML = "";
};

View.prototype.render = function(data) {
    if(data.running && !data.win){
        if(data.stop) {
            this.level.classList.remove('hidden')
        } else {
            this.level.classList.add('hidden')
        }
        this.clean();
        this.level_val.innerText = data.gameLevel;
        var name = this.lives.classList[1];
        this.lives.classList.remove(name);
        this.lives.classList.add('nb-' + data.player.lives);
        this.render_bricks(data.bricks);
        this.render_player(data.player);
        this.render_balls(data.balls);
        this.render_bombs(data.bombs);
        this.render_malus(data.malus);
        this.render_bonus(data.bonus);
        this.render_bonuses_text(data.bonuses_text);
    } else {
        if(data.win) {
            this.win_screen.style.opacity = 1
        } else {
            this.gameover();
        }
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
        this.render_element(balls[ball], this.ball_template)
    }
};

View.prototype.render_bombs = function(bombs) {
    for(var bomb in bombs) {
        this.render_element(bombs[bomb], this.bomb_template)
    }
};

View.prototype.render_malus = function(malus) {
    for(var malu in malus) {
        this.render_element(malus[malu], this.malus_template)
    }
};

View.prototype.render_bonus = function(bonus) {
    for(var bonu in bonus) {
        this.render_element(bonus[bonu], this.bonus_template)
    }
};

View.prototype.render_bonuses_text = function(texts) {
    if(typeof texts[texts.length - 1] !== 'undefined') {
        this.text_1.innerText = texts[texts.length - 1]
    }

    if(typeof texts[texts.length - 2] !== 'undefined') {
        this.text_2.innerText = texts[texts.length - 2]
    }

    if(typeof texts[texts.length - 3] !== 'undefined') {
        this.text_3.innerText = texts[texts.length - 3]
    }

    if(typeof texts[texts.length - 4] !== 'undefined') {
        this.text_4.innerText = texts[texts.length - 4]
    }
};

View.prototype.render_element = function(element, template){
    var new_element = document.importNode(template.content, true);
    var el = new_element.querySelector('.sprite');

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

View.prototype.hideLevel = function() {
    this.level.classList.add('hidden')
};