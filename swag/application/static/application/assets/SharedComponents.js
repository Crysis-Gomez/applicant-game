Crafty.c('Sign',
{
  sign:null,
  maxPosition:null,
  minPosition:null,
  offset:5,
  moveDown:false,


  init:function()
  {
    
  },

  move:function()
  {

    if(this.moveDown)this.sign.y +=0.3;
    else this.sign.y -= 0.3;

    if(this.sign.y > this.maxPosition) this.moveDown = false;
    if(this.sign.y < this.minPosition) this.moveDown = true;
  },

  setUpSign:function(string)
  {
    this.sign = Crafty.e("2D,Image,Canvas");
    var image = this.sign.image(string);
    this.sign.x = this.x
    this.sign.y = this.y+40;
    this.sign.z = 1;
    this.attach(this.sign);
    this.bind("EnterFrame",this.move);
    this.maxPosition = this.sign.y+this.offset;
    this.minPosition = this.sign.y;
    this.moveDown = true;
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
})