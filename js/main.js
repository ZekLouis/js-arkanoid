var game = new Game();
var view = new View();
var octopus = new Octopus(game,view);

game.start();

window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

octopus.init()
//window.requestAnimationFrame(octopus.init.bind(octopus,null));