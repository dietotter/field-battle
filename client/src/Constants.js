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
        archery: new Image()
    }

    Img.house.src = IMAGE_DIR + 'house.png';
    Img.archery.src = IMAGE_DIR + 'archery.png';

    return Img;
}

var Img = loadImages();

exports.Img = Img;