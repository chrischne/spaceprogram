// A reference to our box2d world
var world;

// A reference to the rocket
var rockets = [];

//planets
var planets = [];
var nPlanets = 10;

var viewport = null;

var viewportX = 0;
var viewportY = 0;

var viewportWidth = 800;
var viewportHeight = 500;

var acc = 0;

function setup() {
  createCanvas(800, 500);

  viewportX = width / 2;
  viewportY = height / 2;

  //create a viewport
  viewport = new Viewport(viewportX, viewportY, viewportWidth, viewportHeight);

  //Initialize box2d physics and create the world
  world = createWorld();

  for (var i = 0; i < nPlanets; i++) {
    var p = new Planet(random(0, width), random(0, height), random(10, 40));
    planets.push(p);
  }

  var r = new Rocket(random(0, width), random(0, height), 10, 30);
  rockets.push(r);

  console.log(planets);

  frameRate(30);
}

function draw() {
  background(51);

  //apply forces
  /* if (vondsey) {
     vondsey.accelerate(acc, 0);
   }*/

   //console.log('acc',acc);
   rockets.forEach(function(r){
      r.accelerate(0,acc);
   });

  // We must always step through time!
  var timeStep = 1.0 / 30;

  // 2nd and 3rd arguments are velocity and position iterations
  world.Step(timeStep, 10, 10);
  world.ClearForces();
  /*if (vondsey) {
    //update viewport so that its focused on vondsey
    var pos = scaleToPixels(vondsey.body.GetPosition());
    viewport.setPos(pos.x, pos.y);
  }*/

  //draw the planets
  planets.forEach(function(p) {
    p.display(viewport);
  });

  //draw rocket
  rockets.forEach(function(r) {
    r.display(viewport);
  });

  //surface.display(viewport);

  //draw vondsey
  /*if (vondsey) {
    vondsey.display(viewport);
  }*/

}

/*
function dropParticle() {
  if (vondsey) {
    //remove vondsey if existing
    vondsey.killBody();
  }
  //create a new vondsey
  vondsey = new Particle(100, 10, 20, 10);
}


function generateTerrain(n) {
  //check out https://www.youtube.com/watch?v=y7sgcFhk6ZM how to make a terrain based on perlin noise

  //make a straight in the beginning and the end and on the top
  var start = createVector(0, height / 2);
  var firstQuarter = createVector(width / 4, height / 2);
  var mid = createVector(width / 2, height / 3);
  var thirdQuarter = createVector(3 * width / 4, height / 2);
  var end = createVector(width, height / 2);

  var dir = p5.Vector.sub(firstQuarter, start);
  var step = dir.mag() / (n);
  dir.setMag(step);

  //firstQuarter
  var curr = start.copy();
  var pts = [];
  for (var i = 0; i < n; i++) {
    var v = curr.copy();
    pts.push(v);
    curr.add(dir);
  }

  //go uphill
  var dir = p5.Vector.sub(mid, firstQuarter);
  var step = dir.mag() / (n);
  dir.setMag(step);

  for (var i = 0; i < n; i++) {
    var v = curr.copy();
    pts.push(v);
    curr.add(dir);
  }

  //go downhill
  var dir = p5.Vector.sub(thirdQuarter, mid);
  var step = dir.mag() / (n);
  dir.setMag(step);

  for (var i = 0; i < n; i++) {
    var v = curr.copy();
    pts.push(v);
    curr.add(dir);
  }

  //go straight
  var dir = p5.Vector.sub(end, thirdQuarter);
  var step = dir.mag() / (n);
  dir.setMag(step);

  for (var i = 0; i < n; i++) {
    var v = curr.copy();
    pts.push(v);
    curr.add(dir);
  }

  //last one
  var v = curr.copy();
  pts.push(v);


  return pts;

}*/

function keyTyped() {
  console.log('keyTyped', key);

  if (key == 'v') {
    //dropParticle();
  } else if (key == 'a') {
    if (acc == 0) {
      acc = -1;
    } else {
      acc = 0;
    }
    console.log('acc', acc);
  }
}