
var Player = require('./logic/Player');
var factory = require('./logic/factory');
var Constants = require('./Constants');

var ui = require('./ui/battleUI');

var players = {};

var playerInTurn;

exports.initializeGame = function(){

    players.player1 = Player(0, 'Nick', 'human');
    players.player2 = Player(1, 'Kek', 'human');

    changePlayerInTurn(players.player1);
    players.player1.addObject('houseHum', {id: 0, x: 0, y: 0});
    players.player2.addObject('houseHum', {id: 100, x: Constants.FIELD_WIDTH*9/10, y: 0});

    // FOR DEBUGGING
    players.player1.gameObjects[0].hp = 17;

    console.log(players);
}

exports.players = players;

$('#ctx').click(function (e) {
    var mousePos = getMousePos(e);
    console.log(mousePos.x, mousePos.y);

    var selectedObj = getObjectByCoordinates(mousePos.x, mousePos.y);

    // ================== DEBUG START ==================
   /* if(!selectedObj){
        ui.addButton({
            panel: 'top',
            name: 'test',
            clickFunction: function () {
                players.player1.addObject('archery', {id: 1, x: Constants.FIELD_WIDTH/10, y: Constants.FIELD_HEIGHT*2/10});
            },
            bottomText: 'Make archery for cool dude'
        });

        ui.addButton({
            panel: 'bottom',
            name: 'try',
            clickFunction: function () {
                players.player2.addObject('archery', {id: 101, x: Constants.FIELD_WIDTH*8/10, y: Constants.FIELD_HEIGHT*4/10});
            }
        });
    }*/
    // ================== DEBUG END ==================

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

var changePlayerInTurn = function (player) {
    if(playerInTurn){
        playerInTurn.hasTurn = false;
    }

    player.hasTurn = true;
    playerInTurn = player;
}

// ?? in single player need to deselect selected object when player ends the turn (though this should not be the case in multiplayer)