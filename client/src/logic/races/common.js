var Entity = require('../Entity');

var IMAGE_DIR = '../www/assets/img/';

// main house constructor
exports.House = function (id, x, y, player) {
    var self = Entity.Structure(id, x, y, player);

    //self.objectList.farm = 'farm';
    //self.objectList.greaterFarm = 'greaterFarm';

    self.name = 'house';
    self.image.src = IMAGE_DIR + 'house.png';
    self.width = 80;
    self.height = 60;
    self.maxHp = 18;
    self.hp = self.maxHp;
    self.attack = 3;
    self.cost = 1000;

    if(self.playerInControl.race === 'human'){
        self.objectList.archery = 'archery';
    }
    else if(self.playerInControl.race === 'orc'){
        self.objectList.barracks = 'barracks';
    }

    return self;

    // TODO smhow implement House to be able to attack when not full hp (add 'attack' to actions list when hp < max hp and remove 'attack' from the list when hp = max hp)
}