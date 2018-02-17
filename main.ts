class Bullet {
  constructor(public image:HTMLImageElement,public x:number,public y:number,public speed:number,public theta:number){
  }
  draw() {
	  context.save();
    context.translate(this.x,this.y);
	  context.rotate(this.theta);
	  context.drawImage(this.image, -this.image.width/2, -this.image.height/2,this.image.width,this.image.height);
	  context.restore();
  }
  update() {
    this.x += this.speed*Math.sin(this.theta);
    this.y += -this.speed*Math.cos(this.theta);
    this.draw();
  }
  isOut(){
    const margin = 10;
    return !(this.x>-margin && this.x<canvas.width+margin
      && this.y>-margin && this.y<canvas.height+margin);
  }
}

class Player {
  image:HTMLImageElement;
  theta:number; // radian
  speed:number;
  constructor(image:HTMLImageElement){
    this.image = image;
    this.theta = 0;
    this.speed = 0;
    this.draw();
  }
  draw(){
	  context.save();
    context.translate(mouseX,mouseY);
	  context.rotate(this.theta);
	  context.drawImage(this.image, -this.image.width/2, -this.image.height/2,this.image.width,this.image.height);
	  context.restore();
  }
  update(){
    if (inputKeyBuffer[16]){
      this.speed+=0.01;
      if (this.speed>1) this.speed = 1;
    } else {
      this.speed-=0.015;
      if (this.speed<0) this.speed = 0;
    }
    this.theta += Player.easing(this.speed);
    this.draw();
  }
  // linear
  static easing(t:number){
    const max = -0.1;
    const min = 0;
    var d = max - min;
    return d*t+min;
  }
}

var canvas = <HTMLCanvasElement>document.getElementById("canvas");
var wrapper = document.getElementById("wrapper");
var context = canvas.getContext("2d");

canvas.width = wrapper.offsetWidth;
canvas.height = wrapper.offsetHeight;

var player:Player;
var image = new Image();
image.src = "siro.png";
image.onload = function(){
  var imgHeight = Math.min(canvas.height,canvas.width)*0.5;
  var ratio = imgHeight/image.naturalHeight;
  image.height = ratio * image.naturalHeight;
  image.width = ratio * image.naturalWidth;
  player = new Player(image);
}

var mouseX = canvas.width/2;
var mouseY = canvas.height/2;
var inputKeyBuffer:boolean[] = [];
const coolDown = 5;
var coolDownCount = 0;
const coolDownB = 20;
var coolDownBCount = 0;
const bombNum = 10;
const maxBulletNum = 50;

var bullets:Bullet[] = [];

window.onresize = function() {
  canvas.width = wrapper.offsetWidth;
  canvas.height = wrapper.offsetHeight;
  var imgHeight = Math.min(canvas.height,canvas.width)*0.5;
  var ratio = imgHeight/player.image.naturalHeight;
  player.image.height = ratio * player.image.naturalHeight;
  player.image.width = ratio * player.image.naturalWidth;
}

canvas.addEventListener('click', function(e){
  var x = e.clientX - canvas.offsetLeft;
  var y = e.clientY - canvas.offsetTop;
  launch();
}, false);

canvas.addEventListener("mousemove", function(e){
  mouseX = e.clientX;
  mouseY = e.clientY;
},false);

// 10ms(100fps) timer
setInterval(function(){
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.font = "20px mgenplus-p-w";
  context.fillStyle = "rgb(36, 36, 36)";
  context.fillText("マウスカーソルについていきます",20,30);
  context.fillText("Shiftでまわる〜♪",20,55);
  context.fillText("Zかクリックで砲弾発射！",20,80);
  context.fillText("Xでおほー！",20,105);
  context.fillText("この“何か”は、電脳少女シロさんの三次創作です。",20,canvas.height-20);
  console.log(bullets.length);
  while (bullets.length>maxBulletNum){
    bullets.shift();
  }
  for (var i=0; i<bullets.length; i++){
    if (bullets[i].isOut()){
      bullets.splice(i--,1);
    } else {
      bullets[i].update();
    }
  }
  player.update();
  if (inputKeyBuffer[90] && coolDownCount>coolDown) {
    launch();
    coolDownCount = 0;
  } else {
    coolDownCount++;
  }
  if (inputKeyBuffer[88] && coolDownBCount>coolDownB) {
    bomb();
    coolDownBCount = 0;
  } else {
    coolDownBCount++;
  }
},10);

function launch(){
  var image = new Image();
  image.src = "siro.png";
  image.onload = function(){
    var imgHeight = Math.min(canvas.height,canvas.width)*0.2;
    var ratio = imgHeight/image.naturalHeight;
    image.height = ratio * image.naturalHeight;
    image.width = ratio * image.naturalWidth;
    var t = new Bullet(image,mouseX+imgHeight*Math.sin(player.theta),mouseY-imgHeight*Math.cos(player.theta),10,player.theta);
    bullets.push(t);
  }
}

function bomb(){
  for (var i=0; i<bombNum; i++){
    (function(){
      var j = i;
      var image = new Image();
      image.src = "siro.png";
      image.onload = function(){
        var imgHeight = Math.min(canvas.height,canvas.width)*0.2;
        var ratio = imgHeight/image.naturalHeight;
        image.height = ratio * image.naturalHeight;
        image.width = ratio * image.naturalWidth;
        var theta = player.theta+(6.283*j)/bombNum;
        var t = new Bullet(image,mouseX+imgHeight*Math.sin(theta),mouseY-imgHeight*Math.cos(theta),16,theta);
        bullets.push(t);
      }
    })();
  }
}

document.onkeydown = function (e){
  inputKeyBuffer[e.keyCode] = true;
}

document.onkeyup = function (e){
  inputKeyBuffer[e.keyCode] = false;
}