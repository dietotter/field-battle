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
    maxHp: 13,
    attack: 0,
    cost: 250,
    description: 'Human archery. Allows to build such units: ***.'
}

exports.HOUSE_CHAR = HOUSE_CHAR;
exports.ARCHERY_CHAR = ARCHERY_CHAR;

exports.ALL_CHARACTERISTICS = {
    house: HOUSE_CHAR,
    archery: ARCHERY_CHAR
}