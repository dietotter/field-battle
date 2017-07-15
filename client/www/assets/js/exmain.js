
var ctx = document.getElementById("ctx").getContext("2d");

ctx.font = '30px Arial';

// constants
var CANVAS_WIDTH = 800;
var CANVAS_HEIGHT = 600;
var timeWhenGameStarted = Date.now(); // returns time in ms

var frameCount = 0;

var enemies = [];

var player = {
    name: 'P',
    x: 50,
    y: 40,
    dx: 10,
    dy: 5,
    hp: 10,
    width: 20,
    height: 20,
    color: 'green'
};

function getDistanceBetweenEntity(entity1, entity2){ // return distance (number)
    var vx = entity1.x - entity2.x;
    var vy = entity1.y - entity2.y;

    return Math.sqrt(vx*vx + vy*vy);
}

function testCollisionEntity(entity1, entity2){ // return if colliding (true/false)
    var rect1 = {
        x: entity1.x - entity1.width/2,
        y: entity1.y - entity1.height/2,
        width: entity1.width,
        height: entity1.height
    }

    var rect2 = {
        x: entity2.x - entity2.width/2,
        y: entity2.y - entity2.height/2,
        width: entity2.width,
        height: entity2.height
    }

    return testCollisionRectRect(rect1, rect2);
}

function testCollisionRectRect(rect1, rect2){
    return rect1.x <= rect2.x + rect2.width
        && rect2.x <= rect1.x + rect1.width
        && rect1.y <= rect2.y + rect2.height
        && rect2.y <= rect1.y + rect1.height;
}

function Enemy(name, x, y, dx, dy, width, height){
    var entity = {
        name: name,
        x: x,
        y: y,
        dx: dx,
        dy: dy,
        width: width,
        height: height,
        color: 'red'
    };

    enemies.push(entity);
}

$(document).mousemove(function (mouse) {
    var mouseX = mouse.clientX - document.getElementById("ctx").getBoundingClientRect().left;
    var mouseY = mouse.clientY - document.getElementById("ctx").getBoundingClientRect().top;

    if(mouseX < player.width/2)
        mouseX = player.width/2;
    if(mouseX > CANVAS_WIDTH - player.width/2)
        mouseX = CANVAS_WIDTH - player.width/2;
    if(mouseY < player.height/2)
        mouseY = player.height/2;
    if(mouseY > CANVAS_HEIGHT - player.height/2)
        mouseY = CANVAS_HEIGHT - player.height/2;

    player.x = mouseX;
    player.y = mouseY;
});

function updateEntity(entity){

    updateEntityPosition(entity);
    drawEntity(entity);

}

function updateEntityPosition(entity){

    if(entity.x >= CANVAS_WIDTH || entity.x <= 0){
        entity.dx *= -1;
    }
    if(entity.y >= CANVAS_HEIGHT || entity.y <= 0){
        entity.dy *= -1;
    }
    entity.x += entity.dx;
    entity.y += entity.dy;

}

function drawEntity(entity){
    ctx.save();
    ctx.fillStyle = entity.color;
    ctx.fillRect(entity.x-entity.width/2, entity.y-entity.height/2,entity.width,entity.height);
    ctx.restore();
}

function update() {
    ctx.clearRect(0,0, CANVAS_WIDTH, CANVAS_HEIGHT);

    ++frameCount;

    if(frameCount % 100 === 0) //after 4 sec,
        randomlyGenerateEnemy();

    enemies.forEach(function (enemy) {
        updateEntity(enemy);

        if(testCollisionEntity(player, enemy)){
            player.hp -= 1;
        }
    });

    if(player.hp <= 0){
        var timeSurvived = Date.now() - timeWhenGameStarted;

        console.log("You lost! You survived for " + timeSurvived + " ms");

        startNewGame();
    }

    drawEntity(player);
    ctx.fillText("Hp: " + player.hp, 5, 30);
}

startNewGame = function(){
    timeWhenGameStarted = Date.now();
    player.hp = 10;
    frameCount = 0;
    enemies = [];

    for(var i = 0; i < 3; i++){
        randomlyGenerateEnemy();
    }
}

randomlyGenerateEnemy = function(){
    var x = Math.random() * CANVAS_WIDTH;
    var y = Math.random() * CANVAS_HEIGHT;
    var height = 10 + Math.random()*30;
    var width = 10 + Math.random()*30;
    var dx = 5 * Math.random()*5;
    var dy = 5 * Math.random()*5;

    Enemy('E', x,y, dx, dy, width, height);
}

startNewGame();

setInterval(update, 40);