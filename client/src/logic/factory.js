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