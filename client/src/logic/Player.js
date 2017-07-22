var factory = require('./factory');
var ui = require('../ui/battleUI');
var Constants = require('../Constants');
var ObjectConstants = require('./ObjectConstants')

var Point = require('../geometry/Point');
var Rectangle = require('../geometry/Rectangle');

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

var Player = function(id, name, race, color){
    var self = {
        id: id,
        name: name,
        race: race,
        gameObjects: [],
        gold: 1500,
        hasTurn: false,
        selectedObject: null,
        mode: ModeEnum.DEFAULT,
        fieldPart: null, // Rectangle
        objectBeingPlaced: null, // String
        color: color || '#D00' // Player's color
    };

    // ================ INITIALIZATION ================
    self.initialize = function (playersCount) {
        // Firstly, we set player's part of the field
        self.setFieldPart(playersCount);
        // get x of main building
        var x = id % 2 === 0 ? self.fieldPart.a.x : self.fieldPart.b.x - Constants.Img.house.width;
        // get y of main building
        var y = self.fieldPart.a.y;
        // Then, we add main building to the player
        self.addObject('house' + race, {id: self.id*100, x: x, y: y});
    }

    // player's part of the battlefield depending on the amount of players and player's id
    self.setFieldPart = function (playersCount) {
        // get amount of players in the game
        var plCount = playersCount;
        // get by how much we should divide the field on Y axis
        var divY = plCount/2;
        // get whether you're on the right or the left side (left side id's are even, right - odd)
        var x = id % 2;
        // get how far down are you
        var y = (id - x) / 2;
        // horizontal part of the field
        var hor = Constants.FIELD_WIDTH/2;
        // vertical part of the field
        var vert = Constants.FIELD_HEIGHT/divY;
        // append field part to player
        self.fieldPart = new Rectangle(x * hor, y * vert, hor, vert);
    }

    // ================ OBJECT HANDLING ================
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

    // ================ ACTIONS HANDLING ================
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
    self.clickHandle = function (x, y, obj) {
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

            // when placing object onto the battlefield
            case ModeEnum.PLACING_OBJECT:
                // get object image to know width and height of it
                var objIm = Constants.Img[self.objectBeingPlaced];

                // TODO need to implement id system
                // if there is no object here and all the conditions are matched, place object and change mode to 'object selected'
                if(!obj && self.canPlaceObject(x, y, objIm.width, objIm.height)){
                    self.addObject(self.objectBeingPlaced, {id: 1234, x: x - objIm.width/2, y: y - objIm.height/2});
                    self.changeMode(ModeEnum.OBJECT_SELECTED);
                    self.selectedObject.dropAction();
                }
                else{
                    console.log('Can\'t place an object here'); // to UI log instead
                }
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

    // ================ MODE AND TURN HANDLING ================
    // when ending turn, deselect object (also sets mode to default and updates UI) and set 'hasTurn' to false
    self.endTurn = function () {
        self.hasTurn = false;
        self.deselectObject();
    }

    // when starting turn
    self.startTurn = function () {
        // 'hasTurn' => true
        self.hasTurn = true;

        var gObjs = self.gameObjects;
        // make all player's units/structures be able to act and add money from farming structures
        for(var o in gObjs){
            var obj = gObjs[o];
            obj.restoreAction();

            if(obj.passiveAbilities.farmingStructure){
                obj.passiveAbilities.farmingStructure(obj);
            }
        }
    }

    self.changeMode = function (mode) {
        self.mode = mode;
        self.updateUI();
    }

    // ================ GAME OBJECT CREATION ================
    // change mode to placing object
    self.goToPlacingObject = function (objName) {
        var objCost = ObjectConstants.ALL_CHARACTERISTICS[objName].cost;
        // first of all, check whether there is enough money
        if(self.gold >= objCost){
            // if yes, go to placing object phase
            self.objectBeingPlaced = objName;
            self.changeMode(ModeEnum.PLACING_OBJECT);
        } else{
            // TODO if not, print it to UI instead
            console.log('You have not enough money to build ' + objName + '. Its cost is ' + objCost + 'g. You have ' + self.gold + ' g.');
        }
    }

    self.canPlaceObject = function (x, y, width, height) {
        // Firstly, we need to know if click fits player's part of the field
        // mouse click is in the center of an object
        // check bottom right and top left points of an object top fit
        var brX = x + width/2;
        var brY = y + height/2;
        var tlX = x - width/2;
        var tlY = y - height/2;
        if(!self.fieldPart.inBounds(brX, brY) || !self.fieldPart.inBounds(tlX, tlY))
            return false;

        // check if object crosses other objects
        if(getObjectByRectangle(new Rectangle(tlX, tlY, width, height), self.gameObjects))
            return false;

        return true;
    }

    // add object to player's object list and substract the cost of object from player's gold
    self.addObject = function (objectName, data) {
        var obj = factory(objectName, {id: data.id, x: data.x, y: data.y, player: self});
        self.gameObjects.push(obj);
        self.gold -= obj.cost;
    }

    return self;
}

module.exports = Player;

var getObjectByRectangle = function (rect, gObjs) {

    for(var found in gObjs){

        var obj = gObjs[found];

        var a = rect.a;
        var b = rect.b;
        var c = rect.c;
        var d = rect.d;

        // TODO need to change this to something more elegant
        if(((a.x > obj.x) && (a.x < obj.x + obj.width) && (a.y > obj.y) && (a.y < obj.y + obj.height))
            || ((b.x > obj.x) && (b.x < obj.x + obj.width) && (b.y > obj.y) && (b.y < obj.y + obj.height))
            || ((c.x > obj.x) && (c.x < obj.x + obj.width) && (c.y > obj.y) && (c.y < obj.y + obj.height))
            || ((d.x > obj.x) && (d.x < obj.x + obj.width) && (d.y > obj.y) && (d.y < obj.y + obj.height))){
            return obj;
        }
    }

    return null;
}