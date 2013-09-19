Crafty.scene("BlockGame", function ()
{
  Game = {
  // This defines our grid's size and the size of each of its tiles
    map_grid:
    {
      width:  20,
      height: 10,
      offSetX:120,
      offSetY:120,
      tile: 
      {
        width:  32,
        height: 32
      }
    },

    player:null,
    blockArray:[],
    myArray:Array,
    levelNumber: 0,
    mayStart:false,
    particles:null,
    timer:null,
    skipBox:null,
   
    width: function()
    {
      return this.map_grid.width * this.map_grid.tile.width;
    },
   
    height: function()
    {
      return this.map_grid.height * this.map_grid.tile.height;
    },

    restart:function()
    {
      Crafty.trigger("Destroy");
      this.loadLevel();
    },

    getLevel:function(levelNumber)
    {
      var currentLevel = new Array;

      if(typeof block_levels[levelNumber] == "string")
      {
        levelString = block_levels[levelNumber];
        levelString = levelString.replace(/\r?\n|\r/g,'');
      }
      for (var x = 0; x < Game.map_grid.width; x++)
      {
            currentLevel[x] = new Array();
      }
      index = 0;
       for (var x = 0; x < Game.map_grid.height; x++)
       {
          for (var y = 0; y < Game.map_grid.width; y++)
          {
              currentLevel[x][y] = levelString[index];
              index++;
          }
      }
      return currentLevel;
    },

    loadLevel:function()
    {
      var currentLevel = this.getLevel(this.levelNumber);
      Game.myArray = new Array(Game.map_grid.width);
      for (var x = 0; x < Game.map_grid.width; x++)
      {
        Game.myArray[x] = new Array();
        for (var y = 0; y < Game.map_grid.height; y++)
        {
            Game.myArray[x][y] = Crafty.e('Tile,Destroy').at(x, y); 
            var count = currentLevel[y][x];
             switch(count)
             {
                case "1":
                  Crafty.e('GameWall,putOnTile,Destroy').at(x, y,0).putOnTile();
                break;

                case "2":
                    if(this.levelNumber == 0)
                    { 
                      Game.player =  Crafty.e('PlayerCharacter,putOnTile,Destroy,Sign').at(x, y,0).setUpSign("/static/you.png",true);
                    }
                    else
                    {
                      Game.player =  Crafty.e('PlayerCharacter,putOnTile,Destroy').at(x, y,0);
                    }
                break;

                case "3":

                    Crafty.e('Key,putOnTile,key,Destroy').at(x, y,0);
                break;

                case "4":
                  if(this.levelNumber == 0)
                  {
                     Crafty.e('Block,putOnTile,block,Destroy,Sign').at(x, y,1).putOnTile().setUpSign("/static/sign2.png",true);
                  }
                  else
                  {
                    Crafty.e('Block,putOnTile,block,Destroy').at(x, y,1).putOnTile();
                  }
                 
                break;

                case "5":
                  Crafty.e('GameDoor,putOnTile,Destroy').at(x, y,0).putOnTile();
                break;

                default:
            }
        }
      }

      if(this.levelNumber < (block_levels.length-1))
      {
         var hud =  Crafty.e('2D,DOM,Text,Destroy').attr({ x: SCREEN_WIDTH*0.5 - 90, y: 50, z: 1 , w:180}).text('<div style="font-size:25px; text-shadow: 1px 1px 5px #73F707">'+"Level: " + (this.levelNumber+1)+" of "+(block_levels.length-1));
	       hud.textColor('#FFFFFF');
      }
    
      this.mayStart = true; 
    },

    nextLevel:function()
    {
      this.levelNumber +=1;
      this.loadLevel();
    },

    start: function() 
    {
      Crafty.background("url('/static/blockbackground.png')");
      this.loadLevel();  

      var controls = Crafty.e("2D,Image,Canvas");
      image =  controls.image("/static/controls.png");
      controls.x = SCREEN_WIDTH*0.5 - image._w*0.5;
      controls.y = SCREEN_HEIGHT - image._h-40;
      image.alpha = 0.7;
      Game.timer = Crafty.e("Timer");
      Game.timer.startTicking();
      Game.skipBox = Crafty.e("2D,Canvas,WarningBox");
      Game.skipBox.image("/static/Skip1.png");
      Game.skipBox.place(SCREEN_WIDTH,SCREEN_HEIGHT);
      
    }
  }

  Game.start();
});


Crafty.c('GameWall',
{
  init: function()
  {
    this.requires('2D,Image,Canvas, Grid,');
    this.image("/static/blockwall.png");
  },
});


Crafty.c('Tile',
{
  obj:null,
  init: function() 
  {
    this.requires('2D, Canvas, Grid');
  },
});


Crafty.c('GameDoor',
{
  locked:true,

  particleOptions:{
          maxParticles: 20,
          size: 10,
          sizeRandom: 4,
          speed: 0.001,
          speedRandom: 1.2,
          // Lifespan in frames
          lifeSpan: 29,
          lifeSpanRandom: 7,
          // Angle is calculated clockwise: 12pm is 0deg, 3pm is 90deg etc.
          angle: 65,
          angleRandom: 34,
          startColour: [200, 200, 200, 1],
          startColourRandom: [0, 0, 0, 0],
          endColour: [255, 255, 255, 0],
          endColourRandom: [60, 60, 60, 0],
          // Only applies when fastMode is off, specifies how sharp the gradients are drawn
          sharpness: 20,
          sharpnessRandom: 10,
          // Random spread from origin
          spread: 10,
          // How many frames should this last
          duration: -1,
          // Will draw squares instead of circle gradients
          fastMode: false,
          gravity: { x: 0, y: -0.05 },
          // sensible values are 0-3
          jitter: 0
        },


  shootParticle:function()
  {
    particles = Crafty.e("2D,Canvas,Particles").particles(this.particleOptions);
    particles.x = this.x+this.w*0.5;
    particles.y = this.y+this.h*0.5;
  },

  init: function() 
  {
    this.requires('2D, Canvas, Grid,Image');
    this.image("/static/blockdoor.png");
    this.bind("unlockDoor",function()
    {
      this.locked = false;
      //this.removeFromTile();
      this.shootParticle();
      this.visible =false;
      //this.destroy();
    })
  },
});


Crafty.c('Actor',
{
  init: function()
  {
    this.requires('2D, Canvas, Grid');
  },
});

Crafty.c('Block',
{
  lastDirectionX:0,
  lastDirectionY:0,
  onGridX:0,
  onGridY:0,

  init: function() 
  {
    this.requires('2D, Canvas, Grid, Image,Collision');
    this.image("/static/block.png");
  },

  moveBlock:function()
  {
    this.x += this.lastDirectionX *32;
    this.y += this.lastDirectionY *32;
    this.resetPostionOnTile();
  },

  resetPostionOnTile:function()
  {
    var tile = Game.myArray[this.onGridX][this.onGridY];
    tile.obj = null;
    this.onGridX = (this.x-Game.map_grid.offSetX) / Game.map_grid.tile.width;
    this.onGridY = (this.y-Game.map_grid.offSetY) / Game.map_grid.tile.height;
    Game.myArray[this.onGridX][this.onGridY].obj = this;
  },

  selectImage:function()
  {
    this.image("/static/blockselect.png");
  },

  deselectImage:function()
  {
    this.image("/static/block.png");
  },

  checkMovement:function(x,y)
  {
    this.lastDirectionX = x;
    this.lastDirectionY = y;
    this.onGridX = (this.x-Game.map_grid.offSetX) / Game.map_grid.tile.width;
    this.onGridY = (this.y-Game.map_grid.offSetY) / Game.map_grid.tile.height;
    tile =  Game.myArray[this.onGridX+x][this.onGridY+y];
    if(tile === undefined)
      return;

    if(tile.obj == null)
    {
      this.moveBlock();
      return true;
    }
    else
    {
      /*if(tile.obj.has('block'))
      {
          if(tile.obj.checkMovement(this.lastDirectionX,this.lastDirectionY))
          {
            this.moveBlock(this.lastDirectionX,this.lastDirectionY);
            return true;
          }
      }*/
    }
  }
});

Crafty.c('PlayerCharacter',
{
  lastDirectionX:0,
  lastDirectionY:0,
  isMoving:false,
  gameEnded:false,
  startCount:0,
  endCount:0,

  init: function()
  {
    this.requires('Actor,Keyboard,Delay,Image');
    this.image("/static/blockplayer.png");
    this.bind('EnterFrame',function(e)
    {
        this.timeMovement();
    });

    this.requires('Keyboard').bind('KeyDown', function (e)
    { 

      this.lastDirectionX = 0;
      this.lastDirectionY = 0;

      if(!Game.mayStart)return;

      if(e.key == 13)
      {
        if(Game.skipBox.selectText(e.key))
        {
           skippedLevel(1);
           state.cvMayUpload();
           Crafty.scene("BuildingCV");
        }
      }

      if(e.key == 82)
      {
        Game.restart();
      }

      if(e.key == 83)
      {

        Game.skipBox.showBox();
      }

      if(e.key  == 39)
      {
        this.lastDirectionX = 1;
        if(Crafty.isPaused())
        {
          Game.skipBox.selectText(e.key);
        }

      }
      if(e.key == 37)
      {
        this.lastDirectionX = -1;
        if(Crafty.isPaused())
        {
          Game.skipBox.selectText(e.key);
        }
      }

      if(e.key == 40)
      {
        this.lastDirectionY = 1;
      }

      if(e.key == 38)
      {
        this.lastDirectionY = -1;
      }

    })

    this.bind('KeyUp', function (e)
    { 

      if(e.key  == 39)
      {
        this.lastDirectionX = 0;
        this.isMoving = false;
      }
      if(e.key == 37)
      {
        this.lastDirectionX = 0;
        this.isMoving = false;
      }

      if(e.key == 40)
      {
        this.lastDirectionY = 0;
        this.isMoving = false;
      }

      if(e.key == 38)
      {
        this.lastDirectionY = 0;
        this.isMoving = false;
      }

    });

  },

  timeMovement:function(){

    if(this.lastDirectionX != 0 || this.lastDirectionY != 0)
    {
        if(!this.isMoving)
        {
           this.startCount = new Date().getTime();
           this.checkMovement();
           this.isMoving = true;

           if(Game.player.has('Sign'))
           {
             Game.player.removeSign();
             Game.player.removeComponent('Sign')
           }
        }

        if(this.isMoving)
        {
          this.endCount = new Date().getTime();
          current = this.endCount - this.startCount;
          if(current > 200)
          {
             this.checkMovement();
             this.startCount = new Date().getTime();
          }
        }
    }
  },

  checkGameComplete:function()
  {
    if(Game.levelNumber  == 3)
    {
      state.cvMayUpload();
      Game.timer.stopTicking(1);
      Crafty.e("Win").setBuildingName("BuildingCV");
    }
  },

  endGame:function()
  {
    particles.destroy();
    this.checkGameComplete();
    Crafty.trigger("Destroy");
    Game.nextLevel();
    this.mayStart = false;
    this.gameEnded = true;
  },

  checkMovement:function()
  {

    if(this.gameEnded)return;

    var  onGridX = (this.x-Game.map_grid.offSetX) / Game.map_grid.tile.width;
    var  onGridY = (this.y-Game.map_grid.offSetY) / Game.map_grid.tile.height;
    var tile = null;

    if(tile = Game.myArray[onGridX+this.lastDirectionX] === undefined)
    {
      this.endGame();
      return;
    }
    tile =  Game.myArray[onGridX+this.lastDirectionX][onGridY+this.lastDirectionY];
    
    if(tile === undefined)
    {
      this.endGame();
      return;
    }

    if(tile.obj == null)
    {
      this.movePlayer(this.lastDirectionX,this.lastDirectionY);
    }
    else
    {

      if(tile.obj.has('GameDoor'))
      {
          this.endGame();
          return;
      }

      if(tile.obj.has('block'))
      {


        
        if(tile.obj.has('Sign'))
        {
          tile.obj.removeSign();
          tile.obj.removeComponent('Sign');
        }

        if(tile.obj.checkMovement(this.lastDirectionX,this.lastDirectionY))
        {
            this.movePlayer(this.lastDirectionX,this.lastDirectionY);
        }
      }
    }
  },

  movePlayer:function(x,y)
  {
    this.x += x*Game.map_grid.tile.width;
    this.y += y*Game.map_grid.tile.height;

  },
});
