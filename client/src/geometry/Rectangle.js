/**
 * Created by Nikolay on 7/19/2017.
 */
var Point = require('./Point');

function Rectangle(x, y, width, height) {
    this.a = new Point(x, y);
    this.b = new Point(x + width, y);
    this.c = new Point(x + width, y + height);
    this.d = new Point(x, y + height);
    this.width = width;
    this.height = height;
    this.inBounds = function (w, h) {
        if((w > this.a.x) && (w < this.b.x) && (h > this.a.y) && (h < this.d.y))
            return true;

        return false;
    }
}

module.exports = Rectangle;