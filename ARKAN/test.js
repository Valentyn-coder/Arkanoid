Crafty.c('Ball', {
  required: '2D, Canvas, Color, Collision',
  ball: function(radius, fillCol, outlineCol) {
    this.w = this.h = radius * 2;
    this.fillCol = fillCol;
    this.outlineCol = outlineCol;
    
    const vertices = 64;
    let points = new Array(2 * vertices);
    for (let i = 0; i < 2 * vertices; i += 2) {
      let angle = Math.PI / vertices * i;
      points[i] = radius + Math.cos(angle) * radius; 
      points[i + 1] = radius + Math.sin(angle) * radius;
    }
    this.collision(points);
    return this;
  },
  events: {
    'Draw': function(data) {
      data.ctx.beginPath();
      data.ctx.arc(data.pos._x + data.pos._w / 2,
                   data.pos._y + data.pos._h / 2,
                   data.pos._w / 2, 0, Math.PI * 2, false);
      data.ctx.fillStyle = this.fillCol;
      data.ctx.fill();
      //data.ctx.strokeStyle = this.outlineCol;
      //data.ctx.lineWidth = 2;
      //data.ctx.stroke();
    },
    'UpdateFrame': function() {
       let collisions = this.hit('Wall');
       if (collisions){ 
          for (let coll of collisions) {
           if (coll.overlap > 0)
             console.log(coll.overlap);
           this.x -= coll.overlap * coll.nx;
           this.y -= coll.overlap * coll.ny;
           let velocity = Math.sqrt(this.vx * this.vx +
                                    this.vy * this.vy);
           let vx = -this.vx / velocity;
           let vy = -this.vy / velocity;
           let cos = vx * coll.nx + vy * coll.ny;
           let sin = Math.sqrt(1 - cos * cos);
           let vx1 = coll.nx * cos - coll.ny * sin;
           let vy1 = coll.nx * sin + coll.ny * cos;
           sin = -sin;
           let vx2 = coll.nx * cos - coll.ny * sin;
           let vy2 = coll.nx * sin + coll.ny * cos;
           this.vx = vx1 + vx2 - vx;
           this.vy = vy1 + vy2 - vy;
           this.vx *= velocity;
           this.vy *= velocity;   
           coll.obj.destroy() 
          }
          }
    }
  }
});
Crafty.c('Wall', {
  required: '2D, Canvas, Color, Collision',
  init: function() {
    this.color('black')
  }
});
const WALL_SIZE = 30;

Crafty.init(300, 300);
Crafty.background('#DDDDFF');

let ball = Crafty.e('Ball, Motion')
                 .attr({
                   //x:200,
                   //y:200,
                   //vx:30,
                   //vy:30
                   vx: Math.random() * 300,
                   vy: Math.random() * 300
                 })
                 .ball(20, 'blue', 'black')
                 //.fourway(50)
                 ;
ball.attr({
  x: Crafty.viewport._width / 2 - ball.w / 2,
  y: Crafty.viewport._height / 2 - ball.h / 2
});

Crafty.e('Wall')
      .attr({
        x: 0,
        y: 0,
        w: Crafty.viewport._width,
        h: WALL_SIZE}) 
          ;
Crafty.e('Wall')
      .attr({
        x: Crafty.viewport._width - WALL_SIZE,
        y: 0,
        w: WALL_SIZE,
        h: Crafty.viewport._height
      })
      ;
Crafty.e('Wall')
      .attr({
        x: 0,
        y: Crafty.viewport._height - WALL_SIZE,
        w: Crafty.viewport._width,
        h: WALL_SIZE
      }) 
      ;
Crafty.e('Wall')
      .attr({
        x: 0,
        y: 0,
        w: WALL_SIZE,
        h: Crafty.viewport._height
      })
Crafty.e('Wall')
      .attr({
        x: 130,
        y: 90,
        w: WALL_SIZE,
        h: 2.28 * WALL_SIZE,
        rotation: -53
      })
      ;
Crafty.e('Wall')
      .attr({
        x: 250,
        y: 250,
        w: WALL_SIZE,
        h: WALL_SIZE
      })
      ;
