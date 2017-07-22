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

            objData.objectList = {archery: 'archery'};

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

            objData.objectList = {};

            return Entity.Structure(objData);
    }
};