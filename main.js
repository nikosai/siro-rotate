var Bullet = /** @class */ (function () {
    function Bullet(image, x, y, speed, theta) {
        this.image = image;
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.theta = theta;
    }
    Bullet.prototype.draw = function () {
        context.save();
        context.translate(this.x, this.y);
        context.rotate(this.theta);
        context.drawImage(this.image, -this.image.width / 2, -this.image.height / 2, this.image.width, this.image.height);
        context.restore();
    };
    Bullet.prototype.update = function () {
        this.x += this.speed * Math.sin(this.theta);
        this.y += -this.speed * Math.cos(this.theta);
        this.draw();
    };
    Bullet.prototype.isOut = function () {
        var margin = 10;
        return !(this.x > -margin && this.x < canvas.width + margin
            && this.y > -margin && this.y < canvas.height + margin);
    };
    return Bullet;
}());
var Player = /** @class */ (function () {
    function Player(image) {
        this.image = image;
        this.theta = 0;
        this.speed = 0;
        this.draw();
    }
    Player.prototype.draw = function () {
        context.save();
        context.translate(mouseX, mouseY);
        context.rotate(this.theta);
        context.drawImage(this.image, -this.image.width / 2, -this.image.height / 2, this.image.width, this.image.height);
        context.restore();
    };
    Player.prototype.update = function () {
        if (inputKeyBuffer[16]) {
            this.speed += 0.01;
            if (this.speed > 1)
                this.speed = 1;
        }
        else {
            this.speed -= 0.015;
            if (this.speed < 0)
                this.speed = 0;
        }
        this.theta += Player.easing(this.speed);
        this.draw();
    };
    // linear
    Player.easing = function (t) {
        var max = -0.1;
        var min = 0;
        var d = max - min;
        return d * t + min;
    };
    return Player;
}());
var canvas = document.getElementById("canvas");
var wrapper = document.getElementById("wrapper");
var context = canvas.getContext("2d");
canvas.width = wrapper.offsetWidth;
canvas.height = wrapper.offsetHeight;
var player;
var image = new Image();
image.src = "siro.png";
image.onload = function () {
    var imgHeight = Math.min(canvas.height, canvas.width) * 0.5;
    var ratio = imgHeight / image.naturalHeight;
    image.height = ratio * image.naturalHeight;
    image.width = ratio * image.naturalWidth;
    player = new Player(image);
};
var mouseX = canvas.width / 2;
var mouseY = canvas.height / 2;
var inputKeyBuffer = [];
var coolDown = 5;
var coolDownCount = 0;
var coolDownB = 20;
var coolDownBCount = 0;
var bombNum = 10;
var maxBulletNum = 50;
var bullets = [];
window.onresize = function () {
    canvas.width = wrapper.offsetWidth;
    canvas.height = wrapper.offsetHeight;
    var imgHeight = Math.min(canvas.height, canvas.width) * 0.5;
    var ratio = imgHeight / player.image.naturalHeight;
    player.image.height = ratio * player.image.naturalHeight;
    player.image.width = ratio * player.image.naturalWidth;
};
canvas.addEventListener('click', function (e) {
    var x = e.clientX - canvas.offsetLeft;
    var y = e.clientY - canvas.offsetTop;
    launch();
}, false);
canvas.addEventListener("mousemove", function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
}, false);
// 10ms(100fps) timer
setInterval(function () {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.font = "20px mgenplus-p-w";
    context.fillStyle = "rgb(36, 36, 36)";
    context.fillText("マウスカーソルについていきます", 20, 30);
    context.fillText("Shiftでまわる〜♪", 20, 55);
    context.fillText("Zかクリックで砲弾発射！", 20, 80);
    context.fillText("Xでおほー！", 20, 105);
    context.fillText("この“何か”は、電脳少女シロさんの三次創作です。", 20, canvas.height - 20);
    console.log(bullets.length);
    while (bullets.length > maxBulletNum) {
        bullets.shift();
    }
    for (var i = 0; i < bullets.length; i++) {
        if (bullets[i].isOut()) {
            bullets.splice(i--, 1);
        }
        else {
            bullets[i].update();
        }
    }
    player.update();
    if (inputKeyBuffer[90] && coolDownCount > coolDown) {
        launch();
        coolDownCount = 0;
    }
    else {
        coolDownCount++;
    }
    if (inputKeyBuffer[88] && coolDownBCount > coolDownB) {
        bomb();
        coolDownBCount = 0;
    }
    else {
        coolDownBCount++;
    }
}, 10);
function launch() {
    var image = new Image();
    image.src = "siro.png";
    image.onload = function () {
        var imgHeight = Math.min(canvas.height, canvas.width) * 0.2;
        var ratio = imgHeight / image.naturalHeight;
        image.height = ratio * image.naturalHeight;
        image.width = ratio * image.naturalWidth;
        var t = new Bullet(image, mouseX + imgHeight * Math.sin(player.theta), mouseY - imgHeight * Math.cos(player.theta), 10, player.theta);
        bullets.push(t);
    };
}
function bomb() {
    for (var i = 0; i < bombNum; i++) {
        (function () {
            var j = i;
            var image = new Image();
            image.src = "siro.png";
            image.onload = function () {
                var imgHeight = Math.min(canvas.height, canvas.width) * 0.2;
                var ratio = imgHeight / image.naturalHeight;
                image.height = ratio * image.naturalHeight;
                image.width = ratio * image.naturalWidth;
                var theta = player.theta + (6.283 * j) / bombNum;
                var t = new Bullet(image, mouseX + imgHeight * Math.sin(theta), mouseY - imgHeight * Math.cos(theta), 16, theta);
                bullets.push(t);
            };
        })();
    }
}
document.onkeydown = function (e) {
    inputKeyBuffer[e.keyCode] = true;
};
document.onkeyup = function (e) {
    inputKeyBuffer[e.keyCode] = false;
};
