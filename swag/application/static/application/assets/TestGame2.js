Crafty.scene("TestGame2", function ()
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
    pieceArray:[],
    levelNumber: 0,
    mayStart:false,
    puzzle:"x="+"piece1"+"piece2"+":"+"piece3",
   
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

      if(typeof codelevels[levelNumber] == "string")
      {
        levelString = codelevels[levelNumber];
        levelString = levelString.replace(/\r?\n|\r/g,'');
      }
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

    loadLevel:function()
    {
      var currentLevel = this.getLevel(this.levelNumber);
      this.blockArray = new Array();
      this.pieceArray = new Array();
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
                 var block = Crafty.e('Block,putOnTile,Destroy').at(x, y,0).putOnTile();
                 block.originPositionX = x;
                 this.blockArray.push(block);
                break;

                case "2":
                  var piece = Crafty.e('Piece,putOnTile,Destroy').at(x, y,0).putOnTile();
                  piece.setType(0);
                  this.pieceArray.push(piece);
                break;

                case "3":
                  var piece = Crafty.e('Piece,putOnTile,Destroy').at(x, y,0).putOnTile();
                  piece.setType(1);
                  this.pieceArray.push(piece);
                  
                break;

                case "4":
                  var piece = Crafty.e('Piece,putOnTile,Destroy').at(x, y,0).putOnTile();
                  piece.setType(2);
                  this.pieceArray.push(piece);
                 
                break;

                case "9":
                   // Crafty.e('Answer').at(x, y,0);
                break;

                default:
            }
        }
      }

      if(this.levelNumber < (codelevels.length-1))
      {
         //var hud =  Crafty.e('2D,DOM,Text,Destroy').attr({ x: SCREEN_WIDTH*0.5 - 50, y: 100, z: 1 , w:100}).text('<div style="font-size:15px;">'+"Level: " + (this.levelNumber+1)+" of "+(block_levels.length-1));
      }

      player = Crafty.e("CodePuzzle");


     for (var i = 1; i < 4; i++) 
     {
        var ans =  Crafty.e('PuzzleAnswer,putOnTile,Destroy');
        var poly1 = new Crafty.polygon([0,0],[ans._w,0],[ans._w,ans._h],[0,ans._h]);
        ans.collision(poly1);
        ans.x = 150 *i+100;
        ans.y = 400;
      };
    
      this.mayStart = true; 
    },


    nextLevel:function()
    {
      this.levelNumber += 1;
      this.loadLevel();
    },

    start: function() 
    {
      Crafty.background('rgb(249, 223, 125)');
      this.loadLevel();


      // var controls = Crafty.e("2D,Image,Canvas");
      // image =  controls.image("/static/controls.png");
      // controls.x = SCREEN_WIDTH*0.5 - image._w*0.5;
      // controls.y = SCREEN_HEIGHT - image._h;
      // image.alpha = 0.7;

    }
  }

  Game.start();
});



Crafty.c('CodePuzzle',
{
  lastDirectionX:0,
  lastDirectionY:0,
  gameEnded:false,
  indexCount:0,

  init: function()
  {
    this.requires('Keyboard,Delay');
    this.selectBlocks(this.indexCount);
    //this.color('rgb(0, 0, 0)');

    this.requires('Keyboard').bind('KeyDown', function (e)
    { 


    })

    this.bind('KeyUp', function (e)
    { 

      if(e.key  == 39)
      {
        this.moveBlockRight();
      }
      if(e.key == 37)
      {
        this.moveBlockLeft();
      }

      if(e.key == 40)
      {
        if(this.indexCount  < 3)this.indexCount++;
      }

      if(e.key == 38)
      {
        if(this.indexCount  > 0)this.indexCount--;
      }


      this.selectBlocks(this.indexCount);

    });

  },
})


Crafty.c('PuzzleAnswer',
{
  textComp:null,

  init:function()
  {
    this.requires('2D, Canvas, Grid, Color,Collision');
    this.color('rgb(255,250,250)');
    this.textComp = Crafty.e('2D,DOM,Text');
    this.textComp.text("code..");


    this.attr({
        w: 100 ,
        h: 50
    });

    this.attach(this.textComp);
    this.textComp.x += 35;
    this.textComp.y += 25;
  
  },

  updateText:function(str)
  {
    this.textComp.text(str);
    console.log(str)
  }
})



Crafty.c('Piece',
{
  gravity:8,
  isFalling:false,
  type:null,
  codeString:null,
  init:function()
  {
    this.requires('2D, Canvas, Grid, Color,Collision');
    this.color('rgb(128,128,128)');

    
    this.onHit('PuzzleAnswer',function(e)
    {
      console.log(this.codeString);
      e[0].obj.updateText(this.codeString);

      //e[0].obj.textComptext.text(this.codeString);
      this.destroy();
    });

    this.bind('EnterFrame',function()
    {
      this.y += this.gravity;
      this.isFalling = true;

      if(this.hit("Block") || this.hit("Piece"))
      {
        this.y -= this.gravity;
        this.isFalling = false;

      }


      if(this.hit("Block"))
      {
        this.y -= this.gravity;
        this.isFalling = false;

      }

      // if(this.y > 600)
      // {
      //   Game.checkGameComplete();
      //   Crafty.trigger("Destroy");
      //   Game.nextLevel();
      // }

      // if(this.isFalling && this.has("Sign"))
      // {
      //     this.updateSignPosition();
      // }

    })
  },

  setCode:function(index)
  {
    switch(index)
    {

      case 0:
          this.codeString = "(b==1)?"
      break;

      case 1:
          this.codeString = "false"
      break;

      case 2:
          this.codeString = "true"
      break;


    }

  },

  setType:function(index)
  {
    switch(index)
    {

      case 0:
          this.color('rgb(128,128,0)');
          this.setCode(index);
      break;

      case 1:
          this.color('rgb(0,128,0)');
          this.setCode(index);
      break;

      case 2:
          this.color('rgb(0,128,128)');
          this.setCode(index);
      break;


    }

  },

});



Crafty.c('CodePuzzle',
{
  lastDirectionX:0,
  lastDirectionY:0,
  gameEnded:false,
  indexCount:0,

  init: function()
  {
    this.requires('Keyboard,Delay');
    this.selectBlocks(this.indexCount);
    //this.color('rgb(0, 0, 0)');

    this.requires('Keyboard').bind('KeyDown', function (e)
    { 


    })

    this.bind('KeyUp', function (e)
    { 

      if(e.key  == 39)
      {
        this.moveBlockRight();
      }
      if(e.key == 37)
      {
        this.moveBlockLeft();
      }

      if(e.key == 40)
      {
        if(this.indexCount  < 3)this.indexCount++;
      }

      if(e.key == 38)
      {
        if(this.indexCount  > 0)this.indexCount--;
      }


      this.selectBlocks(this.indexCount);

    });

  },


  checkGameComplete:function()
  {
    if(Game.levelNumber  == 3)
    {
      // state.cvMayUpload();
      // Crafty.e("Win").setBuildingName("BuildingCV");
    }
  },

  endGame:function()
  {
    this.checkGameComplete();
    Crafty.trigger("Destroy");
    Game.nextLevel();
    this.mayStart = false;
    this.gameEnded = true;
  },

  selectBlocks:function(index)
  {
    for (var i = 0; i < Game.blockArray.length; i++) 
    {
        var block =  Game.blockArray[i];
        var blockIndex = (block.y - Game.map_grid.offSetY)/Game.map_grid.tile.height;

        if(block.has('Piece'))continue;

        if(blockIndex == this.indexCount)
        {

          block.color('rgb(128,0,0)');
        }
        else
        {
          block.color('rgb(0,0,128)');
        }

    };

  },

  moveBlockLeft:function()
  {
    var hasMoved =false;

    for (var i = 0; i < Game.blockArray.length; i++) 
    {
        var block =  Game.blockArray[i];
        var blockIndex = (block.y - Game.map_grid.offSetY)/Game.map_grid.tile.height;
        if(blockIndex == this.indexCount)
        {
          var origin = (block.originPositionX-3)*Game.map_grid.tile.width+Game.map_grid.offSetX;
          if(block.x > origin)
          {
            block.x -= 32;
            hasMoved = true;
          }
        }

    };

    if(hasMoved)this.movePieces(-32);
  },

  movePieces:function(amout)
  {

    for (var i = 0; i < Game.pieceArray.length; i++) 
    {
      var piece = Game.pieceArray[i];
      var pieceIndex = (piece.y - Game.map_grid.offSetY)/Game.map_grid.tile.height;
      if(pieceIndex == this.indexCount)
      {
        piece.x += amout
      }
     
    };

  },

  moveBlockRight:function()
  {
    var hasMoved =false;
 
    for (var i = 0; i < Game.blockArray.length; i++) 
    {
        var block =  Game.blockArray[i];
        var blockIndex = (block.y - Game.map_grid.offSetY)/Game.map_grid.tile.height;
        if(blockIndex == this.indexCount)
        {
          var origin = (block.originPositionX+3)*Game.map_grid.tile.width+Game.map_grid.offSetX;
          if(block.x < origin)
          {
            block.x += 32;
            hasMoved = true;
          }
        }

    };
    
    if(hasMoved)this.movePieces(32);

  },

});