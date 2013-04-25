var state = function() 
{
	this.player_name = '{{ game.player_name }}';
	this.email = '{{ game.player_email }}';
	this.has_cv = '{{ game.has_cv }}';
	this.has_motivation = '{{game.has_motivation}}';
	this.playerPositionx = 300;
	this.playerPositiony = 300;///django shit doen.
	this.has_quest_log = false;

	////CV
	this.mayUploadCV = false;
	this.unLockedCV = false;

	var check_MayUploadCV = function()
	{
		return mayUploadCV;
	}

	var check_UnlockedCV = function()
	{
		return unLockedCV;
	}


	var cv_MayUpload = function()
	{
		mayUploadCV = true;
	}

	var cv_Unlocked = function()
	{
		 unLockedCV = true;
	}

	////Motivation
	this.mayUploadMotivation = false;
	this.unLockedMotivation = false;

	that = this;

	var checkPosition = function()
	{
		return[playerPositionx,playerPositiony];
	}


	var check_log = function()
	{
		return has_quest_log;
	}

	var set_log = function(bool){
		has_quest_log = true;
	}

	var setPosition = function(x,y)
	{
		playerPositionx = x;
		playerPositiony = y;
	}

	var init = function()
	{

	}

	var setName = function(name)
	{
		this.player_name = name
	}

	var get_name = function()
	{
		var my_val = false;
		if (player_name.length > 0)
		{
			my_val = true;
		}
		return my_val;
	}

	var get_motivation = function()
	{
		var my_val = false;
		if (has_motivation == 'True')
		{
			my_val = true;
		}

		return my_val;
	}

	var get_cv = function()
	{
		var my_val = false;
		if (has_cv == 'True') 
		{
			my_val = true;
		}

		return my_val;
	}


	return {
		getState: function() { init() },
		my_name: function()
		{
			return name;
		}, 
		check_cv: get_cv,
		check_name:get_name,
		check_motivation:get_motivation,
		checkPosition:checkPosition,
		setPosition:setPosition,
		checklog:check_log,
		setlog:set_log,
		checkUnlockedCV:check_UnlockedCV,
		checkMayUploadCV:check_MayUploadCV,
		cvUnlocked:cv_Unlocked,
		cvMayUpload:cv_MayUpload,

		update_key: function (value)
		{
			has_cv = value;
			return true;
		},
		update: function(key, value)
		{
			that[key] = value;
			return true;
		},

		name: function()
		{ 
			return player_name; 
		}
	}
}();

var quest_log;
var TILE_SIZE = 32; 
	

var crafty = function() {

    Crafty.init(990, 600);

    Crafty.sprite(TILE_SIZE, "/static/Sprite.png", {
		grass:[0,0],
		sand:[1,0],
		player:[2,0]
  
    });

    Crafty.sprite(TILE_SIZE, "/static/Sprite2.png", {
		 tiles:[0,0],
		 wall:[1,0],
		 machine:[2,0]
    });

	var dialog;
	
	function generateWorld(){
	
		for (i = 0; i < 31; i++)
		{
			for (j = 0; j < 21; j++)
			{
				if(i != 10  && j != 15)
				{
					Crafty.e("2D, Canvas, grass")
	                	.attr({ x: i * TILE_SIZE, y: j * TILE_SIZE, z:-1 });
	            }
	            else
	            {
					Crafty.e("2D, Canvas, sand")
	                	.attr({ x: i * TILE_SIZE, y: j * TILE_SIZE, z:-1 });
	            }    
			}
		}
		generateObjects();
	}


	function generateIndoors()
	{
		for (i = 0; i < 31; i++)
		{
			for (j = 0; j < 21; j++)
			{
				if(j < 2)
				{
					Crafty.e("2D, Canvas, wall,Collision,Wall")
					.collision(new Crafty.polygon([0,0],[32,0],[32,16],[0,16]))
                 	.attr({ x: i * TILE_SIZE, y: j * TILE_SIZE, z:-1 });

				}
				else
				{
					Crafty.e("2D, Canvas, tiles")
                 	.attr({ x: i * TILE_SIZE, y: j * TILE_SIZE, z:-1 });
             	}
    		}
		}
		generateIndoorObjects();
	}

	function generateIndoorObjects(){
		for (i = 0; i < 31; i++)
		{
			for (j = 0; j < 21; j++)
			{
				if(i  == 5 && j == 0)
				{
					var house  = Crafty.e("2D, Canvas,Image,Collision,Door")
					.collision(new Crafty.polygon([0,32],[32,32],[32,48],[0,48]));
					house.image("/static/Door.png");
					house.x = TILE_SIZE*i;
					house.y = TILE_SIZE*j;
				}


				if(i == 10  && j == 11)
				{

					var machine  = Crafty.e("2D, Canvas,Image,Collision,machine,Machine")
					.collision(new Crafty.polygon([0,0],[32,0],[32,32],[0,32]));
					machine.x = TILE_SIZE*i;
					machine.y = TILE_SIZE*j;
				}
    		}
		}
	}

	function generateObjects(){
	
		for (i = 0; i < 31; i++)
		{

			for (j = 0; j < 21; j++)
			{
				if(i  == 5 && j == 5)
				{
					poly1 = new Crafty.polygon([5,0],[110,0],[110,180],[5,180])
					//poly2 = new Crafty.polygon([5,0],[110,0],[110,250],[5,250])
					var house  = Crafty.e("2D, Canvas,Image,Collision,Building,house,SetSorting,Keyboard")
					.collision(poly1);
					
					house.image("/static/house.png");
					house.setScene("BuildingCV");
					house.x = TILE_SIZE*i;
					house.y = TILE_SIZE*j;
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

	Crafty.c('Building',{
		sceneString:"",

		setScene:function(str)
		{
			this.sceneString = str;
		},

		enterBuilding:function()
		{
			Crafty.scene(this.sceneString);
		}
	});
 
 
	Crafty.c('SetSorting',{
	
		sort:function(alpha,z)
		{
			this.alpha = alpha;
			this.z = z;
		},
	
	});


	Crafty.c('NPC',{
	
		isCollidingWithPlayer:false,
		dialogFunction:null,
		dialogText:"",
		quest:null,

		init: function()
		{
			this.onHit('player',function(hit)
			{
				this.isCollidingWithPlayer = true;
				if(!dialog.inConversation)
				{
					//show dialog
				}
			},
			function(noHit)
			{
					//drop dialog
				this.isCollidingWithPlayer = false;
			})
			
			.requires('Keyboard').bind('KeyDown', function ()
			{ 
				if (this.isDown('ENTER') && !Crafty.isPaused() && this.isCollidingWithPlayer)
				{
					if(!dialog.inConversation)dialog.startDialog(this);
					if(dialog.finished)	dialog.nextDialog();
				}
			})
	     },

	     setNpcData:function(quest,func){
	     	this.quest = quest;
	     	this.dialogFunction = func;
	     }
		
	});

	
	Crafty.c('AI',{

		walkToPlayer:function()
		{

		},

		update:function()
		{
			walkToPlayer();
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
		maxHeight:100,
		minHeight:0,

		init:function()
		{
			this.addComponent("2D, DOM,Color,Text");
			this.x = 0;
			this.y = 0;
			this.w = 990;  
			this.h = 0;   
			this.color("#FFFFFF");
			this.textColor('#FF0000');
			this.bind('EnterFrame', function() {

				if(this.hasStarted && !this.finished && this.checkDialog())
				{
					if(this.DialogText.length != this.DataText.length)
					{
						this.DialogText += this.DataText[this.TextIndex];
						this.text('<div style="margin-top:12px;">' + this.DialogText  + '<div style="margin-top:50px;">'  +"Enter to continue");
						this.TextIndex++;

					}
					else this.finished = true;
				}
			})
		},

		checkDialog:function(){
			if(this.dialogIndex == this.data.length)
			{
				this.closeDialog();
				return false;
			}

			return true; 
		},

		nextDialog:function(){
			if(!Crafty.isPaused()) this.dialogIndex += 1;
			
			this.DataText = this.data[this.dialogIndex]; 
			
			if(craftyTriggers(this.DataText,this.npc)[0])
			{
				if(craftyTriggers(this.DataText,this.npc)[1])
				{
					this.nextDialog();
				}
				return true;
			}


			/*if(this.DataText == "CONTACT")
			{ 
				//$("#container").show();
				//$("#contact").show();
				//$(".form").show();
				//document.getElementById("id_name").focus();
				//Crafty.pause();
				return true;
			}

			if(this.DataText == "UPLOAD")
			{
				$("#container").show();
				$(".form2").show();
				Crafty.pause();
				return true;
			}

			if(this.DataText == "MOTIVATION")
			{
				$("#container").show();
				$(".Choice").show();
				Crafty.pause();
				return true;
			}*/


			if(this.DataText == "Bob: Welcome to the vacancy of ")
			{
				this.DataText += "{{game.vacancy}},"+ window.state.name() + "!";
			}  

			this.finished = false;
			this.DialogText = "";
			this.text("");
			this.TextIndex = 0;
		},
	
		closeDialog:function()
		{
			this.DialogText = "";
			this.text("");
			this.TextIndex = 0;
			this.hasStarted = false;
			this.finished = false;
			this.inConversation = false;
			this.dialogIndex = 0;
			this.h =  this.minHeight;
		},
		
		startDialog:function(npc)
		{
			this.npc = npc;
			this.data = npc.dialogFunction(state);
			this.DataText = this.data[this.dialogIndex];
			this.hasStarted = true;
			this.h = this.maxHeight;
			this.inConversation = true;
		}
	}); 


		Crafty.c('update',{
			count:0,

			init:function(){
				this.bind("EnterFrame",function(){
					this.count++;
					if(this.count > 60) Crafty.scene("BuildingCV");
				 });
				this.addComponent("2D, DOM,Color,Text,Mouse");
				this.textColor('#000');
				this.w = 500;
				this.h = 50;
				this.x = 350;
				this.y = 300;
				this.text('<div style="margin-top:12px;">' + "YOU WIN");
				state.cvUnlocked();

			}
		})   


	Crafty.scene("loading", function () 
	{
        //load takes an array of assets and a callback when complete
        Crafty.load(["/static/Sprite.png","/static/house.png","/static/Sprite2.png","/static/Door.png"], function ()
        {
            Crafty.scene("main"); //when everything is loaded, run the main scene
        });
    });

    //automatically play the loading scene
    Crafty.scene("loading");

    Crafty.scene("main", function ()
    {

		generateWorld();

		dialog = Crafty.e("Dialog")
			.attr({ x: 0, y: 500, z: 1});

		if(!state.checklog())
		{

			info = Crafty.e("Infolog,Persist");

			quest_log = Crafty.e("Questlog,Persist")
			.attr({ x: -150, y: 100, z: 1});

			quest1 = Crafty.e("Quest,Persist");
			quest2 = Crafty.e("Quest,Persist");
			quest3 = Crafty.e("Quest,Persist");

			quest2.addQuestInfo("Cv","Need to upload your cv",state.check_cv,state.cvMayUpload);
			quest3.addQuestInfo("Motivation","Need to upload your motivationLetter",state.check_motivation,null);
			state.setlog(true);
		}

		player1 = Crafty.e("2D,  Canvas, player,Player,RightControls,Collision,Keyboard,Respawn,StatePosition")
			.rightControls(2)
			.Player();
		
		var player2 = Crafty.e("2D,  Canvas, player,Collision,npc,NPC")
			.attr({ x: 400, y: 364, z: 1})
			.setNpcData(quest2,getDialogData1);



		/*var player3 = Crafty.e("2D,  Canvas, player,Collision,npc,NPC")
			.attr({ x: 700, y: 300, z: 1})
			.setNpcData(quest3,getDialogData2);*/
			//.setQuest(quest3)
			//.dialogFuction = getDialogData2;



			//.quest = quest2;
    });

	Crafty.scene("Game",function(){
		player1 = Crafty.e("2D,update");
	});
	
	Crafty.scene("BuildingCV", function(){
	
		generateIndoors();

		if(state.checkUnlockedCV() && !state.check_cv()){
			craftyTriggers(UPLOAD,null);
		}

		var player1 = Crafty.e("2D,  Canvas, player,Player,RightControls,Collision,Keyboard")
			.attr({ x: 80, y: 80, z: 1})
			.rightControls(2)
			.Player();
	});

    return {
    	"crafty": Crafty,
    	"init_game": Crafty.init(900,600)
    }
};
