function Planet(img,x, y, r) {
  this.r = r;
  this.img = img;
  // Define a body
  var bd = new box2d.b2BodyDef();
  bd.type = box2d.b2BodyType.b2_dynamicBody;
 // bd.type = box2d.b2BodyType.b2_staticBody;
  bd.position = scaleToWorld(x, y);

  // Define a fixture
  var fd = new box2d.b2FixtureDef();
  // Fixture holds shape
  fd.shape = new box2d.b2CircleShape();
  fd.shape.m_radius = scaleToWorld(this.r);

  // Some physics
  fd.density = 400.0;
  fd.friction = 10;
  fd.restitution = 0.3;

  // Create the body
  this.body = world.CreateBody(bd);
  // Attach the fixture
  this.body.CreateFixture(fd);

  // Some additional stuff
  //this.body.SetLinearVelocity(new box2d.b2Vec2(random(-5, 5), random(2, 5)));
  //this.body.SetAngularVelocity(random(-5, 5));

  // This function removes the particle from the box2d world
  this.killBody = function() {
    world.DestroyBody(this.body);
  };

  this.getPosition = function(){
    //console.log('body');
    //console.log(this.body);
    return this.body.GetWorldCenter();
  }

  this.getRadius = function(){
    //console.log(this.body);
    return scaleToWorld(this.r);
  }

 /* // Is the particle ready for deletion?
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
  };

  this.accelerate = function(x, y) {
    console.log('accelerate ', x, y);
    var v = createVector(x, y);
    v.rotate(this.body.GetAngle());
    var f = new box2d.b2Vec2(v.x, v.y);
    var worldCenter = this.body.GetWorldCenter();
    this.body.ApplyForce(f, worldCenter);
  };*/

  // Drawing the Particle
  this.display = function(viewport) {
    // Get the body's position
    var pos = scaleToPixels(this.body.GetPosition());
    var screenX = map(pos.x, viewport.left, viewport.right, 0, width);
    var screenY = map(pos.y, viewport.top, viewport.bottom, 0, height);

    var sc = (width - 0) / (viewport.right - viewport.left)
    var screenR = sc * this.r;

    // Get its angle of rotation
    var a = this.body.GetAngleRadians();

    // Draw it!
    //change the code below to draw something which makes more sense than a box
    rectMode(CENTER);
    imageMode(CENTER);
    push();
    //translate(pos.x,pos.y);
    translate(screenX, screenY);
    rotate(a);
    fill(0);
    stroke(0);
    //strokeWeight(2);
    image(this.img,0,0,screenR*2,screenR*2);
    noFill();
    ellipse(0,0,screenR*2,screenR*2);
    pop();
  };

}