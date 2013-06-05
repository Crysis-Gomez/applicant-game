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
      currentLevel = new Array;
      //levelString = window.block_levels[levelNumber];
      console.log(levelNumber);
      if(typeof window.block_levels[levelNumber] == "string")
      {
        levelString = window.block_levels[levelNumber];
        levelString = levelString.replace(/\r?\n|\r/g,'');
      }
      //if(levelString !== undefined)levelString = levelString.replace(/\r?\n|\r/g,'');
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
      currentLevel = this.getLevel(this.levelNumber);
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
                  Game.player =  Crafty.e('PlayerCharacter,putOnTile,Destroy').at(x, y,0);
                break;

                case "3":
                  Crafty.e('Key,putOnTile,key,Destroy').at(x, y,0);
                break;

                case "4":
                  Crafty.e('Block,putOnTile,block,Destroy').at(x, y,1).putOnTile();
                break;

                case "5":
                  Crafty.e('GameDoor,putOnTile,Destroy').at(x, y,1).putOnTile();
                break;

                default:
            }
        }
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
      Crafty.background('rgb(249, 223, 125)');
      this.loadLevel();  
    }
  }

  Game.start();
});


Crafty.c('Destroy',
{
    init:function()
    {
       this.bind("Destroy",function()
       {
          this.destroy();
       })
    }
})


Crafty.c('Win',
{
    buildingName:"",

    init:function()
    {
        this.addComponent("2D, DOM,Color,Text,Delay");
        this.textColor('#000');
        this.w = 500;
        this.h = 50;
        this.x = 350;
        this.y = 300;
        this.text('<div style="margin-top:12px;font-size:40px">' + "YOU WIN");

        this.delay(function()
        {
          Crafty.scene(this.buildingName);
        }, 5000);
    },

    setBuildingName:function(str)
    {
      this.buildingName = str;
    }
})


Crafty.c('Grid',
{
  init: function()
  {
    this.attr({
        w: Game.map_grid.tile.width,
        h: Game.map_grid.tile.height
    })
  },
 
  at: function(x, y, z)
  {
    if (x === undefined && y === undefined)
    {
      return { x: this.x/Game.map_grid.tile.width+Game.map_grid.offSetX, y: this.y/Game.map_grid.tile.height+Game.map_grid.offSetY,z:z }
    } 
    else 
    {
      this.attr({ x: x * Game.map_grid.tile.width+Game.map_grid.offSetX, y: y * Game.map_grid.tile.height+Game.map_grid.offSetY,z:z});
      return this;
    }
  }
});


Crafty.c('putOnTile',
{

  putOnTile:function()
  {
    onGridX = (this.x-Game.map_grid.offSetX) / Game.map_grid.tile.width;
    onGridY = (this.y-Game.map_grid.offSetY) / Game.map_grid.tile.height;
    Game.myArray[onGridX][onGridY].obj = this;
  },

  removeFromTile:function()
  {
    onGridX = (this.x-Game.map_grid.offSetX) / Game.map_grid.tile.width;
    onGridY = (this.y-Game.map_grid.offSetY) / Game.map_grid.tile.height;
    Game.myArray[onGridX][onGridY].obj = null;
  }
});



Crafty.c('GameWall',
{
  init: function()
  {
    this.requires('2D, Canvas, Grid, Color');
    this.color('rgb(20, 125, 40)');
  },
});


Crafty.c('Timer',{
  init:function(){

  }
});

 
Crafty.c('Tile',
{
  obj:null,
  init: function() 
  {
    this.requires('2D, Canvas, Grid');
  },
});


Crafty.c('Key',
{
  unlockDoor:false,

  init: function() 
  {
    this.requires('2D, Canvas, Grid, Color,Collision');
    this.color('rgb(100,149,237)');
    this.onHit('block',function(e)
    {
        if(!this.unlockDoor)
        {
          Crafty.trigger("unlockDoor");
          this.unlockDoor = true;
        }
    });

  },
});

Crafty.c('GameDoor',
{
  init: function() 
  {
    this.requires('2D, Canvas, Grid, Color');
    this.color('rgb(139,69,19)');
    this.bind("unlockDoor",function()
    {
      this.removeFromTile();
      this.destroy();

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
    this.requires('2D, Canvas, Grid, Color,Collision');
    this.color('rgb(0,0,128)');
  },

  moveBlock:function()
  {
    this.x += this.lastDirectionX *32;
    this.y += this.lastDirectionY *32;
    this.resetPostionOnTile();
  },

  resetPostionOnTile:function()
  {
    tile = Game.myArray[this.onGridX][this.onGridY];
    tile.obj = null;
    this.onGridX = (this.x-Game.map_grid.offSetX) / Game.map_grid.tile.width;
    this.onGridY = (this.y-Game.map_grid.offSetY) / Game.map_grid.tile.height;
    Game.myArray[this.onGridX][this.onGridY].obj = this;
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

  init: function()
  {
    this.requires('Actor,Color,Keyboard,Delay');
    this.color('rgb(0, 0, 0)');
    this.bind('EnterFrame',function(e)
    {
        this.timeMovement();
    });

    this.requires('Keyboard').bind('KeyDown', function (e)
    { 

      this.lastDirectionX = 0;
      this.lastDirectionY = 0;

      if(!Game.mayStart)return;

      if(e.key == 82)
      {
        Game.restart();
      }
      if(e.key  == 39)
      {
        this.lastDirectionX = 1;
      }
      if(e.key == 37)
      {
        this.lastDirectionX = -1;
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
           start = new Date().getTime();
           this.checkMovement();
           this.isMoving = true;
        }

        if(this.isMoving)
        {
          end = new Date().getTime();
          current = end - start;
          if(current > 200)
          {
             this.checkMovement();
             start = new Date().getTime();
          }
        }
    }
  },

  checkGameComplete:function()
  {
    if(Game.levelNumber  == 3)
    {
      state.cvMayUpload();
      Crafty.e("Win").setBuildingName("BuildingCV");
    }
  },

  endGame:function()
  {
    console.log("Destroy Level");
    this.checkGameComplete();
    Crafty.trigger("Destroy");
    Game.nextLevel();
    this.mayStart = false;
    this.gameEnded = true;
  },

  checkMovement:function()
  {

    if(this.gameEnded)return;

    onGridX = (this.x-Game.map_grid.offSetX) / Game.map_grid.tile.width;
    onGridY = (this.y-Game.map_grid.offSetY) / Game.map_grid.tile.height;

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
      if(tile.obj.has('block'))
      {
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