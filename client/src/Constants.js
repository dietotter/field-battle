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