Crafty.scene("RotateGame", function ()
{
  Game = {
    // This defines our grid's size and the size of each of its tiles
    map_grid:
    {
      width:  11,
      height: 11,
      offSetX:250,
      offSetY:100,
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
    goal:null,
    _wall:null,
    levelNumber: 0,
    ball:null,
    helper:null,
    rotateMiddlePointX:5,
    rotateMiddlePointY:5,
    degrees:0,
    timer:null,
   
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
        game.timer.stopTicking(2);
        Crafty.e("Win").setBuildingName("BuildingMotivation");
      }
    },

    getLevel:function(levelNumber)
    {
      var currentLevel = new Array;
      var levelString = rotate_levels[levelNumber];
      levelString = levelString.replace(/\r?\n|\r/g,'');
      
      for (var x = 0; x < Game.map_grid.width; x++)
      {
          currentLevel[x] = new Array();
      }
      var index = 0;
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
      var currentLevel = this.getLevel(this.levelNumber);
      this.wallArray = new Array();
      var index = 0;
      for (var x = 0; x < Game.map_grid.width; x++)
      {
        for (var y = 0; y < Game.map_grid.height; y++)
        {
            var count = currentLevel[y][x];
            switch(count)
            {
              case "1":
                this.wallArray.push(Crafty.e('RotateWall,Destroy').at(x, y,0));

              break;

              case "2":
              if(this.levelNumber == 0)
              {
                 this.wallArray.push(this.ball = Crafty.e('RotateBall,Destroy,Sign').at(x, y,0));
                 this.ball.setUpSign("/static/sign1.png");
              }
              else
              {
                 this.wallArray.push(this.ball = Crafty.e('RotateBall,Destroy').at(x, y,0));
              }
               
              break;

              case "3":
                this.wallArray.push(this.helper = Crafty.e('BallHelper,Destroy').at(x, y,0 ));
              break;

              case "4":
                  goal = Crafty.e('Goal,Sign,Destroy').at(x, y,0);
                  goal.setUpSign("/static/goal.png");
                  this.wallArray.push(goal);

              break;

              default:
          }
        }
      }

      if(this.levelNumber < (rotate_levels.length-1))
      {
         var hud =  Crafty.e('2D,DOM,Text,Destroy').attr({ x: SCREEN_WIDTH*0.5 - 90, y: 50, z: 1 , w:180}).text('<div style="font-size:25px; text-shadow: 1px 1px 5px #73F707">'+"Level: " + (this.levelNumber+1)+" of "+(rotate_levels.length-1));
        hud.textColor('#FFFFFF');
      }
    
      this._wall =  Crafty.e('RotateWall2,Keyboard,Destroy').at(this.rotateMiddlePointX,this.rotateMiddlePointY);
    },

    start: function()
    {
      Crafty.background("url('/static/blockbackground.png')");
      this.loadLevel();
      var controls = Crafty.e("2D,Image,Canvas");
      var image =  controls.image("/static/controls2.png");
      controls.x = SCREEN_WIDTH*0.5 - image._w*0.5;
      controls.y = SCREEN_HEIGHT - image._h;
      image.alpha = 0.7;
      game.timer = Crafty.e("Timer");
      game.timer.startTicking();
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
    this.bind('KeyDown',function(e)
    {
      if(e.key == 82)
      {

        Game.restart();
        return;
      }

      if(Game.ball.isFalling)return;

      if(Game.helper != null)
      {
        if(Game.helper.isFalling)return;
      }

      if(e.key == 83)
      {
        skippedLevel(2);
        state.motivationMayUpload();
        Crafty.scene("BuildingMotivation");
      }

      if(e.key == 37 && this.mayRotate)
      {
       this.rotateLeft = true;
       this.rotateRight = false;
       this.setDestinationLeft();
       this.mayRotate = false;
       Game.degrees = -90;
      }

      if(e.key == 39 && this.mayRotate)
      {
        this.rotateRight = true;
        this.rotateLeft = false;
        this.setDestinationRight();
        this.mayRotate = false;
        Game.degrees = 90;
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
    var count = 0;
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
    var count = 0;
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
        var tempWall =  Game.wallArray[i];
        tempWall.setUpDestinationLeft(this);
    };
  },

  setDestinationRight:function()
  {
    for (var i = 0; i < Game.wallArray.length; i++)
    {
        var tempWall =  Game.wallArray[i];
        tempWall.setUpDestinationRight(this);
    };
  }
});


Crafty.c('Goal',
{
  init:function()
  {
    this.requires('2D, Canvas, Grid,RotateObject');
  }
});

Crafty.c('BallHelper',
{
  gravity:8,
  isFalling:false,
  init:function()
  {
    this.requires('2D, Canvas, Grid,Image,Collision,RotateObject');
    this.image('/static/block.png');
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
    this.requires('2D, Canvas, Grid, Image,Collision,RotateObject');
    this.image('/static/blockplayer.png');
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

      if(this.isFalling && this.has("Sign"))
      {
        this.updateSignPosition();
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
     var distX = this.x - obj.x;
     var  distY = this.y - obj.y;
     var  rx = distX * Math.cos(angle) - distY * Math.sin(angle);
     var ry = distY * Math.cos(angle) + distX * Math.sin(angle);
     var  newX = rx + obj.x;
     var  newY = ry + obj.y;
     newX = Math.round(newX*100)/100;
     newY = Math.round(newY*100)/100;
     this.x = newX;
     this.y = newY;
     var tempR = angle*180/Math.PI;
     this.rotation += tempR;
     if(this.rotation > 89 || this.rotation < -89)
     {
        this.locked = true;
        this.lockPosition();

        if(this.has("Sign"))
        {
          this.updateSignPosition();
          goal.rotateImage(Game.degrees);
          Game.degrees = 0;
        }
     }
  }
});


Crafty.c('RotateWall',
{
  init: function()
  {
    this.requires('2D, Canvas, Grid,Image,RotateObject');
    this.image("/static/blockwall.png");
  },
});
