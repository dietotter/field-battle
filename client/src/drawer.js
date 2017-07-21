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

exports.drawGame = function(){
    ctx.clearRect(0,0, Constants.CANVAS_WIDTH, Constants.CANVAS_HEIGHT);

    drawGrid();

    drawGameObjects();
};

exports.initialize = function (plrs) {
    players = plrs;
}