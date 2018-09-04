let projectiles = [];
let enemies = [];
let bosses = [];
let points = 0;
let pixelImages = {};
let kinds = [];
let bakImg = '';

let bossImg;
let spider;
let shipImg;
let mask;
let virus;

let alfalfa = 230;

function preload() {
	loadImage('./images/bossImg.png', img => (pixelImages.bossImg = img));
	loadImage('./images/spider.png', img => (pixelImages.spider = img));
	loadImage('./images/ship.png', img => (pixelImages.shipImg = img));
	loadImage('./images/mask.png', img => (pixelImages.mask = img));
	loadImage('./images/virus.png', img => (pixelImages.virus = img));
}

function setup() {
	createCanvas(600, 450);
	kinds = ['bossImg', 'spider', 'shipImg', 'mask', 'virus'];
	bakImg = floor(random(kinds.length - 1));
}

function screenItems() {
	background(0);
	image(pixelImages[kinds[bakImg]], 0, 20, 600, 400);
	fill(0, alfalfa);
	noStroke();
	rect(0, 0, 600, 450);

	fill(244);
	text(bakImg, 200, 40);

	fill(200);
	textSize(30);
	fill(200, 0, 0);
	text(points, 560, 30);
}

class Projectile {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.speed = 3;
	}
}

class Ship {
	constructor() {
		this.x = 300;
		this.y = 405;
		this.sizW = 32;
		this.sizH = 40;
		this.health = 5;
	}

	show() {
		image(pixelImages.shipImg, this.x, this.y, this.sizW, this.sizH);
	}

	healthBar() {
		fill(40);
		stroke(190);
		rect(3, 4, 20, 77);
		for (var i = 0; i < this.health; i++) {
			image(pixelImages.shipImg, 5, 15 * i + 5, 15, 15);
		}
	}
}

const nebuchadnezzar = new Ship();

class Boss {
	constructor(x, y) {
		this.x = x; //180
		this.y = y; //10
		this.siz = 70;
		this.speed = -2;
		this.health = 5;
		this.bombs = [];
	}

	show() {
		for (var i = 0; i < bosses.length; i++) {
			image(pixelImages.bossImg, this.x, this.y, this.siz, this.siz);
		}
	}

	move() {
		if (this.y < 150) {
			if (this.x < 50 || this.x > 470) {
				this.speed = -this.speed;
				this.y += 30;
			}
		} else {
			if (this.x < 50 || this.x > 470) {
				this.speed = -this.speed;
				this.y = 200;
			}
		}
		this.x += this.speed;
	}

	//create bombs
	makeB() {
		let ran = floor(random(0, 3));
		let probabilityOfDropping = random();
		let min = 50;
		if (enemies.length <= 0) {
			min = 1;
			probabilityOfDropping += 0.01;
		}
		// if (millis() % floor(random(min, 200)) === 0) {
		if (probabilityOfDropping > 0.99) {
			this.bombs.push({ x: bosses[ran].x + 35, y: bosses[ran].y + 70 });
		}
	}
	//bomb falls from boss
	dropB() {
		for (var i = 0; i < this.bombs.length; i++) {
			if (this.bombs[i].y > 600) {
				this.bombs.splice(i, 1);
			} else {
				noStroke();
				fill(200, 200, 0, random(100, 255));
				triangle(
					this.bombs[i].x - 5,
					this.bombs[i].y - 8,
					this.bombs[i].x + 5,
					this.bombs[i].y - 8,
					this.bombs[i].x,
					this.bombs[i].y + 10
				);
				fill(180, 0, 0);
				ellipse(this.bombs[i].x, this.bombs[i].y, 5, 20);
				this.bombs[i].y += 2;
				this.bombs[i].x += random(-1, 1);
			}
		}
	}
	// bomb hits the ship
	hitB() {
		for (var i = 0; i < this.bombs.length; i++) {
			let D = dist(
				nebuchadnezzar.x + nebuchadnezzar.sizW / 2,
				nebuchadnezzar.y + nebuchadnezzar.sizH,
				this.bombs[i].x,
				this.bombs[i].y
			);

			// fix size of bomb not fixed
			if (D < nebuchadnezzar.sizW / 2 + 5) {
				this.bombs.splice(i, 1);
				nebuchadnezzar.health--;
			}
		}
	}
}

class Enemy {
	constructor(x, y, kind) {
		this.x = x;
		this.y = y;
		this.speed = 4;
		this.kind = kind;
		this.s = 25;
	}

	faster() {
		this.speed = 9;
	}

	showEnemy() {
		image(pixelImages[this.kind], this.x, this.y, this.s, this.s);
	}

	moveEnemy() {
		if (this.x > 550 || this.x < 10) {
			this.speed = -this.speed;
			this.y += 30;
		}
		this.x += this.speed;
		this.y > 650 ? (enemies = []) : '';
	}

	crash() {
		let D = dist(this.x, this.y, nebuchadnezzar.x, nebuchadnezzar.y);
		if (D < 20) {
			this.y = 500;
			nebuchadnezzar.health--;
		}
	}
}

// Populate enemies array with 3 different enemies
for (var i = 1; i < 14; i += 1) {
	enemies.push(new Enemy(i * 40, 80, 'virus'));
	enemies.push(new Enemy(i * 40, 140, 'mask'));
	enemies.push(new Enemy(i * 40, 195, 'spider'));
}

// Populate bosses array
for (var i = 0; i < 300; i += 100) {
	bosses.push(new Boss(180 + i, 10));
}

var moveProjectile = function() {
	for (var i = 0; i < projectiles.length; i++) {
		projectiles[i].y -= projectiles[i].speed;
		fill(255, 0, 0);
		ellipse(
			projectiles[i].x + nebuchadnezzar.sizW / 2,
			projectiles[i].y + 41,
			5,
			5
		);
		if (projectiles[i].y < -10) {
			projectiles.splice(i, 1);
		}
	}
};

function projectileCollision() {
	for (var i = 0; i < projectiles.length; i++) {
		for (var j = 0; j < enemies.length; j++) {
			let D = dist(
				projectiles[i].x,
				projectiles[i].y,
				enemies[j].x,
				enemies[j].y
			);
			if (D < 15 + 5) {
				enemies.splice(j, 1);
				alfalfa -= 2;
				projectiles[i].y = -50;
				points++;
			}
		}
	}
}

function projectileBossCollision() {
	for (var i = 0; i < projectiles.length; i++) {
		for (var j = 0; j < bosses.length; j++) {
			let D = dist(
				projectiles[i].x,
				projectiles[i].y,
				bosses[j].x,
				bosses[j].y
			);
			if (D < 15 + 5) {
				fill(20, 20, 20);
				rect(0, 0, width, height);
				if (bosses[j].health > 0) {
					projectiles[i].y = -50;
					bosses[j].health--;
					points++;
				} else {
					projectiles[i].y = -50;
					bosses[j].x = 900;
					points += 5;
				}
			}
		}
	}
}

function draw() {
	screenItems();

	nebuchadnezzar.show();
	nebuchadnezzar.healthBar();

	bosses.map(b => {
		b.show();
		b.move();
		b.makeB();
		b.dropB();
		b.hitB();
	});

	enemies.map(e => {
		e.showEnemy();
		e.moveEnemy();
		e && e.crash();
	});

	moveProjectile();
	projectileBossCollision();
	projectileCollision();
}

function keyPressed() {
	if (keyCode === 39 && nebuchadnezzar.x < 540) {
		nebuchadnezzar.x = nebuchadnezzar.x + 40;
	}
	if (keyCode === 37 && nebuchadnezzar.x > 30) {
		nebuchadnezzar.x = nebuchadnezzar.x - 40;
	}
}

function keyReleased() {
	if (keyCode === 38) {
		projectiles.push(new Projectile(nebuchadnezzar.x, 370));
	}
}
