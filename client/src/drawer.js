var ctx = document.getElementById("ctx").getContext("2d");

ctx.font = '30px Arial';

var Constants = require('./Constants');

var common = require('./logic/races/common');
var Entity = require('./logic/Entity');
var Player = require('./logic/Player');

var game = require('./game');

// draws grid, where units are to be placed
var drawGrid = function(){
    for(var i = 0; i < 10; i++){
        for(var j = 0; j < 10; j++){
            ctx.strokeRect(i * Constants.FIELD_WIDTH/10, j * Constants.FIELD_HEIGHT/10, Constants.FIELD_WIDTH/10, Constants.FIELD_HEIGHT/10);
        }
    }
};

var drawGameObjects = function(){

    for(var player in game.players){

        game.players[player].gameObjects.forEach(function (obj) {
            obj.draw();
        });

    }
}

exports.drawGame = function(){
    ctx.clearRect(0,0, Constants.CANVAS_WIDTH, Constants.CANVAS_HEIGHT);

    drawGrid();

    drawGameObjects();
};