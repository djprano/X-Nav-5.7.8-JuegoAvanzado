// Original game from:
// http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/
// Slight modifications by Gregorio Robles <grex@gsyc.urjc.es>
// to meet the criteria of a canvas class for DAT @ Univ. Rey Juan Carlos

// Create the canvas

var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "images/hero.png";

// princess image
var princessReady = false;
var princessImage = new Image();
princessImage.onload = function () {
	princessReady = true;
};

princessImage.src = "images/princess.png";

// stone image
var stoneReady = false;
var stoneImage = new Image();
stoneImage.onload= function(){
	stoneReady=true;
};
stoneImage.src = "images/stone.png"

// monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload= function(){
	monsterReady=true;
};
monsterImage.src = "images/monster.png"
nivel=0;


var i=0;
// Game objects
var hero = {
	speed: 256 // movement in pixels per second
};
var hero_backup = {};
var stones = new Array();
stones.push({});
var princess = {};
var monsters= new Array;
monsters.push({});
var princessesCaught = 0;

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a princess
var reset = function () {
	hero.x = canvas.width / 2-16;
	hero.y = canvas.height / 2-16;

	// Throw the princess somewhere on the screen randomly
	princess.x = 32 + (Math.random() * (canvas.width - 96));
	princess.y = 32 + (Math.random() * (canvas.height - 96));

	//stones
	for(var i in stones){
		stones[i].x = 32 + (Math.random() * (canvas.width - 96));
		stones[i].y = 32 + (Math.random() * (canvas.height - 96));
	}


	//mosnters
	for (var i in monsters){

		monsters[i].x = 32 + (Math.random() * (canvas.width - 96));
		monsters[i].y = 32 + (Math.random() * (canvas.height - 96));
	}

	if(colision_stones(hero)||colision_stones(princess)){
		reset();
	}
	
	if(colision_monsters(hero)){
		reset();
	}
	



};
//
function colision (object,obstaculo){
	if(object.x+32>obstaculo.x && object.x<obstaculo.x+32){
		if(object.y+32>obstaculo.y && object.y<obstaculo.y+32){
			//hay colision
			return true;
		}
	}
	return false;
}

function colision_stones(object){
	for(var i in stones){
		if(colision(object,stones[i])){
			return true;
		}
	}
	return false;
}

function colision_monsters(object){
	for(var i in monsters){
		if(colision(object,monsters[i])){
			return true;
		}
	}
	return false;
}


function monster_move(monsters,modifier,nivel){
	v=0;
	switch(nivel) {
		case 0:
		v=20;
		break;
		case 1:
		v=15;
		break;
		case 2:
		v=12;
		break;
		case 3:
		v=10;
		break;
	}
	for (var i in monsters){
		if(colision_stones(monsters[i])){
			monsters[i].x=monsters[i].x0;
			monsters[i].y=monsters[i].y0;
		}else{
			if(monsters[i].x<hero.x){

				monsters[i].x0 = monsters[i].x;
				monsters[i].x+=hero.speed * modifier/v;
			}else{
				monsters[i].x0 = monsters[i].x;
				monsters[i].x-=hero.speed * modifier/v;
			}
			if(monsters[i].y<hero.y){
				monsters[i].y0 = monsters[i].y;
				monsters[i].y+=hero.speed * modifier/v;
			}else{
				monsters[i].y0 = monsters[i].y;
				monsters[i].y-=hero.speed * modifier/v;
			}
		}
	}
}

// Update game objects
var update = function (modifier) {
	if (38 in keysDown) { // Player holding up
		if(hero.y>32 && !colision_stones(hero)){
			hero_backup.y = hero.y;
			hero.y -= hero.speed * modifier;
		}else{
			hero.y = hero_backup.y; 
		}
		
	}
	if (40 in keysDown) { // Player holding down
		if(hero.y<canvas.height-64 && !colision_stones(hero)){
			hero_backup.y = hero.y;
			hero.y += hero.speed * modifier;			
		}else{
			hero.y = hero_backup.y;
		}
	}
	if (37 in keysDown) { // Player holding left
		if(hero.x>32 && !colision_stones(hero)){
			hero_backup.x = hero.x;
			hero.x -= hero.speed * modifier;
		}else{
			hero.x = hero_backup.x;
		}
	}
	if (39 in keysDown) { // Player holding right
		if(hero.x<canvas.width-64 && !colision_stones(hero)){
			hero_backup.x = hero.x;
			hero.x += hero.speed * modifier;
		}else{
			hero.x = hero_backup.x;
		}
	}


	// Are they touching?
	if (colision(princess,hero)){
		++princessesCaught;
		if(princessesCaught==10){
			localStorage.setItem("nivel",1);
			nivel=1;
			monsters.push({});
			stones.push({});
		}else if(princessesCaught==15){
			localStorage.setItem("nivel",2);
			nivel=2;
			monsters.push({});
			stones.push({});
		}else if (princessesCaught==20) {
			localStorage.setItem("nivel",3);
			nivel=3;
			monsters.push({});
			stones.push({});
			stones.push({});
		}
		reset();
	}

	if(colision_monsters(hero)){
		princessesCaught=0;
		nivel=0;
		var m ={};
		var s ={};
		monsters=[m];
		stones=[s];
		reset();
	}
	//para que no se monten las piedras unas encima de otras
	for(var i in stones){
		for (var j in stones){
			if(i!=j){
				if(colision(stones[i],stones[j])){
					reset();
				}
			}
		}
	}
	//monster moving
		monster_move(monsters,modifier,nivel);
};

// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}

	if (princessReady) {
		ctx.drawImage(princessImage, princess.x, princess.y);
	}

	if (stoneReady){
		for (var i in stones){
			ctx.drawImage(stoneImage,stones[i].x,stones[i].y);
		}
	}

	if (monsterReady){
		for (var i in monsters){
			ctx.drawImage(monsterImage,monsters[i].x,monsters[i].y);
		}	
	}
	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Princesses caught: " + princessesCaught, 32, 32);

	ctx.fillText("Nivel: "+nivel,400,32);
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;
};



// Let's play this game!
reset();
var then = Date.now();
//The setInterval() method will wait a specified number of milliseconds, and then execute a specified function, and it will continue to execute the function, once at every given time-interval.
//Syntax: setInterval("javascript function",milliseconds);
setInterval(main, 1); // Execute as fast as possible

if(localStorage.getItem("nivel")!=null){
	nivel=parseInt(localStorage.getItem("nivel"));
}

switch(nivel) {
	case 0:
	monsters=[{}];
	stones=[{}];
	reset();
	break;
	case 1:
	monsters=[{},{}];
	stones=[{},{}];
	reset();
	break;
	case 2:
	monsters=[{},{},{}];
	stones=[{},{},{}];
	reset();
	break;
	case 3:
	console.log('test');
	monsters=[{},{},{},{}];
	stones=[{},{},{},{}];
	reset();
	break;

}

