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