//TODO
//Distance from home planet
//Fuel
//display speed
//make zoom depend on distance to planet or speed or so
//attraction from only closest planet
//jet flame
//jet sound 
//show path


// A reference to our box2d world
var world;

// A reference to the rocket
var rocket = null;

//planets
var planets = [];
var nPlanets = 100;
var planetImgPaths = ['assets/planet1.png', 'assets/planet2.png', 'assets/planet3.png'];
var planetImgs = [];
var closestPlanet = 0;

var viewport = null;

var viewportX = 0;
var viewportY = 0;

var viewportWidth = 50;
var viewportHeight = 1;

var followRocket = true;
var autoZoom = true;

var acc = 0;
var rocketThrust = 0.001;

//helper variable for attraction
var distance = new box2d.b2Vec2(0, 0);

var rocketImg = null;

var universeDim = 1000;

function preload() {
  rocketImg = loadImage('assets/rocket.svg');
  planetImgPaths.forEach(function(path) {
    var img = loadImage(path);
    planetImgs.push(img);
  });

}


function setup() {
  createCanvas(1024, 768);

  viewportX = width / 2;
  viewportY = height / 2;

  //create a viewport
  viewportHeight = (height / width) * viewportWidth;
  viewport = new Viewport(viewportX, viewportY, viewportWidth, viewportHeight);

  //Initialize box2d physics and create the world
  world = createWorld();

  //create a home planet
  var homePlanetR = 20;
  var homePlanet = new Planet(planetImgs[0], width / 2, height / 2, homePlanetR);
  planets.push(homePlanet);

  rocket = new Rocket(0.5 * width, 0.5 * height - 1.2 * homePlanetR, 0.5, 2);

  //create planets
  for (var i = 0; i < nPlanets; i++) {
    // var p = new Planet(random(0, width), random(0, height), random(5, 30));
    var p = new Planet(planetImgs[floor(random(0, planetImgs.length))], random(-universeDim, universeDim), random(-universeDim, universeDim), random(5, 20));
    planets.push(p);
  }

  console.log(planets);

  viewportMap();
  frameRate(30);
}

function draw() {
  background(255);

  interact();

  simulate();

  display();

}

function display() {
  //center viewport on rocket
  // var pos = scaleToPixels(rocket.body.GetPosition());
  // viewport.setPos(pos.x, pos.y);
  updateViewport();

  //draw the planets
  planets.forEach(function(p) {
    p.display(viewport);
  });

  //draw rocket
  rocket.display(viewport);
}

function updateViewport() {

  if(autoZoom){
   /* var minD = Number.MAX_VALUE;
    var minIndex = 0;
    var closestPlanet = planets.forEach(function(p,i){
      var d = distanceTo(p,rocket);
      if(d<minD){
        minD = d;
        minIndex = i;
      }
    });*/
   // console.log('minD: ' + minD);
   var d = distanceTo(closestPlanet,rocket);
    var zoom = ceil(map(d,0,20,0.5,10));
    //console.log('zoom',zoom);
    viewportZoom(zoom);
  }
  if (followRocket) {
    var pos = scaleToPixels(rocket.body.GetPosition());
    viewport.setPos(pos.x, pos.y);
  }
}

function interact() {
  acc = 0;
  if (keyIsDown(UP_ARROW)) {
    // console.log('g');
    acc = -rocketThrust;
  }
}

function simulate() {
  //accelerate rocket
  rocket.accelerate(0, acc);

  //apply planet gravity to rocket
  //TODO only make only influenced by closest planet
  closestPlanet = getClosestPlanet(planets,rocket);
 /* planets.forEach(function(p) {
    applyAttraction(p, rocket);
  });*/
  applyAttraction(closestPlanet,rocket);

  //simulation step in time
  var timeStep = 1.0 / 30;
  // 2nd and 3rd arguments are velocity and position iterations
  world.Step(timeStep, 10, 10);
  world.ClearForces();
}

function keyPressed() {
  //console.log('keyTyped', key);
  if (keyCode == LEFT_ARROW) {
    rocket.rotateLeft(10);
  } else if (keyCode == RIGHT_ARROW) {
    rocket.rotateRight(10);
  } else if (key == 'M') {
    console.log('m');
    viewportMap();
  } else if (key == 'R') {
    viewportRocket();
  } else if (key == '1') {
    viewportZoom1();
  } else if (key == '2') {
    viewportZoom2();
  } else if (key == '3') {
    viewportZoom3();
  } else if (key == '4') {
    viewportZoom4();
  } else if (key == '5') {
    viewportZoom5();
  }
  else if(key == 'A'){
    autoZoom = !autoZoom;
    console.log('autoZoom: ' + autoZoom);
  }
}

function viewportZoom1() {
  viewportZoom(1);
}

function viewportZoom2() {
  viewportZoom(2);
}

function viewportZoom3() {
  viewportZoom(3);
}

function viewportZoom4() {
  viewportZoom(4);
}

function viewportZoom5() {
  viewportZoom(5);
}

function viewportZoom(zoom) {
  followRocket = true;
  viewport.set(width / 2, height / 2, zoom * viewportWidth, zoom * viewportHeight);
}

function viewportRocket() {
  followRocket = true;
  viewport.set(width / 2, height / 2, viewportWidth, viewportHeight);
}

function viewportMap() {
  followRocket = true;
  viewport.set(width / 2, height / 2, width, height);
}


function applyAttraction(planet, rocket) {

  //hardcoded version, makes things faster
  var p_pos = rocket.body.GetWorldCenter();
  var anchor_pos = planet.body.GetWorldCenter();
  var p_mass = rocket.body.GetMass();
  var anchor_mass = planet.body.GetMass();

  //console.log('distance',distance);
  distance.SetXY(0, 0);

  // Add the distance to the debris
  distance.SelfAdd(p_pos);

  // Subtract the distance to the anchors's position
  // to get the vector between the particle and the anchors.
  distance.SelfSub(anchor_pos);

  if (distance.Length() < 0.01) {
    // console.log('setting gravity to zero');
    //gravity = 0;
    return;
  }

  //to be changed
  // var force = 5 / distance.Length() * distance.Length();
  var constant = 0.001;
  var distanceSquared = distance.Length() * distance.Length();
  var force = (constant * p_mass * anchor_mass) / distanceSquared;
  //console.log('force',force);

  distance.Normalize();
  distance.SelfNeg();

  distance.SelfMul(force);
  rocket.body.ApplyForce(distance, rocket.body.GetWorldCenter());
}

function distanceTo(p,r){
  var posP = p.getPosition().Clone();
  var posR = r.getPosition().Clone();

  var pRadius = p.getRadius();

  posP.SelfSub(posR);
   var d = posP.Length() - pRadius;
 // console.log('d',d,pRadius);
  return d;
}

function getClosestPlanet(parr,r){
  var closest = null;
  var minD = Number.MAX_VALUE;
  parr.forEach(function(p){
    var d = distanceTo(p,r);
    if(d<minD){
      minD = d;
      closest = p;
    }
  });
  return closest;
}