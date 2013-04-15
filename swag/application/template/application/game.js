var crafty = function() {
    //start crafty
    // alert('your applying for role: {{game.vacancy}} in department: {{game.vacancy.department}}');
    Crafty.init(990, 600);

     Crafty.sprite(32, "/static/Sprite.png", {
		 grass:[0,0],
		 sand:[1,0],
		 player:[2,0]
  
    });

	var dialog;    
    
	function generateWorld(){
	
	for (i = 0; i < 31; i++)
	{
		for (j = 0; j < 21; j++)
		{
			if(i != 10  && j != 15){
				
				Crafty.e("2D, Canvas, grass")
                    .attr({ x: i * 32, y: j * 32, z:-1 });
            }else{
				 Crafty.e("2D, Canvas, sand")
                    .attr({ x: i * 32, y: j * 32, z:-1 });
                }    
		}
	}
	
	generateObjects();
	}


	function generateObjects(){
	
	for (i = 0; i < 31; i++)
	{

		for (j = 0; j < 21; j++)
		{
			if(i  == 5 && j == 5){
				  var house  = Crafty.e("2D, Canvas,Image,Collision, house,SetSorting")
				  .collision(new Crafty.polygon([5,0],[110,0],[110,180],[5,180]));
				  house.image("/static/house.png");
				  house.x = 32*i;
				  house.y = 32*j
			   
			}
			
			
			if(i  == 15 && j == 5){
				  var house  = Crafty.e("2D, Canvas,Image,Collision, house,SetSorting")
				  .collision(new Crafty.polygon([5,0],[110,0],[110,180],[5,180]));
				  house.image("/static/house.png");
				  house.x = 32*i;
				  house.y = 32*j
			   
			}
			
			if(i  == 19 && j == 5){
				  var house  = Crafty.e("2D, Canvas,Image,Collision, house,SetSorting")
				  .collision(new Crafty.polygon([5,0],[110,0],[110,180],[5,180]));
				  house.image("/static/house.png");
				  house.x = 32*i;
				  house.y = 32*j
			   
			}
			
			
			if(i  == 15 && j == 1){
				  var house  = Crafty.e("2D, Canvas,Image,Collision, house,SetSorting")
				  .collision(new Crafty.polygon([5,0],[110,0],[110,180],[5,180]));
				  house.image("/static/house.png");
				  house.x = 32*i;
				  house.y = 32*j
			   
			}
		}
		}
	}

	Crafty.c("RightControls", {
        init: function() {
            this.requires('Multiway');
        },
        
        rightControls: function(speed) {
            this.multiway(speed, {UP_ARROW: -90, DOWN_ARROW: 90, RIGHT_ARROW: 0, LEFT_ARROW: 180})
            return this;
        }
        
	});
 
 
	Crafty.c('SetSorting',{
	
	sort:function(alpha,z){
		this.alpha = alpha;
		this.z = z;
		
	},
	
	});


	Crafty.c('NPC',{
	
	isCollidingWithPlayer:false,

	init: function() {
		this.onHit('player',function(hit){
			this.isCollidingWithPlayer = true;
		})
		
		.requires('Keyboard').bind('KeyDown', function () { 
		if (this.isDown('SPACE') && this.isCollidingWithPlayer){  
		
			//dialog.startDialog(this.dailogText);
		}
		})
     }
	
	});


	Crafty.c('Player',{
	
	house:Object,
	isCollidingWithHouse: false,
	dir:0,
	count:0,
	mayStop:false,
	
	convert:function(obj){
		if(typeof this.house === obj)return;
		if(typeof this.house.sort === 'undefined')this.house = obj;
		
		this.house.sort(1,1);
		this.house = obj;
	},

	resetSorting:function(){
		
		if(typeof this.house.sort === 'undefined')return;
		else this.house.sort(1,1);
		
	},
	
	Player:function(){

		

		this.requires("SpriteAnimation")
		 .animate("walk_left",8,0,10)
		 .animate("walk_right",11,0,13)
		 .animate("walk_up",5,0,7)
		 .animate("walk_down",2,0,4)
		 .bind('EnterFrame', function() {
		 
		 })
		 .bind("NewDirection",
			function (direction) {
				this.dir = direction.y;
				if (direction.x < 0) {
					if (!this.isPlaying("walk_left"))
						this.stop().animate("walk_left", 15, -1);
				}
				if (direction.x > 0) {
					if (!this.isPlaying("walk_right"))
						this.stop().animate("walk_right", 10, -1);
				}
				if (direction.y < 0) {
					if (!this.isPlaying("walk_up"))
						this.stop().animate("walk_up", 10, -1);
				}
				if (direction.y > 0) {
					if (!this.isPlaying("walk_down"))
						this.stop().animate("walk_down", 10, -1);
				}
				if(!direction.x && !direction.y) {
					this.stop();
				}
			})
			.bind('Moved', function(from) {
				
				if(dialog.hasStarted)dialog.closeDialog();
					
                    if(this.hit('house')){
                    	this.isCollidingWithHouse = true;
					   if(this.y <= this.hit('house')[0].obj.y+80){
							this.convert(this.hit('house')[0].obj);
							this.house.sort(0.5,2);
						}
						else{
							this.attr({x: from.x, y:from.y});
							if(this.dir.y > 0)this.house.sort(1,1);
						}
					}else{
						this.resetSorting();
						this.isCollidingWithHouse = false;
					} 

			})/*.onHit('npc',function(hit){
				this.isCollidingWithNpc = true;
			})*/
			// .bind('KeyUp', function (e) {
			// 	var $textBox = $("#id_entry");

			// 	if($textBox.is(":focus"))	{
			// 		var existingVal = $textBox.val();
			// 		$textBox.val(existingVal+ String.fromCharCode(e.which));
			// 		return false;
			// 	}

			// 	return true;
				
			// })
			
			.bind('KeyUp', function (e) { 
				if (e.key == 32 && this.isCollidingWithHouse){  

						if (!$(".letter")[0]){
							this.count+=1;

						}
						if (!$(".form2")[0]){
							this.count+=1;

						}

						if(!this.mayStop && this.count == 1){
							$(".letter").show();
							$(".container").show();
							Crafty.stop();
							this.mayStop = true;
							this.count +=1;
							return true;

						}
						
						if(this.count == 0){
							$(".form2").show();
							$(".container").show();
							this.count +=1
						}

						
						 
					}
				return true;

			})
		}
	
	});


	Crafty.c("RightControls", {
        init: function() {
            this.requires('Multiway');
      
        },
        
        rightControls: function(speed) {
            this.multiway(speed, {UP_ARROW: -90, DOWN_ARROW: 90, RIGHT_ARROW: 0, LEFT_ARROW: 180})
            return this;
        }
        
	});

	Crafty.c("Dialog",{
	
		DataText:"",
		hasStarted: false,
		DialogText:"",
		TextIndex:0,
		init:function(){
			this.addComponent("2D, Canvas,Color,Text");
			this.x = 0;
			this.y = 0;
			this.w = 990;  
			this.h = 0;   
			this.color("#FFFFFF");
			this.textColor('#FF0000')
			this.bind('EnterFrame', function() {

				if(this.hasStarted){
					if(this.DialogText.length != this.DataText.length){
						
						this.DialogText += this.DataText[this.TextIndex];
						this.text('<div style="margin-top:12px;">' + this.DialogText);
						this.TextIndex++;
					}
				}
			})
		},
		
	
		closeDialog:function(){
			this.DialogText = "";
			this.text("");
			this.TextIndex = 0;
			this.hasStarted = false;
			this.h =  0;
		},
		
		startDialog:function(data){
			this.DataText = data;
			this.hasStarted = true;
			this.h = 100;
			
		}
		
	});    


	Crafty.scene("loading", function () {
        //load takes an array of assets and a callback when complete
        Crafty.load(["/static/Sprite.png","/static/house.png"], function () {
            Crafty.scene("main"); //when everything is loaded, run the main scene
        });
    });


    //automatically play the loading scene
    Crafty.scene("loading");


    
    Crafty.scene("main", function () {
        $("#container").hide();

		Crafty.settings.modify("autoPause",true)
		generateWorld();
		
		 dialog = Crafty.e("Dialog")
			.attr({ x: 0, y: 500, z: 1});
		
		var player1 = Crafty.e("2D,  Canvas, player,Player,RightControls,Collision,Keyboard")
			.attr({ x: 200, y: 364, z: 1})
			.rightControls(2)
			.Player();
                
        var player2 = Crafty.e("2D,  Canvas, player,Collision,npc,NPC")
			.attr({ x: 400, y: 364, z: 1});
			player2.dailogText = "Hi I`m mister swag";
                
        
		var player3 = Crafty.e("2D,  Canvas, player,Collision,npc,NPC")
			.attr({ x: 450, y: 400, z: 1});
			player3.dailogText = "Welcome to this awesome land";
        
                     
    });

    return {
    	"crafty": Crafty,
    	"init_game": Crafty.init(900,600)
    }
};
