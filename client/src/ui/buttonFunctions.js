/**
 * Created by Nikolay on 7/16/2017.
 */
var game = require('../game');
var Constants = require('../Constants');

/*DEBUG*/var counter = 0;

getPlayer = function () {
    return game.getPlayerInTurn();
}

getSelectedObject = function () {
    return getPlayer().selectedObject;
}

loadButtons = function () {

    $(document).on("click", "#cancelBtn", function () {
        getPlayer().changeMode(1);
    })

    $(document).on("click", "#buildBtn", function () {
        var obj = getSelectedObject();

        obj.actions.build(obj);
    })

    $(document).on("click", "#archeryBtn", function (){
        getPlayer().addObject('archery', {id: ++counter, x: counter*Constants.FIELD_WIDTH/10, y: 0});
    })

    $(document).on("click", "#turnBtn", function () {
        game.changeTurn();
    })

    console.log("Button functions loaded");
}

exports.loadButtons = loadButtons;