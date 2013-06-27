Crafty.scene("TestGame", function ()
{
  // state.linkMayUpload();
  // Crafty.scene("BuildingLink")
  Game = {

  


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
      if(number  == 10 || number  == 11  || number  == 12)
      {
      	 number = this.getNumber(number);
      }

      return number;

    },

    getbasedNumber:function(number)
    {
  
        str = "";
        baseNumber = parseInt(number/12);
        number2 = number % 12;
     	  baseNumber = this.checkNumber(baseNumber);
        return [baseNumber,number2]

    },

    convert:function(number)
    {
        array  = new Array();

        newNumber = this.getbasedNumber(number);
        newNumber[1] = this.checkNumber(newNumber[1]);
        array.push(newNumber[1]);

        numberLenght = number.toString().length;
       
        while (newNumber[0]  > 12)
        {
          newNumber = this.getbasedNumber(newNumber[0]);
          newNumber[1] = this.checkNumber(newNumber[1]);
          array.push(newNumber[1]);
        }
        array.push(newNumber[0]);
        array.reverse();

        if(array[0] === 0)array.splice(0,1);

        for (var i = 0; i < array.length; i++) 
        {
           str += array[i].toString();
        };

        return str;

    },

  


  	start: function() 
    {
        Crafty.background('rgb(249, 223, 125)');
        // console.log(state.ip)
      
   	    n1 = this.convert(95);
        n2 = this.convert(67);
        n3 = this.convert(102);
        n4 = this.convert(58);

        console.log(n1,n2,n3,n4);
     

        IPAddress = Crafty.e("2D, DOM,Text,CheckValue");
        IPAddress.text("The IP address of this computer is 95.67.102.58, but this computer works with a duodecimal system. Pls insert the new code");
        IPAddress._w = 500;
        IPAddress.requires('Keyboard').bind('KeyDown', function ()
        {    

          if (this.isDown('ENTER'))
          {
            
             this.checkValue();

          }
        })

        
    },


    
  }

  Game.start();
});


Crafty.c('CheckValue',
{

  checkValue:function()
  {
     val1 = $('#ip1')[0].value;
     val2 = $('#ip2')[0].value;
     val3 = $('#ip3')[0].value;
     val4 = $('#ip4')[0].value;
     
     if(val1 == n1 && val2 == n2 && val3 == n3 && val4 == n4)
     {
       state.linkMayUpload();
       Crafty.scene("BuildingLink")

     }



  },

})