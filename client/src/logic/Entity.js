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
    self.actionPoint = false;

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
        if(isAtkInitial){
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
        self.actionPoint = false;
    }

    // object can act again
    self.restoreAction = function () {
        self.actionPoint = true;
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

exports.farmingStructure = farmingStructure;