//VARIABLES
var lives=3;
var level_settings=500;
var setting_speed=1000;
const block_size_short=50;
const block_size_length=200;
const wall_long=1200
const wall_short=10
//Crafty.init(1300,600);
//TEXTURES_MUSIC_SOUNDS
var game_assets = {
      "sprites": {
        "https://opengameart.org/sites/default/files/more_breakout_pieces.png": {
          tile: 64,
          tileh: 48,
          map: {
            normal_block_1: [2, 5],  
            normal_block_2: [8, 5],  
            platform: [6, 10],
            ball: [6, 1]  
      }
        },
        "http://opengameart.org/sites/default/files/preview_383.png": {
      tile: 133,
      tileh: 36,
      map: {
        yellow_btn: [2, 3]
      }
    }
      }, 
      "audio": {
        "back_music": ["https://opengameart.org/sites/default/files/DST-TowerDefenseTheme_1.mp3"],
        "ball_hit": ["https://opengameart.org/sites/default/files/attack_hit.mp3"],
        "lose_music": ["https://opengameart.org/sites/default/files/Iwan%20Gabovitch%20-%20Dark%20Ambience%20Loop.mp3"],
        "win_music": ["https://opengameart.org/sites/default/files/Beyond%20The%20Clouds%20%28Dungeon%20Plunder%29_0.mp3"],    
        "score_plus": ["https://opengameart.org/sites/default/files/133008__cosmicd__annulet-of-absorption.wav"],
        "life_lost": ["https://opengameart.org/sites/default/files/Error%20or%20failed.mp3"]
      }
    };
    //BALL_TEST
    
    //BLOCK_OBJECT
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
           let collisions_b = this.hit('Block');
           let collisions_w = this.hit('Wall');
           let collisions_p = this.hit('platform');
           if (collisions_b){ 
            Crafty.audio.play("life_lost");
              for (let coll_b of collisions_b) {
               if (coll_b.overlap > 0)
                 console.log(coll_b.overlap);
               this.x -= coll_b.overlap * coll_b.nx;
               this.y -= coll_b.overlap * coll_b.ny;
               let velocity = Math.sqrt(this.vx * this.vx +
                                        this.vy * this.vy);
               let vx = -this.vx / velocity;
               let vy = -this.vy / velocity;
               let cos = vx * coll_b.nx + vy * coll_b.ny;
               let sin = Math.sqrt(1 - cos * cos);
               let vx1 = coll_b.nx * cos - coll_b.ny * sin;
               let vy1 = coll_b.nx * sin + coll_b.ny * cos;
               sin = -sin;
               let vx2 = coll_b.nx * cos - coll_b.ny * sin;
               let vy2 = coll_b.nx * sin + coll_b.ny * cos;
               this.vx = vx1 + vx2 - vx;
               this.vy = vy1 + vy2 - vy;
               this.vx *= velocity;
               this.vy *= velocity;   
               coll_b.obj.destroy() 
               //Crafty.audio.unmute();
               //Crafty.audio.play("score_plus");
              }
              }
              if (collisions_p){ 
                Crafty.audio.play("ball_hit");
                for (let coll_p of collisions_p) {
                 if (coll_p.overlap > 0)
                   console.log(coll_p.overlap);
                 this.x -= coll_p.overlap * coll_p.nx;
                 this.y -= coll_p.overlap * coll_p.ny;
                 let velocity = Math.sqrt(this.vx * this.vx +
                                          this.vy * this.vy);
                 let vx = -this.vx / velocity;
                 let vy = -this.vy / velocity;
                 let cos = vx * coll_p.nx + vy * coll_p.ny;
                 let sin = Math.sqrt(1 - cos * cos);
                 let vx1 = coll_p.nx * cos - coll_p.ny * sin;
                 let vy1 = coll_p.nx * sin + coll_p.ny * cos;
                 sin = -sin;
                 let vx2 = coll_p.nx * cos - coll_p.ny * sin;
                 let vy2 = coll_p.nx * sin + coll_p.ny * cos;
                 this.vx = vx1 + vx2 - vx;
                 this.vy = vy1 + vy2 - vy;
                 this.vx *= velocity;
                 this.vy *= velocity;   
                 //Crafty.audio.unmute();
                 //Crafty.audio.play("score_plus");
                }
                }
                if (collisions_w){ 
                  Crafty.audio.play("ball_hit");
                  for (let coll_w of collisions_w) {
                   if (coll_w.overlap > 0)
                     console.log(coll_w.overlap);
                   this.x -= coll_w.overlap * coll_w.nx;
                   this.y -= coll_w.overlap * coll_w.ny;
                   let velocity = Math.sqrt(this.vx * this.vx +
                                            this.vy * this.vy);
                   let vx = -this.vx / velocity;
                   let vy = -this.vy / velocity;
                   let cos = vx * coll_w.nx + vy * coll_w.ny;
                   let sin = Math.sqrt(1 - cos * cos);
                   let vx1 = coll_w.nx * cos - coll_w.ny * sin;
                   let vy1 = coll_w.nx * sin + coll_w.ny * cos;
                   sin = -sin;
                   let vx2 = coll_w.nx * cos - coll_w.ny * sin;
                   let vy2 = coll_w.nx * sin + coll_w.ny * cos;
                   this.vx = vx1 + vx2 - vx;
                   this.vy = vy1 + vy2 - vy;
                   this.vx *= velocity;
                   this.vy *= velocity;   
                   //Crafty.audio.unmute();
                   //Crafty.audio.play("score_plus");
                  }
                  }  
              }
      }
    });

    Crafty.c('Block', {
      required: '2D, Canvas, normal_block_1, Collision, Obstacle',
      init: function() {
        //this.color('black');
      }
    });
    //WALL_OBJECT
    Crafty.c('Wall', {
      required: '2D, Canvas, Color, Collision, Obstacle',
      init: function() {
        this.color('black');
      }
    });
    
    Crafty.init(1350,620);  
    Crafty.load(game_assets);
    ////////
    //BLOCKS
    ////////
    let ball = Crafty.e('Ball, Motion')
                 .attr({
                   //x:200,
                   //y:200,
                   //vx:30,
                   //vy:30
                   vx: level_settings,
                   vy: level_settings
                 })
                 .ball(20, 'Red', 'black')
                 //.fourway(50)
                 ;
ball.attr({
  x: Crafty.viewport._width / 2 - ball.w / 2,
  y: Crafty.viewport._height / 2 - ball.h / 2
});
    Crafty.e('Wall')
    .attr({
      x: 50,
      y: 10,
      w: wall_short,
      h: wall_long
    });
    Crafty.e('Wall')
    .attr({
      x: 1250,
      y: 10,
      w: wall_short,
      h: wall_long
    });
    Crafty.e('Wall')
    .attr({
      x: 50,
      y: 10,
      w: wall_long,
      h: wall_short
    });
    Crafty.e('Wall')
    .attr({
      x: 50,
      y: 600,
      w: wall_long,
      h: wall_short
    });
    Crafty.e('Block')
    .attr({
      x: 150,
      y: 20,
      w: block_size_length,
      h: block_size_short
    });
    Crafty.e('Block')
    .attr({
      x: 300,
      y: 20,
      w: block_size_length,
      h: block_size_short
    });
    Crafty.e('Block')
    .attr({
      x: 450,
      y: 20,
      w: block_size_length,
      h: block_size_short
    });
    Crafty.e('Block')
    .attr({
      x: 600,
      y: 20,
      w: block_size_length,
      h: block_size_short
    });
    Crafty.e('Block')
    .attr({
      x: 750,
      y: 20,
      w: block_size_length,
      h: block_size_short
    });
    Crafty.e('Block')
    .attr({
      x: 900,
      y: 20,
      w: block_size_length,
      h: block_size_short
    });
    Crafty.e('Block')
    .attr({
      x: 1050,
      y: 20,
      w: block_size_length,
      h: block_size_short
    });
    Crafty.e('Block')
    .attr({
      x: 150,
      y: 100,
      w: block_size_length,
      h: block_size_short
    });
    Crafty.e('Block')
    .attr({
      x: 300,
      y: 100,
      w: block_size_length,
      h: block_size_short
    });
    Crafty.e('Block')
    .attr({
      x: 450,
      y: 100,
      w: block_size_length,
      h: block_size_short
    });
    Crafty.e('Block')
    .attr({
      x: 600,
      y: 100,
      w: block_size_length,
      h: block_size_short
    });
    Crafty.e('Block')
    .attr({
      x: 750,
      y: 100,
      w: block_size_length,
      h: block_size_short
    });
    Crafty.e('Block')
    .attr({
      x: 900,
      y: 100,
      w: block_size_length,
      h: block_size_short
    });
    Crafty.e('Block')
    .attr({
      x: 1050,
      y: 100,
      w: block_size_length,
      h: block_size_short
    });
    Crafty.e('Block')
    .attr({
      x: 150,
      y: 180,
      w: block_size_length,
      h: block_size_short
    });
    Crafty.e('Block')
    .attr({
      x: 300,
      y: 180,
      w: block_size_length,
      h: block_size_short
    });
    Crafty.e('Block')
    .attr({
      x: 450,
      y: 180,
      w: block_size_length,
      h: block_size_short
    });
    Crafty.e('Block')
    .attr({
      x: 600,
      y: 180,
      w: block_size_length,
      h: block_size_short
    });
    Crafty.e('Block')
    .attr({
      x: 750,
      y: 180,
      w: block_size_length,
      h: block_size_short
    });
    Crafty.e('Block')
    .attr({
      x: 900,
      y: 180,
      w: block_size_length,
      h: block_size_short
    });
    Crafty.e('Block')
    .attr({
      x: 1050,
      y: 180,
      w: block_size_length,
      h: block_size_short
    });
    Crafty.e('Block')
    .attr({
      x: 150,
      y: 260,
      w: block_size_length,
      h: block_size_short
    });
    Crafty.e('Block')
    .attr({
      x: 300,
      y: 260,
      w: block_size_length,
      h: block_size_short
    });
    Crafty.e('Block')
    .attr({
      x: 450,
      y: 260,
      w: block_size_length,
      h: block_size_short
    });
    Crafty.e('Block')
    .attr({
      x: 600,
      y: 260,
      w: block_size_length,
      h: block_size_short
    });
    Crafty.e('Block')
    .attr({
      x: 750,
      y: 260,
      w: block_size_length,
      h: block_size_short
    });
    Crafty.e('Block')
    .attr({
      x: 900,
      y: 260,
      w: block_size_length,
      h: block_size_short
    });
    Crafty.e('Block')
    .attr({
      x: 1050,
      y: 260,
      w: block_size_length,
      h: block_size_short
    });
    ///////
    //WALLS
    ///////  
    //Crafty.audio.play("back_music");
    Crafty.background('blue');
      var main_platform = Crafty.e("2D, Canvas, platform, Collision, Twoway")
      .attr({x:600, y:500, w:120, h:70})
      .twoway(setting_speed);
      
      var playBtn = Crafty.e("2D, Canvas, Mouse, yellow_btn").attr({
        x: 10,
        y: 50,
        w: 133,
        h: 36
      });
      
      var playText = Crafty.e("2D, Canvas, Text").textFont({ size: '14px', weight: 'bold' }).attr({
        x: 55,
        y: 60
      }).text("Music");
      
      playBtn.bind('Click', function() {
        Crafty.audio.unmute();
        Crafty.audio.play("back_music",-1,0.5);
      });
      var muteBtn = Crafty.e("2D, Canvas, Mouse, yellow_btn").attr({
      x: 10,
      y: 80,
      w: 160,
      h: 36
      });
      var muteText = Crafty.e("2D, Canvas, Text").textFont({ size: '14px', weight: 'bold' }).attr({
      x: 50,
      y: 90
      }).text("Mute sounds");
      
      muteBtn.bind('Click', function() {
        //Crafty.audio.mute();
        Crafty.audio.pause("back_music");
        //Block.destroy();
      });

      main_platform.reel("skin", 1000, [
            [0, 7],
            [0, 8]
          ]);

      main_platform.animate("skin", -1);
      



