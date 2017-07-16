
var Player = require('./logic/Player');
var factory = require('./logic/factory');
var Constants = require('./Constants');

var ui = require('./ui/battleUI');

var players = {};

var playerInTurn;

// TODO should take players as parameters
exports.initializeGame = function(){

    players.player1 = Player(0, 'Nick', 'human');
    players.player2 = Player(1, 'Kek', 'human');

    players.player1.addObject('houseHum', {id: 0, x: 0, y: 0});
    players.player2.addObject('houseHum', {id: 100, x: Constants.FIELD_WIDTH*9/10, y: 0});

    // FOR DEBUGGING
    players.player1.gameObjects[0].hp = 17;

    ui.initialize();

    changePlayerInTurn(players.player1);
    console.log(players);
}

exports.players = players;

$('#ctx').click(function (e) {
    var mousePos = getMousePos(e);
    console.log(mousePos.x, mousePos.y);

    var selectedObj = getObjectByCoordinates(mousePos.x, mousePos.y);

    playerInTurn.clickHandle(selectedObj);
    if(selectedObj)
        console.log(selectedObj);
});

var getObjectByCoordinates = function(x, y){

    for(var player in players){

        var gObjs = players[player].gameObjects;

        for(var found in gObjs){

            var obj = gObjs[found];

            if((x > obj.x) && (x < obj.x + obj.width) && (y > obj.y) && (y < obj.y + obj.height)){

                return obj;
            }
        }
    }

    return null;
}

// get mouse position on canvas
var getMousePos = function (e) {
    var rect = Constants.canvas.getBoundingClientRect();

    return {
        x: Math.round((e.clientX-rect.left)/(rect.right-rect.left)*Constants.CANVAS_WIDTH),
        y: Math.round((e.clientY-rect.top)/(rect.bottom-rect.top)*Constants.CANVAS_HEIGHT)
    }
}

// make argument 'player' the new player-in-turn
var changePlayerInTurn = function (player) {
    if(playerInTurn){
        playerInTurn.hasTurn = false;

        // deselects selected object and cleans the UI
        playerInTurn.endTurn();
    }

    player.hasTurn = true;
    playerInTurn = player;
}

// check who's in turn and give the turn to the next player
var changeTurn = function () {
    var plArray = Object.values(players);

    for(var i = 0; i < plArray.length; i++){
        if(plArray[i] === playerInTurn){
            if(++i >= plArray.length){
                i = 0;
            }

            changePlayerInTurn(plArray[i]);
        }
    }
}

// return current player in turn
getPlayerInTurn = function () {
    return playerInTurn;
}

exports.getPlayerInTurn = getPlayerInTurn;
exports.changeTurn = changeTurn;