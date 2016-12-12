// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// A fixed boundary class

// An uneven surface boundary

function Surface(verts) {


  this.surface = [];

  if (!verts) {
    // Here we keep track of the screen coordinates of the chain
    this.surface.push(new box2d.b2Vec2(0, height / 2));
    this.surface.push(new box2d.b2Vec2(width / 4, height / 2));
    this.surface.push(new box2d.b2Vec2(width / 2, height / 2 - 80));
    this.surface.push(new box2d.b2Vec2(3 * width / 4, height / 2));
    this.surface.push(new box2d.b2Vec2(width, height / 2));
  } else {
    for (var i = 0; i < verts.length; i++) {
      var v = verts[i];
      this.surface.push(new box2d.b2Vec2(v.x, v.y));
    }
  }

  for (var i = 0; i < this.surface.length; i++) {
    this.surface[i] = scaleToWorld(this.surface[i]);
  }

  // This is what box2d uses to put the surface in its world
  var chain = new box2d.b2ChainShape();
  chain.CreateChain(this.surface, this.surface.length);

  // Need a body to attach shape!
  var bd = new box2d.b2BodyDef();
  this.body = world.CreateBody(bd);

  // Define a fixture
  var fd = new box2d.b2FixtureDef();
  // Fixture holds shape
  fd.shape = chain;

  // Some physics
  fd.density = 1.0;
  fd.friction = 0.00001;
  fd.restitution = 0.00001;

  // Attach the fixture
  this.body.CreateFixture(fd);

  // A simple function to just draw the edge chain as a series of vertex points
  this.display = function(viewport) {
    strokeWeight(1);
    stroke(200);
    fill(200);
    //noFill();
    push();
    beginShape();
    for (var i = 0; i < this.surface.length; i++) {
      var v = scaleToPixels(this.surface[i]);
      var screenX = map(v.x, viewport.left, viewport.right, 0, width);
      var screenY = map(v.y, viewport.top, viewport.bottom, 0, height);
      //vertex(v.x, v.y);
      vertex(screenX, screenY);
    }
    var screenX = map(width, viewport.left, viewport.right, 0, width);
    var screenY = map(height, viewport.top, viewport.bottom, 0, height);
    vertex(screenX, screenY);
    screenX = map(0, viewport.left, viewport.right, 0, width);
    screenY = map(height, viewport.top, viewport.bottom, 0, height);
    vertex(screenX, screenY);
    endShape(CLOSE);
    pop();
  };
}