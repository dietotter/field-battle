var Entity = require('./Entity');
var Constants = require('../Constants');
var Img = Constants.Img;

module.exports = function (name, data) {

    var objData = {
        id: data.id,
        x: data.x,
        y: data.y,
        player: data.player,
        actions: {},
        conditions: {},

        // We must call this function for the object to work properly
        characteristics: function (name, image, maxHp, attack, cost) {
            this.name = name;
            this.image = image;
            this.width = this.image.width;
            this.height = this.image.height;
            this.maxHp = maxHp;
            this.attack = attack;
            this.cost = cost;
        }
    }

    switch(name){
        // common
        case 'househuman':
            objData.characteristics('house', Img.house, 18, 3, 1000);

            objData.actions['attack'] = Entity.attack;
            objData.conditions['isNotFullHealth'] = Entity.isNotFullHealth;

            objData.objectList = {archery: 'archery'};

            return Entity.Structure(objData);

        case 'houseorc':
            objData.characteristics('house', Img.house, 18, 3, 1000);

            objData.actions['attack'] = Entity.attack;
            objData.conditions['isNotFullHealth'] = Entity.isNotFullHealth;

            objData.objectList = {};

            return Entity.Structure(objData);

        // human
        case 'archery':
            objData.characteristics('archery', Img.archery, 18, 0, 1000);

            objData.objectList = {};

            return Entity.Structure(objData);
    }
};