var factory = require('./factory');
var ui = require('../ui/battleUI');
var Constants = require('../Constants');

var ModeEnum = {
    // nothing is selected
    DEFAULT: 0,
    // own structure or unit is selected
    OBJECT_SELECTED: 1,
    // placing new structure or unit on the battlefield (? this may apply also to summon abilities, if such will exist)
    PLACING_OBJECT: 2,
    // targeting any structure/unit with an ability
    TARGETING_ABILITY: 3

}

var Player = function(id, name, race){
    var self = {
        id: id,
        name: name,
        race: race,
        gameObjects: [],
        gold: 500,
        hasTurn: false,
        selectedObject: null,
        mode: ModeEnum.DEFAULT,
        addObject: function (objectName, data) {
            self.gameObjects.push(factory(objectName, {id: data.id, x: data.x, y: data.y, player: self}));
        }
    };

    // deselect currently selected object and return it if such exists
    self.deselectObject = function () {
        // set mode to default (no objects selected)
        self.changeMode(ModeEnum.DEFAULT);

        var obj = self.selectedObject;

        if(obj){
            obj.isSelected = false;
            self.selectedObject = null;

            return obj;
        }

        return null;
    }

    // select an object
    self.selectObject = function (obj) {
        // firstly deselect currently selected object
        self.deselectObject();

        if(obj){
            obj.isSelected = true;
            self.selectedObject = obj;

            // set mode to object selected
            self.changeMode(ModeEnum.OBJECT_SELECTED);
        }
    }

    self.attackHandle = function (obj) {
        var sObj = self.selectedObject;
        if(sObj.canAttack()){
            sObj.actions.attack(sObj, obj);
            self.deselectObject();
        }
        else{
            console.log("Can't attack");
            // Print this to UI instead
            // ? print reasons (has already acted this turn, has no attack, special conditions)

            self.selectObject(obj); // ? maybe not needed
        }
    }

    // handle mouse clicks on the battlefield
    self.clickHandle = function (obj) {
        switch(this.mode){
            // if nothing is selected
            case ModeEnum.DEFAULT:
                self.selectObject(obj);
                break;

            // if own structure or unit is selected (REDO the if/else probably)
            case ModeEnum.OBJECT_SELECTED:
                // if there is no object - deselect, if clicked on own object or it's not Player's turn - reselect
                // Also, if currently selected object is not your object, don't attack either
                // TODO should also check if ally or enemy (if ally - select, enemy - attack)
                if(!obj || obj.playerInControl === this || !self.hasTurn || self.selectedObject.playerInControl !== this){
                    self.selectObject(obj);
                }
                else{
                    self.attackHandle(obj);
                }
                break;

            // TODO
            case ModeEnum.PLACING_OBJECT:
                break;

            // TODO
            case ModeEnum.TARGETING_ABILITY:
                break;
        }

        self.updateUI();
    }


    // here object portrait, stats, active abilities are retrieved and sent to battleUI class to update bottom interface panel
    // NO PORTRAIT AND STATS YET IMPLEMENTED (ONLY BUTTONS)
    self.updateUI = function () {
        var mode = self.mode;
        var obj = self.selectedObject;
        // when nothing is selected
        if(!obj || mode === ModeEnum.DEFAULT){
            // no buttons or portrait
            ui.updateBottomPanel();
        }

        // retrieve object data
        var objData = {
            buttonDataList: []
        };

        // if an object is selected
        if(mode === ModeEnum.OBJECT_SELECTED){
            // draw portrait, stats

            // draw active buttons if Player is in turn and the object belongs to Player
            if(self.hasTurn && obj.playerInControl === self){
                // add object available actions
                for(var act in obj.actions){

                    if(act !== 'attack')
                        objData.buttonDataList.push({
                            panel: 'bottom',
                            name: act
                        });
                };
            }

        }
        // if an object is being placed or if an ability is targeted
        if(mode === ModeEnum.PLACING_OBJECT || mode === ModeEnum.TARGETING_ABILITY){
            // draw portrait, stats and 'cancel' button

            // add 'cancel' button
            objData.buttonDataList.push({
                panel: 'bottom',
                name: 'cancel'
            });
        }

        ui.updateBottomPanel(objData);

    }

    // when ending turn, deselect object (also sets mode to default and updates UI)
    self.endTurn = function () {
        self.deselectObject();
    }

    self.changeMode = function (mode) {
        self.mode = mode;
        self.updateUI();
    }

    return self;
}

module.exports = Player;