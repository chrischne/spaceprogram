// A reference to our box2d world
var world;

// A reference to the rocket
var rocket = null;

//planets
var planets = [];
var nPlanets = 1;


var viewport = null;

var viewportX = 0;
var viewportY = 0;

var viewportWidth = 800;
var viewportHeight = 500;

var acc = 0;
var rocketThrust = 10;

//helper variable for attraction
var distance = new box2d.b2Vec2(0, 0);



function setup() {
  createCanvas(800, 500);

  viewportX = width / 2;
  viewportY = height / 2;

  //create a viewport
  viewport = new Viewport(viewportX, viewportY, viewportWidth, viewportHeight);

  //Initialize box2d physics and create the world
  world = createWorld();

  //create a home planet
  var homePlanet = new Planet(width / 2, height / 2, 30);
  planets.push(homePlanet);

  rocket = new Rocket(0.5 * width, 0.5 * height - 60, 5, 20);

  //create planets
  for (var i = 0; i < nPlanets; i++) {
    var p = new Planet(random(0, width), random(0, height), random(5, 10));
    planets.push(p);
  }


  console.log(planets);

  frameRate(30);
}

function draw() {
  background(51);

  //handlet interaction
  interact();

  //accelerate rocket
  rocket.accelerate(0, acc);

  //apply planet gravity to rocket
  //TODO only make only influenced by closest planet
  planets.forEach(function(p) {
    applyAttraction(p, rocket);
  });

  //simulation step in time
  var timeStep = 1.0 / 30;
  // 2nd and 3rd arguments are velocity and position iterations
  world.Step(timeStep, 10, 10);
  world.ClearForces();

  //center viewport on rocket
 // var pos = scaleToPixels(rocket.body.GetPosition());
 // viewport.setPos(pos.x, pos.y);

  //draw the planets
  planets.forEach(function(p) {
    p.display(viewport);
  });

  //draw rocket
  rocket.display(viewport);

}

function interact() {
  acc = 0;
  if (keyIsDown(UP_ARROW)) {
    // console.log('g');
    acc = -rocketThrust;
  }
}

function keyPressed() {
  //console.log('keyTyped', key);
  if (keyCode == LEFT_ARROW) {
    rocket.rotateLeft(10);
  } else if (keyCode == RIGHT_ARROW) {
    rocket.rotateRight(10);
  }
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