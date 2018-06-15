let fondo

function preload(){
	fondo = loadImage(`../img/sod/background1unsodded.jpg`)
}

function setup() {
	createCanvas(900, 600);
	frameRate(17)
}

function draw() {
	background(fondo)
}