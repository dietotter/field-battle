var ctx = document.getElementById("ctx").getContext("2d");

ctx.font = '30px Arial';

var Constants = require('./Constants');

var players = {};

// draws players' parts of the battlefield in different colours (better just stroke, but can also fill)
var drawGrid = function(){
    for(var player in players){
        var pl = players[player];
        ctx.save();
        ctx.strokeStyle = pl.color;
        ctx.strokeRect(pl.fieldPart.a.x, pl.fieldPart.a.y, pl.fieldPart.width - 1, pl.fieldPart.height -1);
        ctx.restore();
    }
};

var drawGameObjects = function(){

    for(var player in players){

        players[player].gameObjects.forEach(function (obj) {
            obj.draw();
        });

    }
}

// draw players' gold
// TODO thinking about drawing it on top panel instead
var drawGold = function () {
    ctx.save();
    ctx.textAlign = 'center';
    for(var player in players){
        var pl = players[player];

        var y = Constants.FIELD_HEIGHT/20;
        var x = pl.id % 2 === 0 ? -1 * (pl.id / 2 + 1) : ((pl.id + 1) / 2);
        ctx.fillStyle = pl.color;
        // Math.floor is to avoid too long numbers on canvas with float
        ctx.fillText(Math.floor(pl.gold), Constants.FIELD_WIDTH/2 + x * Constants.FIELD_WIDTH/20, y);
    }
    ctx.restore();
}

exports.drawGame = function(){
    ctx.clearRect(0,0, Constants.CANVAS_WIDTH, Constants.CANVAS_HEIGHT);

    drawGrid();

    drawGameObjects();

    drawGold();
};

exports.initialize = function (plrs) {
    players = plrs;
}