var state = function() {
	this.player_name = '{{ game.player_name }}';
	this.email = '{{ game.player_email }}';
	this.has_cv = '{{ game.has_cv }}';
	this.has_motivation = '{{game.has_motivation}}';
	
	var that = this;

	var init = function() {

	}

	var setName = function(name) {
		this.player_name = name
	}

	var get_name = function(){
		var my_val = false;
		if (player_name.length > 0) {
			my_val = true;
		}
		return my_val;
	}

	var get_motivation = function(){
		var my_val = false;
		if (has_motivation == 'True') {
			my_val = true;
		}

		return my_val;
	}

	var get_cv = function() {
		var my_val = false;
		if (has_cv == 'True') {
			my_val = true;
		}

		return my_val;
	}


	return {
		getState: function() { init() },
		my_name: function() {
			return name;
		}, 
		check_cv: get_cv,
		check_name:get_name,
		check_motivation:get_motivation,

		update_key: function (value){
			has_cv = value;
			return true;
		},
		update: function(key, value) {
			that[key] = value;
			return true;
		},

		name: function() { 
			return player_name; 
		}
	}
}();
var gamelog = questlog();

var crafty = function() {

    Crafty.init(990, 600);

     Crafty.sprite(32, "/static/Sprite.png", {
		 grass:[0,0],
		 sand:[1,0],
		 player:[2,0]
  
    });

	var dialog;
	
	var quest2 = new Quest("Upload_your_cv",window.state.check_cv);
	var quest3 = new Quest("Upload_your_motivation",window.state.check_motivation);

	gamelog.addQuest(quest2); 
	gamelog.addQuest(quest3);


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
					  house.y = 32*j;
				   
				}
				
				
				/*if(i  == 15 && j == 5){
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
				   
				}*/
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
	dialogFuction:null,
	dialogText:"",

	init: function() {
		this.onHit('player',function(hit){
			this.isCollidingWithPlayer = true;
			if(!dialog.inConversation){
				//show dialog
			}
		},function(noHit){
				//drop dialog
			this.isCollidingWithPlayer = false;
			} 
		)
		
		.requires('Keyboard').bind('KeyDown', function () { 
		if (this.isDown('ENTER') && !Crafty.isPaused() && this.isCollidingWithPlayer){
			if(!dialog.inConversation)dialog.startDialog(this);
			if(dialog.finished){
				dialog.nextDialog();
			}
		}
		})
     }
	
	});

	Crafty.c('AI',{

		walkToPlayer:function(){

		},

		update:function(){
			walkToPlayer();
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

			})
			
			.bind('KeyUp', function (e) {
				
				if (e.key == 76 && !Crafty.isPaused()){  
					var doc = document.getElementById("questlog");
					if(doc.style.display == '')doc.style.display = 'block';
					
					else if(doc.style.display == 'block')doc.style.display = '';
					

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
		dialogIndex:0,
		finished:false,
		inConversation:false,
		data:[],


		init:function(){
			this.addComponent("2D, DOM,Color,Text");
			this.x = 0;
			this.y = 0;
			this.w = 990;  
			this.h = 0;   
			this.color("#FFFFFF");
			this.textColor('#FF0000');
			this.bind('EnterFrame', function() {

				if(this.hasStarted && !this.finished && this.checkDialog()){
					if(this.DialogText.length != this.DataText.length){
						this.DialogText += this.DataText[this.TextIndex];
						this.text('<div style="margin-top:12px;">' + this.DialogText  + '<div style="margin-top:50px;">'  +"Enter to continue");
						this.TextIndex++;

					}else this.finished = true;
				}
			})
		},

		checkDialog:function(){
			if(this.dialogIndex == this.data.length){
				this.closeDialog();
				return false;
			}

			return true; 
		},

		nextDialog:function(){
			if(!Crafty.isPaused()) this.dialogIndex += 1;
			

			this.DataText = this.data[this.dialogIndex];
			if(this.DataText == "CONTACT"){
				$("#container").show();
				$("#contact").show();
				$(".form").show();
				document.getElementById("id_name").focus();
				Crafty.pause();
				return true;
			}
			if(this.DataText == "UPLOAD"){
				$("#container").show();
				$(".form2").show();
				Crafty.pause();
				return true;
			}

			if(this.DataText == "MOTIVATION"){
				$("#container").show();
				$(".Choice").show();
				Crafty.pause();
				return true;
			}


			if(this.DataText == "Bob: Welcome to the vacancy of "){
				this.DataText += "{{game.vacancy}},"+ window.state.name() + "!";
			}  

			this.finished = false;
			this.DialogText = "";
			this.text("");
			this.TextIndex = 0;
			
		
		},
	
		closeDialog:function(){
			this.DialogText = "";
			this.text("");
			this.TextIndex = 0;
			this.hasStarted = false;
			this.finished = false;
			this.inConversation = false;
			this.dialogIndex = 0;
			this.h =  0;

		},
		
		startDialog:function(npc){
			this.npc = npc;
			this.data = npc.dialogFuction(state);
			this.DataText = this.data[this.dialogIndex];
			this.hasStarted = true;
			this.h = 100;
			this.inConversation = true;
			
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

		generateWorld();
		
		 dialog = Crafty.e("Dialog")
			.attr({ x: 0, y: 500, z: 1});
		
		var player1 = Crafty.e("2D,  Canvas, player,Player,RightControls,Collision,Keyboard")
			.attr({ x: 200, y: 364, z: 1})
			.rightControls(2)
			.Player();

		var player2 = Crafty.e("2D,  Canvas, player,Collision,npc,NPC")
			.attr({ x: 400, y: 364, z: 1})
			.dialogFuction = getDialogData1;

		var player3 = Crafty.e("2D,  Canvas, player,Collision,npc,NPC")
			.attr({ x: 700, y: 300, z: 1})
			.dialogFuction = getDialogData2;
		

    });

    return {
    	start:function(){

    	},
    	"crafty": Crafty,
    	"init_game": Crafty.init(900,600)
    }
};
