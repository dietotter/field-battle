var Entity = require('../Entity');
var Structure = Entity.Structure;
var Unit = Entity.Unit;



exports.Archery = function (id, x, y, player) {
    var self = Entity.Structure(id, x, y, player);

    self.name = 'archery';
    self.image.src = IMAGE_DIR + 'archery.png';
    self.width = 80;
    self.height = 60;
    self.maxHp = 12;
    self.hp = self.maxHp;
    self.cost = 250;

    self.objectList.archer = 'archer';
    return self;
}