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

goToBuildingPhase = function(objName){
    var obj = getSelectedObject();
    if(obj.hasAction()){
        getPlayer().goToPlacingObject(objName);
    }
    else{
        // TODO to UI log instead
        console.log('Unit has already acted this turn')
    }
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
        goToBuildingPhase('archery');
    })

    $(document).on("click", "#turnBtn", function () {
        game.changeTurn();
    })

    console.log("Button functions loaded");
}

exports.loadButtons = loadButtons;