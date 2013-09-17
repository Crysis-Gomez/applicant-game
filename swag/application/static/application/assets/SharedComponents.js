Crafty.c('Sign',
{
  sign:null,
  offset:5,
  signImage:null,
  timer:null,

  init:function()
  {
  },

  setUpSign:function(string,bool)
  {
    this.sign = Crafty.e("2D,Image,Canvas");
    this.signImage = this.sign.image(string);
    var dif = this.signImage.w -  this._w;
    this.sign.x = this.x-dif*0.5;
    this.sign.y = this.y+40;
    this.sign.z = 1;
    this.sign.maxPosition = this.sign.y+this.offset;
    this.sign.minPosition = this.sign.y;
    this.sign.moveDown = false;
    this.sign.speed = 0.3;
    this.attach(this.sign);
    this.that = this;
    if(bool)
    {
      var that = this;
      this.sign.bind("EnterFrame",that.moveSign);
    }

    return this;
  },

  moveSign:function()
  {

    if(this.y > this.maxPosition) this.moveDown = false;
    if(this.y < this.minPosition) this.moveDown = true;

    if(this.moveDown) this.y += this.speed;
    else this.y -= this.speed;

  },

  rotateImage:function(degrees)
  {
    this.signImage.rotation += degrees;
  },

  updateSignPosition:function()
  {
    this.sign.x = this.x
    this.sign.y = this.y+40;
    this.sign.maxPosition = this.sign.y+this.offset;
    this.sign.minPosition = this.sign.y;
  },

  removeSign:function()
  {
    this.sign.unbind("EnterFrame");
    this.sign.destroy();
  }
});


Crafty.c('Win',
{
    buildingName:"",

    init:function()
    {
        this.addComponent("2D, DOM,Color,Text,Delay");
        this.textColor('#FFFFFF');
        this.w = 500;
        this.h = 50;
        this.x = 350;
        this.y = 300;
        this.text('<div style=" margin-top:12px; font-size:40px; text-shadow: 1px 1px 5px #73F707">'+ "YOU WIN");

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
    this.text('<div style=" margin-top:12px; font-size:40px; text-shadow: 1px 1px 5px #73F707">' + this.minutes +":"+this.seconds);

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
      this.text('<div style=" margin-top:12px; font-size:40px; text-shadow: 1px 1px 5px #73F707">' + this.minutes +":"+this.seconds);
      if(Crafty.isPaused())this.draw();
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


Crafty.c('WarningBox',{
   
   hidden:true,
   _image:null,
   currentIndex:37,


   init:function()
   {
      this.requires('2D,DOM,Image');
   },

   place:function(w,h)
   {
     this._image = this.image("/static/Skip1.png");
     this.x = w *0.5 - this._image._w *0.5;
     this.y = h *0.5 - this._image._h *0.5;
     this._image._w = 0;

   },

   isHidden:function()
   {
     return this.hidden;
   },

   showBox:function()
   {
    
    Crafty.pause(true);
    this._image = this.image("/static/Skip1.png");
    this.draw(); 
    
   },

   hideBox:function()
   {

   },

   selectText:function(index)
   { 
     if(index == 13)
     {
        if(this.currentIndex == 39)
        {
           Crafty.pause(false);
           return true;
        }
        else
        {
          Crafty.pause(false);
          this._image._w = 0;
          this.draw();
          return false;
        }
     }

     if(index == 39)
     {
      this._image = this.image("/static/Skip2.png");
     }
     else
     {
      this._image = this.image("/static/Skip1.png");
     }
     this.draw();
     this.currentIndex = index
   }
});
