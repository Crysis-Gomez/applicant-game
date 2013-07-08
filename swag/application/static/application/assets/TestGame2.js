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
    myArray:[],
    pieceArray:[],
    answerArray:[],
    levelNumber: 0,
    mayStart:false,
    puzzle:"x="+"code1"+"code2 "+ ":"+" code3",
    puzzletext:null,
    answer:true,
    operators:[],

   
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
        Game.answerArray.push(ans);
      };


      for (var i = 0; i < this.pieceArray.length; i++) 
      {
        var piece = this.pieceArray[i];
        Crafty.e('2D,Canvas,Color,Legend').attr({x:10,y:100*i+100,w:100}).setUp(piece.codeString,piece._color);
      };

      Crafty.e('2D,DOM,Text').attr({x:655,y:420,w:100}).text('<div style="font-size:15px;">'+"= "+ this.answer.toString());


      this.operators.push(Crafty.e('2D,DOM,Text,Operator').attr({x:525,y:420,w:100}).text('<div style="font-size:20px;">'+":").setUp("?"));
      this.operators.push(Crafty.e('2D,DOM,Text,Operator').attr({x:375,y:420,w:100}).text('<div style="font-size:15px;">'+"?").setUp(":"));

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

  // state.skillsMayUpload();
  // Crafty.scene("BuildingSkills")

  Game.start();
});


Crafty.c('Operator',
{
    stringText:null,
    
    init:function()
    {

    },

    setUp:function(str)
    {
       this.stringText = str;
       return this;
    }
});



Crafty.c('Legend',
{
    textComp:null,
    
    init:function()
    {
        this.textComp = Crafty.e('2D,DOM,Text');
         this.attr({
            w: 100 ,
            h: 50
        });
    },

    setUp:function(str,c)
    {
   
        this.textComp.text('<div style="font-size:15px;">'+str);

       
        this.attach(this.textComp);
        this.textComp.x = this.x+30;
        this.textComp.y = this.y+20;
        this.color(c);
    }
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
  stringText:"test",

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
    this.stringText = str;
    this.check();

  },

  check:function()
  {

    if(Game.pieceArray.length == 1)
    {

      var b = 1;
      var checkString = "x="+ Game.answerArray[0].stringText + Game.operators[0].stringText+  Game.answerArray[1].stringText+ Game.operators[1].stringText + Game.answerArray[2].stringText;
      var test = eval(checkString);

      console.log(test);

      if(test == Game.answer)
      {
        console.log("hell Yeah");
      }
      else
      {
        console.log("your stupid!!!!");
      }

   }
  
  }
})



Crafty.c('Piece',
{
  gravity:8,
  isFalling:false,
  type:null,
  codeString:null,
  onGridX:0,
  onGridY:0,

  init:function()
  {
    this.requires('2D, Canvas, Grid, Color,Collision');
    this.color('rgb(128,128,128)');

    
    this.onHit('PuzzleAnswer',function(e)
    {
      e[0].obj.updateText(this.codeString);
      Game.pieceArray.splice(e[0].obj,1);

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

      this.resetPostionOnTile();


      // if(this.hit("Block"))
      // {
      //   this.y -= this.gravity;
      //   this.isFalling = false;

      // }

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

  resetPostionOnTile:function()
  {
    this.onGridX = (this.x-Game.map_grid.offSetX) / Game.map_grid.tile.width;
    this.onGridY = (this.y-Game.map_grid.offSetY) / Game.map_grid.tile.height;

    var tile = Game.myArray[this.onGridX][this.onGridY];
    if(tile == null)return;
    tile.obj = null;
    this.onGridX = (this.x-Game.map_grid.offSetX) / Game.map_grid.tile.width;
    this.onGridY = (this.y-Game.map_grid.offSetY) / Game.map_grid.tile.height;
    Game.myArray[this.onGridX][this.onGridY].obj = this;
  },

  setCode:function(index)
  {
    switch(index)
    {

      case 0:
          this.codeString = "(b==1)"
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
  moveArray:null,

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
    this.moveArray = new Array();

    for (var i = 0; i < Game.blockArray.length; i++) 
    {
        var block =  Game.blockArray[i];
        var blockIndex = (block.y - Game.map_grid.offSetY)/Game.map_grid.tile.height;
        if(blockIndex == this.indexCount)
        {
          var origin = (block.originPositionX-3)*Game.map_grid.tile.width+Game.map_grid.offSetX;
          if(block.x > origin)
          {
            
            this.onGridX = (block.x-Game.map_grid.offSetX) / Game.map_grid.tile.width;
            this.onGridY = (block.y-Game.map_grid.offSetY) / Game.map_grid.tile.height;

            var tile = Game.myArray[this.onGridX-1][this.onGridY];

            if(tile.obj != null)
            {
              if(tile.obj.has('Piece'))
              {
                hasMoved = true;
                this.moveArray.push(tile.obj);

              }
            }
            
            block.x -= 32;
            block.resetPostionOnTile();
            
          }
        }

    };

    if(hasMoved)this.movePieces(-32);
  },

  movePieces:function(amout)
  {

    for (var i = 0; i < this.moveArray.length; i++) 
    {
      var piece = this.moveArray[i];
      var pieceIndex = (piece.y - Game.map_grid.offSetY)/Game.map_grid.tile.height;
      if(pieceIndex == this.indexCount)
      {
         piece.x += amout
         piece.resetPostionOnTile();
      }
     
    };

  },

  moveBlockRight:function()
  {
    var hasMoved =false;
    this.moveArray = new Array();
    for (var i = 0; i < Game.blockArray.length; i++) 
    {
        var block =  Game.blockArray[i];
        var blockIndex = (block.y - Game.map_grid.offSetY)/Game.map_grid.tile.height;
        if(blockIndex == this.indexCount)
        {
          var origin = (block.originPositionX+3)*Game.map_grid.tile.width+Game.map_grid.offSetX;
          if(block.x < origin)
          {
            this.onGridX = (block.x-Game.map_grid.offSetX) / Game.map_grid.tile.width;
            this.onGridY = (block.y-Game.map_grid.offSetY) / Game.map_grid.tile.height;

            var tile = Game.myArray[this.onGridX+1][this.onGridY];

            if(tile.obj != null)
            {
              if(tile.obj.has('Piece'))
              {
                hasMoved = true;
                this.moveArray.push(tile.obj);
              }
            }
            
            block.x += 32;
            block.resetPostionOnTile();
          }
        }

    };
    
    if(hasMoved)this.movePieces(32);

  },

});