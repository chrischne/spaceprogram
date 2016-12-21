// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Constructor
//this will be the rocket or make rocket similar
function Rocket(x, y, w, h) {
  this.w = w;
  this.h = h;

  // Define a body
  var bd = new box2d.b2BodyDef();
  bd.type = box2d.b2BodyType.b2_dynamicBody;
  bd.position = scaleToWorld(x, y);

  // Define a fixture
  var fd = new box2d.b2FixtureDef();
  // Fixture holds shape
  fd.shape = new box2d.b2PolygonShape(); //new box2d.b2CircleShape();
  fd.shape.SetAsBox(
    scaleToWorld(0.5 * this.w),
    scaleToWorld(0.5 * this.h)
  );
  // fd.shape.m_radius = scaleToWorld(this.r);

  // Some physics
  fd.density = 0.1;
  fd.friction = 0.1;
  fd.restitution = 0.1;

  // Define fixture #2
  var leftStelt = new box2d.b2FixtureDef();
  leftStelt.shape = new box2d.b2PolygonShape();
  leftStelt.shape.SetAsOrientedBox(
    scaleToWorld(0.5 * this.w),
    scaleToWorld( 0.5*this.h),
    new box2d.b2Vec2(scaleToWorld(-this.w),scaleToWorld(0.5*this.h)/*-0.5*this.w,0.5*this.h*/),
    0
  );
  leftStelt.density = 0.1;
  leftStelt.friction = 0.5;
  leftStelt.restitution = 0.2;

    // Define fixture #3
  var rightStelt = new box2d.b2FixtureDef();
  rightStelt.shape = new box2d.b2PolygonShape();
  rightStelt.shape.SetAsOrientedBox(
    scaleToWorld(0.5 * this.w),
    scaleToWorld( 0.5*this.h),
    new box2d.b2Vec2(scaleToWorld(this.w),scaleToWorld(0.5*this.h)/*-0.5*this.w,0.5*this.h*/),
    0
  );
  rightStelt.density = 0.1;
  rightStelt.friction = 0.5;
  rightStelt.restitution = 0.2;

  console.log(fd);
  console.log(leftStelt);

  // Create the body
  this.body = world.CreateBody(bd);
  // Attach the fixture
  this.body.CreateFixture(fd);
  this.body.CreateFixture(leftStelt);
   this.body.CreateFixture(rightStelt);

  // Some additional stuff
  //this.body.SetLinearVelocity(new box2d.b2Vec2(random(-5, 5), random(2, 5)));
  //this.body.SetAngularVelocity(random(-5, 5));

  // This function removes the particle from the box2d world
  this.killBody = function() {
    world.DestroyBody(this.body);
  };

  /*// Is the particle ready for deletion?
  this.done = function() {
    // Let's find the screen position of the particle
    var transform = this.body.GetTransform();
    var pos = scaleToPixels(transform.position);
    // Is it off the bottom of the screen?
    if (pos.y > height + this.w * 2) {
      this.killBody();
      return true;
    }
    return false;
  };*/

  this.accelerate = function(x, y) {
    console.log('accelerate ', x, y);
    var v = createVector(x, y);
    v.rotate(this.body.GetAngle());
    var f = new box2d.b2Vec2(v.x, v.y);
    var worldCenter = this.body.GetWorldCenter();
    this.body.ApplyForce(f, worldCenter);
  };

  this.rotateLeft = function(angle){
    this.body.SetAngularVelocity(0);
      this.rotate(-angle);

      console.log(this.body);
  };

  this.rotateRight = function(angle){
    this.body.SetAngularVelocity(0);
    this.rotate(angle);
  };

  this.rotate = function(angle){
    console.log('this.body',this.body,this.body.GetMass());
    var currAngle = this.body.GetAngleDegrees();
    var newAngle = currAngle + angle;
    this.body.SetAngleDegrees(newAngle);
    //console.log(currAngle);
  };


  // Drawing the Particle
  this.display = function(viewport) {
    // Get the body's position
    var pos = scaleToPixels(this.body.GetPosition());
    var screenX = map(pos.x, viewport.left, viewport.right, 0, width);
    var screenY = map(pos.y, viewport.top, viewport.bottom, 0, height);

    var sc = (width - 0) / (viewport.right - viewport.left)
    var screenW = sc * this.w;
    var screenH = sc * this.h;

    // Get its angle of rotation
    var a = this.body.GetAngleRadians();

    // Draw it!
    //change the code below to draw something which makes more sense than a box
    rectMode(CENTER);
    push();
    //translate(pos.x,pos.y);
    translate(screenX, screenY);
    rotate(a);

    push();
    fill(127);
    stroke(200);
    //strokeWeight(2);
    //rect(0, 0, this.r*2, this.r*2);
    rect(0, 0, screenW, screenH);

    //left Stelt
    push();
    translate(-screenW,0.5*screenH);
    rect(0,0,screenW,screenH);
    pop();

    //right Stelt
    push();
    translate(screenW,0.5*screenH);
    rect(0,0,screenW,screenH);
    pop();
    pop();
    pop();
  };
}