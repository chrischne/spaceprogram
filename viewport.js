// Constructor
function Viewport(x, y, w, h) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.left = this.x - this.w / 2;
  this.right = this.x + this.w / 2;
  this.top = this.y - this.h / 2;
  this.bottom = this.y + this.h / 2;


  this.calcBounds = function() {
    this.left = this.x - this.w / 2;
    this.right = this.x + this.w / 2;
    this.top = this.y - this.h / 2;
    this.bottom = this.y + this.h / 2;
  };

  this.setPos = function(x, y) {
    this.x = x;
    this.y = y;
    this.calcBounds();
  };

  this.set = function(x,y,w,h){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.calcBounds();
  };


}