Crafty.scene("RotateGame", function ()
{
  Game = {
    // This defines our grid's size and the size of each of its tiles
    map_grid:
    {
      width:  11,
      height: 11,
      offSetX:250,
      offSetY:150,
      tile: 
      {
        width:  32,
        height: 32
      }
    },

    player:null,
    blockArray:[],
    balArray:Array,
    wallArray:Array,
    _wall:null,
    levelNumber: 5,
    ball:null,
    helper:null,
    rotateMiddlePointX:5,
    rotateMiddlePointY:5,
   
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

    nextLevel:function()
    {
      this.levelNumber +=1;
      this.loadLevel();
    },

    checkGameComplete:function()
    {
      if(Game.levelNumber  == 5)
      {
        state.motivationMayUpload();
        Crafty.e("Win").setBuildingName("BuildingMotivation");
      }
    },

    getLevel:function(levelNumber)
    {
      currentLevel = new Array;
      levelString = rotateLevel[levelNumber];
      levelString = levelString.replace(/\r?\n|\r/g,'');
      
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

    loadLevel:function(){
      currentLevel = this.getLevel(this.levelNumber);
      this.wallArray = new Array();
      index = 0;
      for (var x = 0; x < Game.map_grid.width; x++)
      {
        for (var y = 0; y < Game.map_grid.height; y++)
        {
            var count = currentLevel[y][x];
            switch(count)
            {
              case "1":
                this.wallArray.push(Crafty.e('RotateWall,Destroy').at(x, y));

              break;

              case "2":
                this.wallArray.push(this.ball = Crafty.e('RotateBall,Destroy').at(x, y));
              break;

              case "3":
                this.wallArray.push(this.helper = Crafty.e('BallHelper,Destroy').at(x, y));
              break;

              default:
          }
        }
      }

      this._wall =  Crafty.e('RotateWall2,Keyboard,Destroy').at(this.rotateMiddlePointX,this.rotateMiddlePointY);
    },

    start: function()
    {
      Crafty.background('rgb(249, 223, 125)');
      this.loadLevel();
    } 
}  

Game.start();

});


Crafty.c('RotateWall2',
{
  rotateLeft:false,
  rotateRight:false,
  mayRotate:true,
  init: function() 
  {
    this.requires('2D, Canvas, Grid,Keyboard');
    this.bind('KeyDown',function(e){

      if(Game.ball.isFalling)return;

      if(Game.helper != null)
      {
        if(Game.helper.isFalling)return;
      }

      if(e.key == 37 && this.mayRotate)
      {
         this.rotateLeft = true;
         this.rotateRight = false;
         this.setDestinationLeft();
         this.mayRotate = false;
      }

      if(e.key == 39 && this.mayRotate)
      {
        this.rotateRight = true;
        this.rotateLeft = false;
        this.setDestinationRight();
        this.mayRotate = false;
      }
    });

    
    this.bind('EnterFrame',function()
    {
      if(this.rotateLeft)
      {
        this.rotateObjectsLeft();
        this.rotateRight = false;
      }

      if(this.rotateRight)
      {
        this.rotateObjectsRight();
        this.rotateLeft = false;
      }
    })
  },

  rotateObjectsLeft:function()
  {
    count = 0;
    for (var i = 0; i < Game.wallArray.length; i++)
    {
        tempWall =  Game.wallArray[i];
        tempWall.rotate2dPointAboutOrigin(this,-0.1);
        if(tempWall.locked)count++;
    }

    if(count == Game.wallArray.length)
    {
        this.rotateLeft = false;
        this.rotateRight = false;
        this.mayRotate = true;
    }
  },
  
  rotateObjectsRight:function()
  {
    count = 0;
     for (var i = 0; i < Game.wallArray.length; i++)
     {
        tempWall =  Game.wallArray[i];
        tempWall.rotate2dPointAboutOrigin(this,0.1);
        if(tempWall.locked)count++;
      }

      if(count == Game.wallArray.length)
      {
         this.rotateLeft = false;
         this.rotateRight = false;
         this.mayRotate = true;
      }
  },

  setDestinationLeft:function()
  {
    for (var i = 0; i < Game.wallArray.length; i++)
    {
        tempWall =  Game.wallArray[i];
        tempWall.setUpDestinationLeft(this);
    };
  },

  setDestinationRight:function()
  {
    for (var i = 0; i < Game.wallArray.length; i++)
    {
        tempWall =  Game.wallArray[i];
        tempWall.setUpDestinationRight(this);
    };
  }
});


Crafty.c('BallHelper',
{
  gravity:8,
  isFalling:false,
  init:function()
  {
    this.requires('2D, Canvas, Grid, Color,Collision,RotateObject');
    this.color('rgb(246, 50, 40)');
    this.bind('EnterFrame',function()
    {
      this.y += this.gravity;
      this.isFalling = true;
      if(this.hit("RotateWall") || this.hit("RotateBall"))
      {
        this.y -= this.gravity;
        this.isFalling = false;
      }

    })
  },
});

Crafty.c('RotateBall',
{
  gravity:8,
  isFalling:false,
  init:function()
  {
    this.requires('2D, Canvas, Grid, Color,Collision,RotateObject');
    this.color('rgb(20, 50, 40)');
    this.bind('EnterFrame',function()
    {
      this.y += this.gravity;
      this.isFalling = true;
      if(this.hit("RotateWall")||this.hit("BallHelper"))
      {
        this.y -= this.gravity;
        this.isFalling = false;
      }

      if(this.y > 600)
      {
        Game.checkGameComplete();
        Crafty.trigger("Destroy");
        Game.nextLevel();
      }

    })
  },
});

Crafty.c("RotateObject",
{
  destinationX:0,
  destinationY:0,
  locked:false,

  init:function()
  {
    this.origin("center");
  },

  setUpDestinationRight:function(obj)
  {
    this.destinationX = -(this.y - obj.y) + obj.x;
    this.destinationY = (this.x - obj.x) + obj.y;
    this.locked = false;
  },

  setUpDestinationLeft:function(obj)
  {
    this.destinationX = (this.y - obj.y) + obj.x;
    this.destinationY = -(this.x - obj.x) +obj.y;
    this.locked = false;
  },

  lockPosition:function ()
  {
    this.x = this.destinationX;
    this.y = this.destinationY;
    this.rotation = 0;
  },

  rotate2dPointAboutOrigin:function(obj,angle)
  {
     distX = this.x - obj.x;
     distY = this.y - obj.y;
     rx = distX * Math.cos(angle) - distY * Math.sin(angle);
     ry = distY * Math.cos(angle) + distX * Math.sin(angle);
     newX = rx + obj.x;
     newY = ry + obj.y;
     newX = Math.round(newX*100)/100;
     newY = Math.round(newY*100)/100;
     this.x = newX;
     this.y = newY;
     tempR = angle*180/Math.PI;
     this.rotation += tempR;
     if(this.rotation > 89 || this.rotation < -89)
     {
        this.locked = true;
        this.lockPosition();
     }
  }
});


Crafty.c('RotateWall',
{
  init: function()
  {
    this.requires('2D, Canvas, Grid, Color,RotateObject');
    this.color('rgb(20, 125, 40)');
  },

});
