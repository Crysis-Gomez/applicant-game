Crafty.scene("BasePuzzle", function ()
{
 
  Game = {

     n1:null,
     n2:null,
     n3:null,
     n4:null,
     feedBack:null,
     timer:null,
     skipBox:null,

  	getNumber:function(number)
    {
    	switch(number)
    	{
    		case 10:

    		return "A";


    		case 11:

    		return "B";

    		case 12:

    		return "10";
    	}

    },

    checkNumber:function(number)
    {
      if(number > 9 && number <12)
      {
      	 number = this.getNumber(number);
      }

      return number;
    },

    getbasedNumber:function(number)
    {
      
        var baseNumber = 12
        var newNumber = parseInt(number/baseNumber);
        number2 = number % baseNumber;
     	  newNumber = this.checkNumber(newNumber);
        return [newNumber,number2]

    },

    convert:function(number)
    {
        var numList  = new Array();
        var str = '';
        var newNumber = this.getbasedNumber(number);
        var finalNumber = this.checkNumber(newNumber[1]);
        numList.push(finalNumber);

        var numberLenght = number.toString().length;
       
        while (newNumber[0]  > 12)
        {
          newNumber = this.getbasedNumber(newNumber[0]);
          newNumber[1] = this.checkNumber(newNumber[1]);
          numList.push(newNumber[1]);
        }
        numList.push(newNumber[0]);
        numList.reverse();

        if(numList[0] === 0)numList.splice(0,1);

        for (var i = 0; i < numList.length; i++) 
        {
           str += numList[i].toString();
        };

        return str;

    },

  
  	start: function() 
    {
       Crafty.background("url('/static/blockbackground.png')");

        $('#ips').show();
        var numbers = state.ip.split(".");
           
   	    // n1 = this.convert(numbers[0]);
        // n2 = this.convert(numbers[1]);
        // n3 = this.convert(numbers[2]);
        // n4 = this.convert(numbers[3]);

        n1 = this.convert(10);
        n2 = this.convert(104);
        n3 = this.convert(0);
        n4 = this.convert(203);

        console.log(n1,n2,n3,n4);
     
        var IPAddress = Crafty.e("2D, DOM,Text,CheckValue");
        IPAddress.text("We need your IP address, but this computer works with a duodecimal system. Convert your IP address and put it in the fields.The table below should help you");
        IPAddress._w = 800;
        IPAddress.textFont({ size: '20px', weight: 'bold' });
        IPAddress.textColor('#FFFFFFF', 1);
        
        feedBack = Crafty.e("2D, DOM,Text");
        feedBack.text('<div style="font-size:20px;">'+'');
        feedBack._w = 350;
        feedBack.x = SCREEN_WIDTH*0.5-feedBack._w*0.5;
        feedBack.y = SCREEN_HEIGHT-20;
        feedBack.textFont({ size: '20px', weight: 'bold' });
        feedBack.textColor('#FF0000');

        IPAddress.requires('Keyboard').bind('KeyDown', function (e)
        {   
          if (this.isDown('ENTER'))
          {
              if(!Crafty.isPaused())this.checkValue();
          }
          if(e.key == 13)
          {
            if(Game.skipBox.selectText(e.key))
            {
                skippedLevel(4);
                state.linkMayUpload();
                $('#ips').hide();
                Crafty.scene("BuildingLink");
            }
          }

          if(e.key == 83)
          {
            Game.skipBox.showBox();
          }

          if(e.key  == 39)
          {
            if(Crafty.isPaused())
            {
              Game.skipBox.selectText(e.key);
            }

          }
          if(e.key == 37)
          {
            if(Crafty.isPaused())
            {
              Game.skipBox.selectText(e.key);
            }
          }

        });

      Crafty.e("2D, DOM,Image").attr({x:SCREEN_WIDTH*0.5-150, y:SCREEN_HEIGHT*0.5-150, w:900, h:0}).image("/static/table.png")
      Game.timer = Crafty.e("Timer");
      Game.timer.startTicking();
      Game.skipBox = Crafty.e("2D,Canvas,WarningBox");
      Game.skipBox.image("/static/Skip1.png");
      Game.skipBox.place(SCREEN_WIDTH,SCREEN_HEIGHT);
    },
  }

  Game.start();
});

Crafty.c('CheckValue',
{

  checkValue:function()
  {
     var val1 = $('#ip1')[0].value;
     var val2 = $('#ip2')[0].value;
     var val3 = $('#ip3')[0].value;
     var val4 = $('#ip4')[0].value;
     
     if(val1 == n1 && val2 == n2 && val3 == n3 && val4 == n4)
     {
       state.linkMayUpload();
       $('#ips').hide();
       Game.timer.stopTicking(4);
       Crafty.scene("BuildingLink");
     }
     else
    {
      feedBack.text('You have insert an incorrect code, try again please');
    }

  },

})