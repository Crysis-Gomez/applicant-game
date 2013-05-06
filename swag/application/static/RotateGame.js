var middlePoint = null;

Crafty.scene("RotateGame", function ()
{
  RotateGame = {
  // This defines our grid's size and the size of each of its tiles
  map_grid: {
    width:  20,
    height: 10,
    offSetX:120,
    offSetY:120,
    tile: {
      width:  32,
      height: 32
    }
  },

  player:null,
  blockArray:[],
  myArray:Array,
  levelNumber: 0,
 
  width: function()
  {
    return this.map_grid.width * this.map_grid.tile.width;
  },
 
  height: function()
  {
    return this.map_grid.height * this.map_grid.tile.height;
  },

  restart:function(){
    Crafty.trigger("Destroy");
    this.loadLevel();
  },

  getLevel:function(levelNumber)
  {
    currentLevel = new Array;
    levelString = level[levelNumber];
    levelString = levelString.replace(/\r?\n|\r/g,'');
    for (var x = 0; x < RotateGame.map_grid.width; x++)
    {
          currentLevel[x] = new Array();
    }
    index = 0;
     for (var x = 0; x < RotateGame.map_grid.height; x++)
     {
        for (var y = 0; y < RotateGame.map_grid.width; y++)
        {
            currentLevel[x][y] = levelString[index];
            index++;
        }
    }
    return currentLevel;
  },

  loadLevel:function(){
  	currentLevel = this.getLevel(this.levelNumber);
    for (var x = 0; x < RotateGame.map_grid.width; x++) {
      RotateGame.myArray[x] = new Array();
      for (var y = 0; y < RotateGame.map_grid.height; y++) {
      		var count = currentLevel[y][x];
           switch(count)
           {
              case "1":
                Crafty.e('RotateWall,Destroy,Grid2').at(x, y,1);
              break;

              case "8":
               middlePoint =  Crafty.e('checkWall,Destroy,Grid2').at(x, y,0);
              break;

          }
      }
    } 
  },


  nextLevel:function()
  {
    this.loadLevel();
  },


  start: function() 
  {
    Crafty.background('rgb(249, 223, 125)');
    this.loadLevel();
      
  }
}

	RotateGame.start();
});



Crafty.c('checkWall', {
  mayRotateRight:false,

  init: function()
  {
    this.requires('2D, Canvas,Color');
    this.color('rgb(20, 125, 40)');
   }
});


Crafty.c('RotateWall', {
  mayRotateRight:false,

  init: function()
  {
    this.requires('2D, Canvas,Color');
    this.color('rgb(20, 125, 40)');
    this.bind('EnterFrame',function(){
   		if(this.mayRotateRight)
   		{
   			this.RotateAroundPoint(middlePoint,0.01)
   		}

   		this.RotateAroundPoint(middlePoint,0.1)
    });
    this.requires('Keyboard').bind('KeyDown', function (e)
  	{ 

	    if(e.key == 82){
	      //Game.restart();
	    }
	    if(e.key  == 39)
	    {
	      //this.lastDirectionX = 1;
	      console.log("RotateRight");
	    }
	    if(e.key == 37)
	    {
	    	console.log("RotateLeft");
	      //this.lastDirectionX = -1;
	    }

	    if(e.key == 40)
	    {
	      //this.lastDirectionY = 1;
	    }

	    if(e.key == 38)
	    {
	      //this.lastDirectionY = -1;
	    }
	    //this.checkMovement();

  	})
  },

  RotateLeft:function(){

  },

  RotateRight:function(){

  },

  RotateAroundPoint:function(obj2,angle){
  	//console.log(obj2.x,obj2.y);
  	difX = obj2.x - this.x;
  	difY = obj2.y - this.y;

  	rx  = difX * Math.cos(angle) - this.y * Math.sin(angle);
  	ry  = difY * Math.cos(angle) + this.x * Math.sin(angle);

  	newX = rx + this.x;
  	newY = ry + this.y;

  	this.x += 1;
  //this.y += newY;

  	console.log(this.x,this.y)


  }




});




Crafty.c('Grid2', {
  init: function()
  {
    this.attr({
        w: RotateGame.map_grid.tile.width,
        h: RotateGame.map_grid.tile.height
    })
  },
 
  at: function(x, y, z)
  {
    if (x === undefined && y === undefined)
    {
    return { x: this.x/RotateGame.map_grid.tile.width+RotateGame.map_grid.offSetX, y: this.y/RotateGame.map_grid.tile.height+RotateGame.map_grid.offSetY,z:z }
    } 
    else 
    {
      this.attr({ x: x * RotateGame.map_grid.tile.width+RotateGame.map_grid.offSetX, y: y * RotateGame.map_grid.tile.height+RotateGame.map_grid.offSetY,z:z});
      return this;
    }
  }
});



