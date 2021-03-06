(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var canv = document.getElementById("ctx");

exports.canvas = canv;

// constants
exports.CANVAS_WIDTH = canv.width;
exports.CANVAS_HEIGHT = canv.height;

exports.FIELD_WIDTH = canv.width;
exports.FIELD_HEIGHT = canv.height;

var IMAGE_DIR = '../www/assets/img/';

var loadImages = function(){
    var Img = {
        house: new Image(),
        archery: new Image(),
        casern: new Image(),
        militia: new Image(),
        swordsman: new Image(),
        archer: new Image(),
        royalarcher: new Image(),
        sniper: new Image()
    }

    Img.house.src = IMAGE_DIR + 'house.png';
    Img.archery.src = IMAGE_DIR + 'archery.png';
    Img.casern.src = IMAGE_DIR + 'casern.png';
    Img.militia.src = IMAGE_DIR + 'militia.png';
    Img.swordsman.src = IMAGE_DIR + 'swordsman.png';
    Img.archer.src = IMAGE_DIR + 'archer.png';
    Img.royalarcher.src = IMAGE_DIR + 'royalArcher.png';
    Img.sniper.src = IMAGE_DIR + 'sniper.png';

    return Img;
}

var Img = loadImages();

exports.Img = Img;
},{}],2:[function(require,module,exports){
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
},{"./Constants":1}],3:[function(require,module,exports){

var Player = require('./logic/Player');
var factory = require('./logic/factory');
var Constants = require('./Constants');
var drawer = require('./drawer');

var ui = require('./ui/battleUI');

var players = {};
var playersCount = 0;

var playerInTurn;

// TODO should take players as parameters (OR add method 'addPlayerToBattlefield' or smth, where players count will also be increased)
exports.initializeGame = function(){

    players.player1 = Player(0, 'Nick', 'human', '#12AA12');
    players.player2 = Player(1, 'Kek', 'human', '#12C');
    playersCount++;
    playersCount++;

    for(var pl in players){
        players[pl].initialize(playersCount);
    }

    // FOR DEBUGGING
    players.player1.gameObjects[0].hp = 17;

    drawer.initialize(players);
    ui.initialize();

    changePlayerInTurn(players.player1);
    console.log(players);
}

exports.players = players;

$('#ctx').click(function (e) {
    var mousePos = getMousePos(e);
    console.log(mousePos.x, mousePos.y);

    var selectedObj = getObjectByCoordinates(mousePos.x, mousePos.y);

    playerInTurn.clickHandle(mousePos.x, mousePos.y, selectedObj);
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
        // deselects selected object, makes 'hasTurn' false and cleans the UI
        playerInTurn.endTurn();
    }

    // makes 'hasTurn' true, restores all player's objects action points, adds money from farming structures
    player.startTurn();
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

getPlayersCount = function () {
    return playersCount;
}

exports.getPlayerInTurn = getPlayerInTurn;
exports.changeTurn = changeTurn;
exports.getPlayersCount = getPlayersCount;
},{"./Constants":1,"./drawer":2,"./logic/Player":8,"./logic/factory":10,"./ui/battleUI":12}],4:[function(require,module,exports){
/**
 * Created by Nikolay on 7/19/2017.
 */
function Point(x, y) {
    this.x = x;
    this.y = y;
}

module.exports = Point;
},{}],5:[function(require,module,exports){
/**
 * Created by Nikolay on 7/19/2017.
 */
var Point = require('./Point');

function Rectangle(x, y, width, height) {
    this.a = new Point(x, y);
    this.b = new Point(x + width, y);
    this.c = new Point(x + width, y + height);
    this.d = new Point(x, y + height);
    this.width = width;
    this.height = height;
    this.inBounds = function (w, h) {
        if((w > this.a.x) && (w < this.b.x) && (h > this.a.y) && (h < this.d.y))
            return true;

        return false;
    }
}

module.exports = Rectangle;
},{"./Point":4}],6:[function(require,module,exports){
var factory = require('./factory');
var entityDrawer = require('./entityDrawer');
var ui = require('../ui/battleUI');
var Constants = require('../Constants');

// entity abstract constructor
var Entity = function(id, name, image, x, y, width, height){
    var self = {
        id: id,
        name: name,
        image: image,
        type: 'entity',
        x: x,
        y: y,
        width: width,
        height: height
    }

    self.draw = function () {
        entityDrawer.drawObject(self);
    }

    return self;
}

// game object abstract constructor extends entity
var GameObject = function(id, name, image, x, y, width, height, player, maxHp, attack, cost, actions, conditions, passiveAbilities){
    var self = Entity(id, name, image, x, y, width, height);

    self.isSelected = false;
    self.maxHp = maxHp;
    self.hp = self.maxHp;
    self.attack = attack;
    self.cost = cost;
    self.type = 'gameObject';
    self.playerInControl = player;
    self.actions = actions;
    self.conditions = conditions;
    self.passiveAbilities = passiveAbilities;
    self.actionPoint = 0;

    // take damage from an attacker
    self.takeDamage = function(attacker, isAtkInitial){
        self.hp -= attacker.attack;

        // if this object was killed
        if(self.hp <= 0){
            // give attacker gold equal to half of self cost
            attacker.playerInControl.gold += self.cost/2;
            // destroy this object
            self.destroySelf();
            return;
        }
        if(isAtkInitial && self.canAttack()){
            attacker.takeDamage(self, false);
        }
    };

    // remove self from player's object list and make self equal null
    self.destroySelf = function () {
        if(self.playerInControl){
            var playerObjects = self.playerInControl.gameObjects;
            var index = playerObjects.indexOf(self);

            if(index > -1){
                playerObjects.splice(index, 1);
            }
        }

        self = null;
    };

    // returns true if all game object's conditions return true
    self.checkConditions = function () {

        for(var condition in this.conditions){
            if(!this.conditions[condition](self)){
                return false;
            }
        }

        return true;
    }

    // checks the conditions whether this game object can attack. Returns boolean
    self.canAttack = function () {
        if(attack > 0 && this.checkConditions()){

            return true;
        }

        return false;
    };

    // drop object's action points
    self.dropAction = function(){
        // if self was not destroyed, drop its action points
        if(self){
            self.actionPoint--;
        }
    }

    // object can act again
    self.restoreAction = function () {
        self.actionPoint = 1;
    }

    // check if object can act
    self.hasAction = function () {
        return self.actionPoint;
    }

    return self;
}

// structure abstract constructor extends game object
exports.Structure = function(objData){
    var self = GameObject(objData.id, objData.name, objData.image, objData.x, objData.y, objData.width, objData.height, objData.player, objData.maxHp, objData.attack, objData.cost, objData.actions, objData.conditions, objData.passiveAbilities);

    self.type = 'structure';

    // list of units and structures that this house can create
    self.objectList = objData.objectList;
    // create a unit or structure. data contains id, x, y of object being created
    self.actions.build = build;

    return self;
}

// unit abstract constructor extends game object
exports.Unit = function(objData){
    var self = GameObject(objData.id, objData.name, objData.image, objData.x, objData.y, objData.width, objData.height, objData.player, objData.maxHp, objData.attack, objData.cost, objData.actions, objData.conditions, objData.passiveAbilities);

    self.type = 'unit';
    self.actions.attack = attack;

    return self;
}

// =================== POSSIBLE ACTIONS ======================

// create a unit or structure. data contains id, x, y of object being created
// TODO CURRENTLY NOT WORKING AND NOT USABLE
var createObject = function(unitName, data){
    return factory(unitName, data);
}

// show all createObject options on UI (+ 'cancel' button)
var build = function (self) {
    // retrieve object data (name, portrait, stats should be added)
    var objData = {
        buttonDataList: []
    };

    var objList = self.objectList;

    // add button data for all objects, existing in object list
    for(var obj in objList){
        objData.buttonDataList.push({
            panel: 'bottom',
            name: objList[obj]
        });
    }

    // add 'cancel' button
    objData.buttonDataList.push({
        panel: 'bottom',
        name: 'cancel'
    });

    ui.updateBottomPanel(objData);
}

// attack an enemy unit and get attack v otvet, if enemy was not killed
var attack = function(self, enemy) {
    if(self.hasAction()){
        enemy.takeDamage(self, true); // where 1st parameter is the object, who is attacking,
        // and 2nd parameter is boolean, which indicates if it was an initial attack (if false,
        // then it means the attack was v otvet, and no more attacks v otvet should be dealt)

        // drop self action points
        self.dropAction();
    }
    else{
        // TODO to UI log instead
        console.log('Unit has already acted this turn')
    }
}

exports.build = build;
exports.createObject = createObject;
exports.attack = attack;

// ===================== POSSIBLE CONDITIONS =====================

// ??? REDO conditions (I think when objects will have update() functions, this will change or simply won't be needed
// ?? all conditions should take self as a parameter

// returns true if not full health
var isNotFullHealth = function (self) {
    if(self.hp < self.maxHp)
        return true;

    return false;
}

exports.isNotFullHealth = isNotFullHealth;

// ===================== POSSIBLE PASSIVE ABILITIES =====================

farmingStructure = function (self) {
    self.playerInControl.gold += 50;
}

actThreeTimes = function (self) {
    self.actionPoint = 3;
}

exports.farmingStructure = farmingStructure;
exports.actThreeTimes = actThreeTimes;
},{"../Constants":1,"../ui/battleUI":12,"./entityDrawer":9,"./factory":10}],7:[function(require,module,exports){
/**
 * Created by Nikolay on 7/22/2017.
 */
var Constants = require('../Constants');
var Img = Constants.Img;

HOUSE_CHAR = {
    name: 'house',
    image: Img.house,
    maxHp: 18,
    attack: 3,
    cost: 1000,
    description: 'Main building of a player. Allows to build structures of your race. Gives +50 gold to player each turn. Can attack only when not at full health.'
}

ARCHERY_CHAR = {
    name: 'archery',
    image: Img.archery,
    maxHp: 12,
    attack: 0,
    cost: 250,
    description: 'Human archery. Allows to build such units: ***.'
}

CASERN_CHAR = {
    name: 'casern',
    image: Img.casern,
    maxHp: 11,
    attack: 0,
    cost: 250,
    description: 'Human casern. Allows to build such units: ***.'
}

MILITIA_CHAR = {
    name: 'militia',
    image: Img.militia,
    maxHp: 2,
    attack: 1,
    cost: 75,
    description: 'Human militia man. Attacks with a pitchfork'
}

SWORDSMAN_CHAR = {
    name: 'swordsman',
    image: Img.swordsman,
    maxHp: 3,
    attack: 2,
    cost: 125,
    description: 'Human swordsman. Soldier with ordinary attack and hp'
}

ARCHER_CHAR = {
    name: 'archer',
    image: Img.archer,
    maxHp: 2,
    attack: 2,
    cost: 100,
    description: 'Human archer. Weak hp and attack'
}

ROYALARCHER_CHAR = {
    name: 'royalarcher',
    image: Img.royalarcher,
    maxHp: 3,
    attack: 1,
    cost: 150,
    description: 'Royal archer. Can attack 3 times in one turn'
}

SNIPER_CHAR = {
    name: 'sniper',
    image: Img.sniper,
    maxHp: 4,
    attack: 6,
    cost: 225,
    description: 'Sniper with weak hp and strong attack'
}

exports.HOUSE_CHAR = HOUSE_CHAR;
exports.ARCHERY_CHAR = ARCHERY_CHAR;
exports.CASERN_CHAR = CASERN_CHAR;
exports.MILITIA_CHAR = MILITIA_CHAR;
exports.SWORDSMAN_CHAR = SWORDSMAN_CHAR;
exports.ARCHER_CHAR = ARCHER_CHAR;
exports.ROYALARCHER_CHAR = ROYALARCHER_CHAR;
exports.SNIPER_CHAR = SNIPER_CHAR;

exports.ALL_CHARACTERISTICS = {
    house: HOUSE_CHAR,
    archery: ARCHERY_CHAR,
    casern: CASERN_CHAR,
    militia: MILITIA_CHAR,
    swordsman: SWORDSMAN_CHAR,
    archer: ARCHER_CHAR,
    royalarcher: ROYALARCHER_CHAR,
    sniper: SNIPER_CHAR
}
},{"../Constants":1}],8:[function(require,module,exports){
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
        // make all player's units/structures be able to act and add money from farming structures (also activate other passive abilities)
        for(var o in gObjs){
            var obj = gObjs[o];
            obj.restoreAction();

            for(var abil in obj.passiveAbilities){
                obj.passiveAbilities[abil](obj);
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
},{"../Constants":1,"../geometry/Point":4,"../geometry/Rectangle":5,"../ui/battleUI":12,"./ObjectConstants":7,"./factory":10}],9:[function(require,module,exports){
var ctx = document.getElementById("ctx").getContext("2d");

var drawObject = function (obj) {

    // draw selection
    if(obj.isSelected)
        drawSelection(obj);

    // draw model
    ctx.drawImage(obj.image, obj.x, obj.y);

    // draw hp bar
    if(obj.type === 'structure' || obj.type === 'unit')
        drawHpBar(obj);
}

var drawHpBar = function(obj){
    // save current style settings
    ctx.save();

    // width of one hp cell
    var hpCellWidth = obj.width / obj.maxHp;
    // green part of hp bar
    var hpLeftWidth = hpCellWidth * obj.hp;
    // red part of hp bar
    var hpTakenWidth = obj.width - hpLeftWidth;

    // let hp bar be 1/8 of model height
    var hpBarHeight = obj.height/8;

    ctx.fillStyle = '#21ca02';
    ctx.fillRect(obj.x, obj.y, hpLeftWidth, hpBarHeight);
    ctx.fillStyle = '#e51413';
    ctx.fillRect(obj.x + hpLeftWidth, obj.y, hpTakenWidth, hpBarHeight);

    // return to saved style settings
    ctx.restore();

    //draw grid around hp bar
    for(var i = 0; i < obj.maxHp; i++){
        ctx.strokeRect(obj.x + hpCellWidth * i, obj.y, hpCellWidth, hpBarHeight);
    }
}

var drawSelection = function (obj) {
    // save current style settings
    ctx.save();

    // get object center
    var x = obj.x + obj.width/2;
    var y = obj.y + obj.height/2;

    // get player id and depending on it choose selection color
    var team = obj.playerInControl.id;

    switch(team){
        case 0:
            ctx.strokeStyle = '#21EE02';
            break;
        case 1:
            ctx.strokeStyle = '#1212FF'
            break;
        default:
            ctx.strokeStyle = '#797979';
    }

    drawEllipseByCenter(ctx, x, y, obj.width, obj.height);

    // restore saved style settings
    ctx.restore();
}

exports.drawObject = drawObject;

function drawEllipseByCenter(ctx, cx, cy, w, h) {
    drawEllipse(ctx, cx - w/2.0, cy - h/2.0, w, h);
}

function drawEllipse(ctx, x, y, w, h) {
    var kappa = .5522848,
        ox = (w / 2) * kappa, // control point offset horizontal
        oy = (h / 2) * kappa, // control point offset vertical
        xe = x + w,           // x-end
        ye = y + h,           // y-end
        xm = x + w / 2,       // x-middle
        ym = y + h / 2;       // y-middle

    ctx.beginPath();
    ctx.moveTo(x, ym);
    ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
    ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
    ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
    ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
    //ctx.closePath(); // not used correctly, see comments (use to close off open path)
    ctx.stroke();
}
},{}],10:[function(require,module,exports){
var Entity = require('./Entity');
var ObjectConstants = require('./ObjectConstants');

module.exports = function (name, data) {

    var objData = {
        id: data.id,
        x: data.x,
        y: data.y,
        player: data.player,
        actions: {},
        conditions: {},
        passiveAbilities: {},

        // We must call this function for the object to work properly
        characteristics: function (data) {
            this.name = data.name;
            this.image = data.image;
            this.width = this.image.width;
            this.height = this.image.height;
            this.maxHp = data.maxHp;
            this.attack = data.attack;
            this.cost = data.cost;
        }
    }

    switch(name){
        // common
        case 'househuman':
            objData.characteristics(ObjectConstants.HOUSE_CHAR);

            objData.actions['attack'] = Entity.attack;
            objData.conditions['isNotFullHealth'] = Entity.isNotFullHealth;
            objData.passiveAbilities['farmingStructure'] = Entity.farmingStructure;

            objData.objectList = {casern: 'casern', archery: 'archery'};

            return Entity.Structure(objData);

        case 'houseorc':
            objData.characteristics(ObjectConstants.HOUSE_CHAR);

            objData.actions['attack'] = Entity.attack;
            objData.conditions['isNotFullHealth'] = Entity.isNotFullHealth;

            objData.objectList = {};

            return Entity.Structure(objData);

        // human
        case 'archery':
            objData.characteristics(ObjectConstants.ARCHERY_CHAR);

            objData.objectList = {archer: 'archer', royalArcher: 'royalArcher', sniper: 'sniper'};

            return Entity.Structure(objData);

        case 'casern':
            objData.characteristics(ObjectConstants.CASERN_CHAR);

            objData.objectList = {militia: 'militia', swordsman: 'swordsman'};

            return Entity.Structure(objData);

        case 'militia':
            objData.characteristics(ObjectConstants.MILITIA_CHAR);

            objData.actions['attack'] = Entity.attack;

            return Entity.Unit(objData);

        case 'swordsman':
            objData.characteristics(ObjectConstants.SWORDSMAN_CHAR);

            objData.actions['attack'] = Entity.attack;

            return Entity.Unit(objData);

        case 'archer':
            objData.characteristics(ObjectConstants.ARCHER_CHAR);

            objData.actions['attack'] = Entity.attack;

            return Entity.Unit(objData);

        case 'royalarcher':
            objData.characteristics(ObjectConstants.ROYALARCHER_CHAR);

            objData.actions['attack'] = Entity.attack;
            objData.passiveAbilities['actThreeTimes'] = Entity.actThreeTimes;

            return Entity.Unit(objData);

        case 'sniper':
            objData.characteristics(ObjectConstants.SNIPER_CHAR);

            objData.actions['attack'] = Entity.attack;

            return Entity.Unit(objData);
    }
};
},{"./Entity":6,"./ObjectConstants":7}],11:[function(require,module,exports){

var drawer = require('./drawer');
var game = require('./game');

// $(document).ready()
$(function () {
    game.initializeGame();
    setInterval(update, 1000/25); // 25 frames per second => update every 40 ms
})

update = function(){

    drawer.drawGame();
}


/* TODO Goals
* DONE (9.7.2017) 1. Mouse interaction (player can select own units and structures)
* DONE (9.7.2017) 2. If player selects own unit, that can attack, and then clicks enemy unit, attack action is triggered
* DONE (10.7.2017) 3. When object's hp becomes <= 0, remove it from battlefield and from unit list
* KINDA DONE (needs the design + change some functions when object creation is implemented) (11.7.2017) 4. Simple user interface (Buttons on active panel change depending on player mode and selected object)
* DONE (13.7.2017) 4.5. Add tooltips to buttons if hovered (at least button name should be displayed, as buttons will most likely have icons instead of actual text)
* DONE (15.7.2017) 4.7. When selecting ally (not own) unit/structure, don't show action buttons, but just unit's portrait and stats.
*   This also applies to selecting enemy units/structures during Default player mode (when nothing own is selected).
*   Also this should apply to all units/structures when its not Player's turn.
* DONE (16.7.2017) 5. Implement turns (+ add 'change turn' button to top panel)
* DONE (21.7.2017) 6. Implement object creation (without using the grid, player can create object wherever he wants on his side of the battlefield)
* DONE (21.7.2017) 6.1. Instead of grid, draw players' parts of the battlefield in different colours (better just stroke, but can also fill)
* DONE (21.7.2017) 7. Add game object property 'hasAction', which indicates whether or not object can act this turn (all of player's objects need
*   to have this property reset to true at the start of the turn). Somewhat of hasAction indicator also needs to be added to UI.
* POSTPONED (21.7.2017) 8. Implement scrolling the battlefield (player can press mouse/touch the screen and drag the camera) (HOW TO e.g. we can track
*   the mouse movement and
* DONE (22.7.2017) 9. Implement player's money system (constructing buildings and units using money, adding money every turn depending on the number of farms etc).
*   Show current amount of each player's money on the top of the canvas.
* DONE (22.7.2017) 10. Add some game content (units, buildings, another race)
* 11. Add UI log on the bottom panel
* 12. Add portrait and stats to unit selection
* 13. Consider adding update method (read below)
* 14. Add victory conditions
*
* TODO Not order-specifield goals:
* DONE (15.7.2017) ???. Create github repo
* ???. Add an update method to entities and call it every frame --- This actually needs to be done soon (when the first necessity occurs)
*   Also add 'update' to Player and call updateUI() in it (so that we don't need to call it every time we change smth. Also, we will need to keep the track
*   of selected buttons, as sometimes UI is changed outside of Player class (e.g. from Entity.js))
* ???. Finish player mode processing
* ???. Show selected object's portrait and hp in bottom UI panel
* ???. Change Player.js exports (module.exports = Player ===> exports.Player = Player; exports.ModeEnum = ModeEnum)
* ???. Rework object selection and object selection drawing, as there may be multiple players, who will select the same object. (? this is for multiplayer)
* ???. In buttonFunctions.js, make loadButtons function load buttons depending on players' races (e.g. if there is only human and orc players in the game, don't load other races' buttons)
*   Also, in multiplayer may just load your race functions on client.
* ???. Add animations
* IN PROGRESS (21.7.2017) ???. Draw and implement button icons
* ???. Add positive and harmful effects property(ies) to GameObject. They also should be able to have cooldowns
*   Also maybe add properties 'bonusHP' or 'bonusAtk' and add their calculations to attack function or elsewhere
*
* TODO Long-term goals
* ???. Make game multiplayer (add back-end). Use socket.io
* ???. Continue adding more game content
* ???. Add simple AI
* ???. Make monte-carlo simulation (this will help to balance the game) (can be done as soon as simple AI is added)
*
* TODO Problems
* SOLVED (15.7.2017) 1. If enemy unit is selected, it can attack itself
* SOLVED (16.7.2017) 2. 'onclick' of UI buttons loads slowly (maybe should handle it in another way, not adding onclick every time we select an object.
*   E.g. We could append all onclicks when the page loads and never append it on selecting object (https://stackoverflow.com/questions/17664154/jquery-directly-at-onclick-and-effect-ui-slow))
* SOLVED (21.7.2017) 3. During object creation, check for objects around is not working correctly (still creates object on another object (/screenshots/problem0.png))
*
* */
},{"./drawer":2,"./game":3}],12:[function(require,module,exports){
/**
 * Created by Nikolay on 7/11/2017.
 */
var BUTTON_BLOCK_TEMPLATE = '<div class="button-block"></div>';
var BUTTON_TEMPLATE = '<button class="single-button" id="uselessBtn">Btn</button>';
var BUTTON_BOTTOM_TEXT_TEMPLATE = '<p class="button-bottom-text">Useless button name</p>';

var BOTTOM_BUTTON_PANEL = $('.bottom-button-panel');
var TOP_BUTTON_PANEL = $('.top-button-panel');

var buttonFunctions = require('./buttonFunctions');
// add button to panel according to buttonData
/*
* buttonData is an object, containing such fields:
* @ panel - what panel the button should be assigned to. Can take values 'top' or 'bottom';
* @ name - button name. Will be displayed in the tooltip (?).
*   Also, its lowercase variant will be in HTML id (e.g. name is 'Attack' => id is 'attackBtn') (?);
* @ icon - image, which will be shown on button; NOT IMPLEMENTED YET
*
* Optional fields:
* @ bottomText - String, containing text which will be displayed below the button.
*   If there is none, no text will be displayed below.
* @ tooltipText - String, which will be added to tooltip below button name.
*   E.g., it can be the description of an ability.
*
 */
addButton = function(buttonData){
    // change button id, add text to tooltip,
    var button = $(BUTTON_TEMPLATE);
    button.prop('id', buttonData.name.toLowerCase() + 'Btn');
    button.text(buttonData.name); // this will be added to the tooltip instead
    button.attr('data-tooltip', buttonData.name);

    var node = $(BUTTON_BLOCK_TEMPLATE).append(button);

    // if bottom text exists, append it
    if(buttonData.bottomText){
        var bText = $(BUTTON_BOTTOM_TEXT_TEMPLATE);
        bText.text(buttonData.bottomText);

        node.append(bText);
    }

    if(buttonData.panel === 'top'){
        TOP_BUTTON_PANEL.append(node);
    }
    else if(buttonData.panel === 'bottom'){
        BOTTOM_BUTTON_PANEL.append(node);
    }
}

// deletes current bottom everything
flushBottomPanel = function () {
    $(BOTTOM_BUTTON_PANEL.children()).remove();
};

// deletes current top everything
flushTopPanel = function () {
    $(TOP_BUTTON_PANEL.children()).remove();
};

// updates bottom panel according to incoming data
/*
* objData is an object, containing such fields:
* @ name - String, containing gameObject name; NOT IMPLEMENTED YET
* @ portrait - gameObject's portrait to display; NOT IMPLEMENTED YET
* @ stats - Object, containing hp, maxHp, atk, cost of gameObject; NOT IMPLEMENTED YET
* @ buttonDataList - array, containing buttonDatas
*
 */
updateBottomPanel = function (objData) {
    flushBottomPanel();
    if(objData){
        objData.buttonDataList.forEach((buttonData) => {
            addButton(buttonData);
        });
    }
}

updateTopPanel = function(){
    flushTopPanel();
    addButton({
        panel: 'top',
        name: 'Turn'
    })
}

initialize = function () {
    buttonFunctions.loadButtons();
    updateTopPanel();
}

exports.flushBottomPanel = flushBottomPanel;
exports.addButton = addButton;
exports.updateBottomPanel = updateBottomPanel;
exports.initialize = initialize;
},{"./buttonFunctions":13}],13:[function(require,module,exports){
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

loadHuman = function () {

    $(document).on("click", "#casernBtn", function (){
        goToBuildingPhase('casern');
    })

    $(document).on("click", "#militiaBtn", function (){
        goToBuildingPhase('militia');
    })

    $(document).on("click", "#swordsmanBtn", function (){
        goToBuildingPhase('swordsman');
    })

    $(document).on("click", "#archeryBtn", function (){
        goToBuildingPhase('archery');
    })

    $(document).on("click", "#archerBtn", function (){
        goToBuildingPhase('archer');
    })

    $(document).on("click", "#royalarcherBtn", function (){
        goToBuildingPhase('royalarcher');
    })

    $(document).on("click", "#sniperBtn", function (){
        goToBuildingPhase('sniper');
    })
}

loadButtons = function () {

    $(document).on("click", "#cancelBtn", function () {
        getPlayer().changeMode(1);
    })

    $(document).on("click", "#buildBtn", function () {
        var obj = getSelectedObject();

        obj.actions.build(obj);
    })

    $(document).on("click", "#turnBtn", function () {
        game.changeTurn();
    })

    loadHuman();

    console.log("Button functions loaded");
}

exports.loadButtons = loadButtons;
},{"../Constants":1,"../game":3}]},{},[11]);
