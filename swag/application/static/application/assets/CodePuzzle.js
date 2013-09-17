Crafty.scene("CodePuzzle", function ()
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
    puzzle:"x="+"code1"+"code2 "+" code3",
    puzzletext:null,
    levelNumber:0,
    operators:[],
    timer:null,

    getAnswer:function()
    {
        switch(this.levelNumber)
        {
          case 0:

          return 14;

          case 1:
          return true;

          case 2:
          return 10;

          case 3:
          return " Gamesawesome";

        }
    },


    getCodes:function()
    {
      switch(this.levelNumber)
        {

          case 0:
          return "";
          
          case 1:
          return "b = 1";

          case 2:
          return "";

          case 3:
          return "function('Spil Games'){ \n return str.code().code().code()\n}";

        }

    },

    restart:function()
    {
      Crafty.trigger("Destroy");
      this.loadLevel();
    },
  
    width: function()
    {
      return this.map_grid.width * this.map_grid.tile.width;
    },
   
    height: function()
    {
      return this.map_grid.height * this.map_grid.tile.height;
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
      this.operators = new Array();
      Game.answerArray = new Array();
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

      player = Crafty.e("CodePuzzle,Destroy");


     


      for (var i = 0; i < this.pieceArray.length; i++) 
      {
        var piece = this.pieceArray[i];
        Crafty.e('2D,Canvas,Color,Legend,Destroy').attr({x:10,y:100*i+100,w:170}).setUp(piece.codeString,piece._color);
      };

      Crafty.e('2D,DOM,Text,Destroy').attr({x:655,y:420,w:150}).text('<div style="font-size:15px;">'+"= "+ this.getAnswer().toString());

      Crafty.e('2D,DOM,Text,Destroy').attr({x:50,y:400,w:150}).text('<div style="font-size:15px;">'+ this.getCodes());

      Crafty.e('2D,DOM,Text,Destroy').attr({x:10,y:50,w:300}).text('<div style="font-size:15px;">' + "Try to make the sequence complete");
      
      this.operators.push(Crafty.e('2D,DOM,Text,Operator,Destroy').attr({x:525,y:420,w:100}).getOperator(0));
      this.operators.push(Crafty.e('2D,DOM,Text,Operator,Destroy').attr({x:375,y:420,w:100}).getOperator(1));


     for (var i = 1; i < 4; i++) 
     {
        var ans =  Crafty.e('PuzzleAnswer,putOnTile,Destroy');
        var poly1 = new Crafty.polygon([0,0],[ans._w,0],[ans._w,ans._h],[0,ans._h]);
        ans.collision(poly1);
        ans.x = 150 *i+100;
        ans.y = 400;

        if(Game.levelNumber == 0)
        {
          if(i == 1)
          {
            ans.updateText("10");
          }
          if(i == 3)
          {
            ans.updateText("2");
          }
        } 

        Game.answerArray.push(ans);
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
       Crafty.background("url('/static/blockbackground.png')");
      this.loadLevel();
      game.timer = Crafty.e("Timer");
      game.timer.startTicking();

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


    getTypeTwo:function()
    {
       console.log(Game.levelNumber);
      switch(Game.levelNumber)
      {

        case 0:
              this.stringText = "+"
        break;

        case 1:
              this.stringText = "?"
        break;

        case 2:
              this.stringText = "%"
        break;

        case 3:
              this.stringText = ""
        break;
      }
      this.text('<div style="font-size:20px;">'+this.stringText);
    },

    getTypeOne:function()
    {
      console.log(Game.levelNumber);
      switch(Game.levelNumber)
      {

        case 0:
               this.stringText = "*"
        break;

        case 1:
              this.stringText = ":"
        break;

        case 2:
              this.stringText = "*"
        break;

        case 3:
              this.stringText = ""
        break;
      }

      this.text('<div style="font-size:20px;">'+this.stringText);
    },

    getOperator:function(index)
    {
        if(index == 0) this.getTypeOne();
        else this.getTypeTwo();

        return this;
    },
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
        this.textComp._w = 200;

       
        this.attach(this.textComp);
        this.textComp.x = this.x+10;
        this.textComp.y = this.y+20;
        this.color(c);
    }
});

Crafty.c('PuzzleAnswer',
{
  textComp:null,
  stringText:false,

  init:function()
  {
    this.requires('2D, Canvas, Grid,Collision,Image,Tint');
    _image = this.image('/static/bucket.png');
    //this.color('rgb(255,250,250)');
    this.tint("#FFFF00", 0.3);

    this.textComp = Crafty.e('2D,DOM,Text');
    this.textComp.text("code..");
    this.textComp._w = 80;
    this.textComp._h = 20;


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
    //console.log("updatingText");
    this.textComp.text(str);
    this.stringText = str;
  },

  check:function()
  {
    if(Game.pieceArray.length == 0)
    {

      if(Game.answerArray[0] == undefined || Game.answerArray[1] == undefined ||  Game.answerArray[2] == undefined){
        return;
      }
      var b = 1;
      var test = "nothing";
      var checkString = "x="+ Game.answerArray[0].stringText + Game.operators[1].stringText+  Game.answerArray[1].stringText+ Game.operators[0].stringText + Game.answerArray[2].stringText;
      
      if(Game.levelNumber == 3)
      {
        checkString = Game.answerArray[0].stringText + Game.operators[1].stringText+  Game.answerArray[1].stringText+ Game.operators[0].stringText + Game.answerArray[2].stringText;
        try
        {
           test = eval('"Spil Games"'+checkString);
        }
        catch(error)
        {

        }
      }
      else
      {

       test = eval(checkString);
       console.log(checkString);
      }


      console.log(test);
       
      if(test == Game.getAnswer())
      {

        Crafty.trigger("Destroy");
        if(Game.levelNumber ==3)
        {
          state.skillsMayUpload();
          game.timer.stopTicking(3);
          Crafty.scene("BuildingSkills");
          return;
        }
        Game.levelNumber +=1;
        Game.loadLevel();

      }
      else
      {
        console.log("wrong");
        Crafty.trigger("Destroy");
        Game.loadLevel();
        
      }
      return false;
   }
    return true;
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
      Game.pieceArray.splice(this,1);
      this.destroy();
      e[0].obj.check();
     
    });

    this.bind('EnterFrame',function()
    {

      this.onGridX = (this.x-Game.map_grid.offSetX) / Game.map_grid.tile.width;
      this.onGridY = (this.y-Game.map_grid.offSetY) / Game.map_grid.tile.height;
      
      var tile = Game.myArray[this.onGridX][this.onGridY];
      if(tile != null) tile.obj = null;

      this.y += this.gravity;
      this.isFalling = true;

      
    
      //if(tile != null) tile.obj = this;

      if(this.hit("Block") || this.hit("Piece"))
      {
        this.y -= this.gravity;
        this.isFalling = false;
       
      }

      this.onGridX = (this.x-Game.map_grid.offSetX) / Game.map_grid.tile.width;
      this.onGridY = (this.y-Game.map_grid.offSetY) / Game.map_grid.tile.height;
      var tile = Game.myArray[this.onGridX][this.onGridY];
      if(tile != null) tile.obj = this;


      //this.resetPostionOnTile();

      if(this.y > 600)
      {
        Game.pieceArray.splice(this,1);
        Game.restart();
      }

    })
  },

  resetTile:function()
  {
    this.onGridX = (this.x-Game.map_grid.offSetX) / Game.map_grid.tile.width;
    this.onGridY = (this.y-Game.map_grid.offSetY) / Game.map_grid.tile.height;
    var tile = Game.myArray[this.onGridX][this.onGridY];
    if(tile != null) tile.obj = null;

  },

  setCode:function(index)
  {

    switch(Game.levelNumber)
    {

       case 0:
            switch(index)
            {

              case 0:
                  this.codeString = "2";
              break;

            }

        break;



        case 1:
          switch(index)
          {

            case 0:
                this.codeString = "(b==1)";
            break;

            case 1:
                this.codeString = "false";
            break;

            case 2:
                this.codeString = "true";
            break;

          }

        break;


        case 2:
          switch(index)
          {

            case 0:
                this.codeString = "5";
            break;

            case 1:
                this.codeString = "10";
            break;

            case 2:
                this.codeString = "2";
            break;

          }

        break;

        case 3:
          switch(index)
          {

            case 0:
                this.codeString = ".split('Spil')";
            break;

            case 1:
                this.codeString = ".reverse()";
            break;

            case 2:
                this.codeString = ".join('awesome')";
            break;

          }

        break;

    }

  },

  setType:function(index)
  {
    this.setCode(index);
    switch(index)
    {

      case 0:
          this.color('rgb(128,128,0)');
      break;

      case 1:
          this.color('rgb(0,128,0)');
      break;

      case 2:
          this.color('rgb(0,128,128)');   
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
  leftIndex:-1,

  init: function()
  {
    this.requires('Keyboard,Delay');
    this.selectBlocks(this.indexCount);
    this.indexCount = 0;

    this.requires('Keyboard').bind('KeyDown', function (e)
    { 

    })

    this.bind('KeyUp', function (e)
    { 
      if(e.key == 83)
      {
        skippedLevel(3);
        state.skillsMayUpload();
        Crafty.scene("BuildingSkills");
      }

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


  // checkGameComplete:function()
  // {
  //   if(Game.levelNumber  == 3)
  //   {
  //     console.log("hereere");
  //     game.timer.stopTicking(3);
  //     state.skillsMayUpload();
  //     Crafty.scene("BuildingSkills");
  //   }
  // },

  // endGame:function()
  // {
  //   this.checkGameComplete();
  //   Crafty.trigger("Destroy");
  //   Game.nextLevel();
  //   this.mayStart = false;
  //   this.gameEnded = true;
  // },

  selectBlocks:function(index)
  {
    for (var i = 0; i < Game.blockArray.length; i++) 
    {
        var block =  Game.blockArray[i];
        var blockIndex = (block.y - Game.map_grid.offSetY)/Game.map_grid.tile.height;

        if(block.has('Piece'))continue;

        if(blockIndex == this.indexCount)
        {
            block.selectImage();
        }
         else
        {
           block.deselectImage()
        }

    };

  },

  checkLeftNeighbour:function(x,y)
  {
    this.leftIndex -= 1;
    var tile = Game.myArray[x+this.leftIndex][y];
    if(tile.obj != null)
    {
      if(tile.obj.has('Piece'))
      {
        this.moveArray.push(tile.obj);
        this.checkLeftNeighbour(x,y);
        
      }
    }
  },

  checkRightNeighbour:function(x,y)
  {
    this.leftIndex +=1;
    var tile = Game.myArray[x+this.leftIndex][y];
    if(tile.obj != null)
    {
      if(tile.obj.has('Piece'))
      {
        this.moveArray.push(tile.obj);
        this.checkRightNeighbour(x,y);
      }
    }
  },


  moveBlockLeft:function()
  {
    var hasMoved =false;
    this.moveArray = new Array();
    var gX = 0;
    var gY = 0;

    for (var i = 0; i < Game.blockArray.length; i++) 
    {
        this.leftIndex = -1;
        var block =  Game.blockArray[i];
        var blockIndex = (block.y - Game.map_grid.offSetY)/Game.map_grid.tile.height;
        if(blockIndex == this.indexCount)
        {
          var origin = (block.originPositionX-3)*Game.map_grid.tile.width+Game.map_grid.offSetX;
          if(block.x > origin)
          {
            
            gX = (block.x-Game.map_grid.offSetX) / Game.map_grid.tile.width;
            gY = (block.y-Game.map_grid.offSetY) / Game.map_grid.tile.height;

            var tile = Game.myArray[gX-1][gY];

            if(tile.obj != null)
            {
              if(tile.obj.has('Piece'))
              {
                hasMoved = true;
                this.moveArray.push(tile.obj);
                this.checkLeftNeighbour(gX,gY);
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
         piece.resetTile();
         piece.x += amout;
      }
    };
  },

  moveBlockRight:function()
  {
    var hasMoved =false;
    this.moveArray = new Array();
    var gX = 0;
    var gY = 0;

    for (var i = 0; i < Game.blockArray.length; i++) 
    {
        var block =  Game.blockArray[i];
        this.leftIndex = 1;
        var blockIndex = (block.y - Game.map_grid.offSetY)/Game.map_grid.tile.height;
        if(blockIndex == this.indexCount)
        {
          var origin = (block.originPositionX+3)*Game.map_grid.tile.width+Game.map_grid.offSetX;
          if(block.x < origin)
          {
            gX = (block.x-Game.map_grid.offSetX) / Game.map_grid.tile.width;
            gY = (block.y-Game.map_grid.offSetY) / Game.map_grid.tile.height;

            var tile = Game.myArray[gX+1][gY];

            if(tile.obj != null)
            {
              if(tile.obj.has('Piece'))
              {
                hasMoved = true;
                this.moveArray.push(tile.obj);
                this.checkRightNeighbour(gX,gY);
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