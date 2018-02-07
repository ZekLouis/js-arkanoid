var Octopus = function(game, view){
    this.game = game;
    this.view = view;
    var self = this;

    document.addEventListener('keydown', function(ev){
        switch (ev.keyCode){
            case 39:
                // ev.preventDefault();
                self.game.playerRight();
                break;

            case 37:
                // ev.preventDefault();
                self.game.playerLeft();
                break;

            case 32:
                self.game.enableBonuses();
                break;

            case 87:
                self.game.generateBall();
                break;
        }
    }, false);

    document.addEventListener('keyup', function(ev){
        switch (ev.key){
            case 39:
                // ev.preventDefault();
                self.game.playerRight();
                break;

            case 37:
                // ev.preventDefault();
                self.game.playerLeft();
                break;
        }
    }, false);
};

Octopus.prototype.init = function(){
    this.view.render(this.game.data);
    this.game.continue();
    window.requestAnimationFrame(this.init.bind(this, null));
};