Crafty.c('Sign',
{
  sign:null,
  maxPosition:null,
  minPosition:null,
  offset:5,
  moveDown:false,
  signImage:null,
  timer:null,

  init:function()
  {
    
  },

  setUpSign:function(string)
  {
    this.sign = Crafty.e("2D,Image,Canvas");
    this.signImage = this.sign.image(string);
    var dif = this.signImage.w -  this._w;
    this.sign.x = this.x-dif*0.5;
    this.sign.y = this.y+40;
    this.sign.z = 1;
    this.attach(this.sign);
  },

  rotateImage:function(degrees)
  {
    this.signImage.rotation += degrees;
  },

  updateSignPosition:function()
  {
    this.sign.x = this.x
    this.sign.y = this.y+40;
    this.maxPosition = this.sign.y+this.offset;
    this.minPosition = this.sign.y;
  },

  removeSign:function()
  {
    this.unbind("EnterFrame");
    this.sign.destroy();
  }
});


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
});

Crafty.c('Timer',{

  currentSeconds:0,
  timer:null,
  seconds:"00",
  minutes:"00",

  init:function()
  {
    this.addComponent("2D, DOM,Color,Text,Delay");
    this.textColor('#FFFFFF');
    this.w = 500;
    this.h = 50;
    this.x = window.Crafty.canvas._canvas.clientWidth- 100;
    this.y = 5;
    this.text('<div style="margin-top:10px;font-size:40px">' + this.minutes +":"+this.seconds);

  },

  checkValues:function(val)
  {
      var valString = val + "";
      if(valString.length < 2)
      {
          return "0" + valString;
      }
      else
      {
          return valString;
      }
  },

  getGameMinute:function()
  {
    return this.minutes;
  },

  getGameSeconds:function()
  {
    return this.seconds;
  },

  countUp:function()
  {
      ++this.currentSeconds;
      this.seconds  =  this.checkValues(this.currentSeconds%60);
      this.minutes  = this.checkValues(parseInt(this.currentSeconds/60));
      this.text('<div style="margin-top:10px;font-size:40px">' + this.minutes +":"+this.seconds);
  },

  sendTime:function(level)
  {
    formdata = new FormData();
    var time = "00:"+this.getGameMinute()+":"+this.getGameSeconds()+"";
    formdata.append('time',time);
    formdata.append('level',level)
    $.ajax(
    {
          url: "/gameTime/" +state.get_id()+ "/",
          type: "POST",
          data: formdata,
          processData: false,
          contentType: false,
          success: function (res)
          {

          }
    });
  },

  startTicking:function()
  {
    
    var that = this;
    this.timer = window.setInterval(function(e){ return that.countUp();

    },1000);
  },
  stopTicking:function(level)
  {
    this.sendTime(level);
    window.clearInterval(this.timer);
  }

});



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
    var onGridX = (this.x-Game.map_grid.offSetX) / Game.map_grid.tile.width;
    var onGridY = (this.y-Game.map_grid.offSetY) / Game.map_grid.tile.height;
    Game.myArray[onGridX][onGridY].obj = this;

    return this;
  },

  removeFromTile:function()
  {
    var onGridX = (this.x-Game.map_grid.offSetX) / Game.map_grid.tile.width;
    var onGridY = (this.y-Game.map_grid.offSetY) / Game.map_grid.tile.height;
    Game.myArray[onGridX][onGridY].obj = null;
  }
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
});


Crafty.c('Key',
{
  unlockDoor:false,

  init: function() 
  {
    this.requires('2D, Canvas, Grid,Image,Collision');
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
