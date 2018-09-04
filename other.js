var bossImg;
var mask;

function preload() {
	bossImg = loadImage('./images/bossImg.png');
	mask = loadImage('./images/mask.png');
}

function setup() {
	createCanvas(600, 400);
}

function draw() {
	image(bossImg, 0, 0);
	image(mask, 200, 0);
}
