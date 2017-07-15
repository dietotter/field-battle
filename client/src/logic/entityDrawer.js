var ctx = document.getElementById("ctx").getContext("2d");

var drawObject = function (obj) {

    // draw selection
    if(obj.isSelected)
        drawSelection(obj);

    // draw model
    ctx.drawImage(obj.image, obj.x, obj.y);

    // draw hp bar
    if(obj.type === 'structure' || obj.type === 'unit')
        drawHpBar(obj);
}

var drawHpBar = function(obj){
    // save current style settings
    ctx.save();

    // width of one hp cell
    var hpCellWidth = obj.width / obj.maxHp;
    // green part of hp bar
    var hpLeftWidth = hpCellWidth * obj.hp;
    // red part of hp bar
    var hpTakenWidth = obj.width - hpLeftWidth;

    // let hp bar be 1/8 of model height
    var hpBarHeight = obj.height/8;

    ctx.fillStyle = '#21ca02';
    ctx.fillRect(obj.x, obj.y, hpLeftWidth, hpBarHeight);
    ctx.fillStyle = '#e51413';
    ctx.fillRect(obj.x + hpLeftWidth, obj.y, hpTakenWidth, hpBarHeight);

    // return to saved style settings
    ctx.restore();

    //draw grid around hp bar
    for(var i = 0; i < obj.maxHp; i++){
        ctx.strokeRect(obj.x + hpCellWidth * i, obj.y, hpCellWidth, hpBarHeight);
    }
}

var drawSelection = function (obj) {
    // save current style settings
    ctx.save();

    // get object center
    var x = obj.x + obj.width/2;
    var y = obj.y + obj.height/2;

    // get player id and depending on it choose selection color
    var team = obj.playerInControl.id;

    switch(team){
        case 0:
            ctx.strokeStyle = '#21EE02';
            break;
        case 1:
            ctx.strokeStyle = '#1212FF'
            break;
        default:
            ctx.strokeStyle = '#797979';
    }

    drawEllipseByCenter(ctx, x, y, obj.width, obj.height);

    // restore saved style settings
    ctx.restore();
}

exports.drawObject = drawObject;

function drawEllipseByCenter(ctx, cx, cy, w, h) {
    drawEllipse(ctx, cx - w/2.0, cy - h/2.0, w, h);
}

function drawEllipse(ctx, x, y, w, h) {
    var kappa = .5522848,
        ox = (w / 2) * kappa, // control point offset horizontal
        oy = (h / 2) * kappa, // control point offset vertical
        xe = x + w,           // x-end
        ye = y + h,           // y-end
        xm = x + w / 2,       // x-middle
        ym = y + h / 2;       // y-middle

    ctx.beginPath();
    ctx.moveTo(x, ym);
    ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
    ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
    ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
    ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
    //ctx.closePath(); // not used correctly, see comments (use to close off open path)
    ctx.stroke();
}