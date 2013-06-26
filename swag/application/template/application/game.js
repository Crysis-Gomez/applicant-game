var quest_log;
var TILE_SIZE = 32;
var HOUSE_WIDTH = 20;
var HOUSE_HEIGHT = 10;
var OFFSET = 120;
var SCREEN_WIDTH = 900;
var SCREEN_HEIGHT = 600;
var dialog; 
	
var crafty = function() {

    Crafty.init(SCREEN_WIDTH, SCREEN_HEIGHT);

    Crafty.sprite(TILE_SIZE, "/static/Sprite.png",
    {
		grass:[0,0],
		sand:[1,0],
		mark:[2,0]
    });

     Crafty.sprite(TILE_SIZE, "/static/spriteSheet.png",
    {
		player:[6,0],
		npc1:[3,0],
		npc2:[9,0],
		npc3:[0,4], npc4:[3,4],
		master:[9,4],
		boss:[6,6]
    });

    Crafty.sprite(TILE_SIZE, "/static/Sprite2.png",
    {
		 tiles:[0,0],
		 wall:[1,0],
		 machine:[2,0],
		 door:[5,0]
    });

	
	var houses;

	
	function generateWorld()
	{
		generateObjects();
	}


	function createHouse()
	{
		currentIndoor = new Array;
		if(typeof window.indoor[0] == "string")
		{
			indoorString = window.indoor[0];
			indoorString = indoorString.replace(/\r?\n|\r/g,'');
		}
	
		for (var x = 0; x < HOUSE_WIDTH; x++)
      	{
            currentIndoor[x] = new Array();
      	}
      	index = 0;
        for (var x = 0; x < HOUSE_HEIGHT; x++)
        {
          for (var y = 0; y < HOUSE_WIDTH; y++)
          {
              currentIndoor[x][y] = indoorString[index];
              index++;
          }
       }

       return currentIndoor;
	}


	function generateIndoors(game)
	{
		indoor = createHouse();
		for (x = 0; x < HOUSE_WIDTH; x++)
		{
			for (y = 0; y < HOUSE_HEIGHT; y++)
			{
				var count = indoor[y][x];

				switch(count)
				{
					case "0":
							Crafty.e("2D, Canvas, tiles")
	                  		.attr({ x: x * TILE_SIZE +OFFSET, y: y * TILE_SIZE, z:-1 });
					 break;

					 case "1":
							Crafty.e("2D, Canvas, wall,Collision,Wall,Solid")
					 		.collision(new Crafty.polygon([0,0],[32,0],[32,16],[0,16]))
	                  		.attr({ x: x * TILE_SIZE+OFFSET, y: y * TILE_SIZE, z:-1 });
					 break;


					 case "2":
					 		Crafty.e("2D, Canvas,Image,Collision,Door,door,Solid")
							.collision(new Crafty.polygon([0,0],[32,0],[32,16],[0,16]))
							.attr({ x: x * TILE_SIZE+OFFSET, y: y * TILE_SIZE, z:-1 });
					 break;


					 case "3":
					 		Crafty.e("2D, Canvas,Image,Collision,machine,Machine,Solid")
							.collision(new Crafty.polygon([0,0],[32,0],[32,32],[0,32]))
							.attr({ x: x * TILE_SIZE+OFFSET, y: y * TILE_SIZE, z:-1 })
							.startGame = game;
					 break;

					 case "4":
						  	Crafty.e("2D, Canvas, tiles")
	                  		.attr({ x: x * TILE_SIZE+OFFSET, y: y * TILE_SIZE, z:-1 });

					 		Crafty.e("2D,  Canvas, player,Player,RightControls,Collision,Keyboard")
							.attr({ x: TILE_SIZE*x+OFFSET, y: TILE_SIZE*y, z: 1})
							.rightControls(2)
							.Player();
					 break;
				}
    		}
		}
		Crafty.background('rgb(0, 0, 0)');
	}

	function generateObjects(){
		houses = new Array();
		for (i = 0; i < 31; i++)
		{
			for (j = 0; j < 21; j++)
			{
				if(i  == 1 && j == 0)
				{
					var house  = Crafty.e("2D, Canvas,Image,Collision,Building,house,SetSorting,Keyboard,Solid")
					house.setImage("/static/house2.png");
					house.setScene("BuildingCV",state.checkUnlockedCVQuest,state.check_cv());
					house.x = TILE_SIZE*i;
					house.y = TILE_SIZE*j;
					house.z = -1;
					houses.push(house);
				}

				if(i  == 15 && j == 0)
				{
					var house  = Crafty.e("2D, Canvas,Image,Collision,Building,house,SetSorting,Keyboard,Solid");
					house.setImage("/static/house3.png");
					house.setScene("BuildingLink",state.checkUnlockedLinkQuest,state.check_link());
					house.x = TILE_SIZE*i;
					house.y = TILE_SIZE*j;
					house.z = -1;
					houses.push(house);
				}

				if(i  == 15 && j == 10)
				{
					var house  = Crafty.e("2D, Canvas,Image,Collision,Building,house,SetSorting,Keyboard,Solid")
					house.setImage("/static/house.png");
					house.setScene("BuildingMotivation",state.checkUnlockedMotivationQuest,state.check_motivation());
					house.x = TILE_SIZE*i;
					house.y = TILE_SIZE*j;
					house.z = -1;
					houses.push(house);
				}

				if(i  == 24 && j == 13)
				{
					var house  = Crafty.e("2D, Canvas,Image,Collision,Building,house,SetSorting,Keyboard,Solid");
					house.setImage("/static/house4.png");
					house.setScene("Hometown",null,null);
					house.x = TILE_SIZE*i;
					house.y = TILE_SIZE*j;
					house.z = -1;

				}

				if(i  == 1 && j == 10)
				{
					var house  = Crafty.e("2D, Canvas,Image,Collision,Building,house,SetSorting,Keyboard,Solid");
					house.setImage("/static/house5.png");
					house.setScene("BuildingSkills",state.checkUnlockedSkillsQuest,state.check_skills());
					house.x = TILE_SIZE*i;
					house.y = TILE_SIZE*j;
					house.z = -1;
					houses.push(house);
				}

			}
		}
	}



	Crafty.c('setCollision',
	{
		setImage:function(str)
		{

			im = this.image(str);
			poly1 = new Crafty.polygon([0+this.offsetX,0+this.offsetY],[im._w-this.offsetX,0+this.offsetY],[im._w-this.offsetX,im._h-this.offsetY],[0+this.offsetX,im._h-this.offsetY]);
			this.collision(poly1);
			im._z = -1;
		},

	});

	Crafty.c('Building',
	{
		sceneString:"",
		check:null,
		questDone:null,
		offsetX:10,
		offsetY:10,

		setScene:function(str,check,quest)
		{
			this.sceneString = str;
			this.check = check;
			this.questDone = quest;
		},

		setImage:function(str)
		{

			im = this.image(str);
			poly1 = new Crafty.polygon([0+this.offsetX,0+this.offsetY],[im._w-this.offsetX,0+this.offsetY],[im._w-this.offsetX,im._h-this.offsetY],[0+this.offsetX,im._h-this.offsetY]);
			this.collision(poly1);
			im._z = -1;
		},

		enterBuilding:function()
		{

			if(this.check === null)
			{
				Crafty.scene(this.sceneString);
				return;
			}

			if(this.check())
			{
				Crafty.scene(this.sceneString);
			}
		}
	});
 
 
	Crafty.c('SetSorting',
	{
		sort:function(alpha,z)
		{
			this.alpha = alpha;
			this.z = z;
		},
	});

	Crafty.c('NPC',
	{
	
		isCollidingWithPlayer:false,
		dialogFunction:null,
		dialogText:"",
		quest:null,
		player:null,
		mark:null,

		init: function()
		{
			
	    },

	     startDialog:function()
	     {
	     	if(!dialog.inConversation)
			{
				dialog.startDialog(this);
				this.player.mayMove = false;
				this.player.stop();
			}
			if(dialog.finished)
			{
				dialog.nextDialog();
			}	
	     },

	     setNpcData:function(quest,func)
	     {
	     	this.quest = quest;
	     	this.dialogFunction = func;
	     	if(this.quest === null)return;
	     	this.quest.npc = this;
	     },

	     putMark:function()
	     {
	     	if(this.quest.checkGotQuest())return;
	     	this.mark = Crafty.e("2D, Canvas,mark,Mark");
	     	this.mark.x = this.x ;
	     	this.mark.y = this.y-25;
	     	this.attach(this.mark);
	     },

	     removeMark:function()
	     {
	     	this.mark.destroy();
	     	state.update_unlockQuest(this.quest.id);
	     }
	});


	Crafty.c('Mark',
	{
		init:function()
		{
			this.requires("SpriteAnimation")
			.animate("mark",2,0,5);
			this.animate("mark", 30, -1);
		},
	})


	Crafty.c('BOSS',
	{ 
		locked:true,

		init:function()
		{
			this.requires("Canvas, 2D");
			this.bind("Draw", function(obj) 
			{
            	this.drawLines(obj.ctx);
       		});
		},

		drawLines:function()
		{
			var canvas = document.getElementById('mycanvas');
			
			canvas.width = Crafty.viewport.width;
			canvas.height = Crafty.viewport.height;
			canvas.style.position = 'absolute';
			canvas.style.left = "0px";
			canvas.style.top = "0px";
			Crafty.stage.elem.appendChild(canvas);
			$("#mycanvas").show();
			ctx = canvas.getContext('2d');
			var count = 0;
			
			ctx.strokeStyle = "rgb(0,0,200)";
			for (var i = 0; i < houses.length; i++)
			{
				if(houses[i].questDone == false)
				{
					ctx.beginPath();
		        	ctx.moveTo(this.x+this.w*0.5, this.y+this.h*0.5);
		        	ctx.lineTo(houses[i].x+houses[i]._w*0.5, houses[i].y+houses[i]._h*0.5);
		        	ctx.closePath();
		        	ctx.stroke();
		        }
		        else
		        {
		       		count++;
		        }
			};

			if(count == houses.length && this.locked)
			{
				this.locked = false;
				state.update('boss_unlocked','True')
				unlockBoss();
			}
		},

		update:function()
		{

		}

	});

	Crafty.c('AI',
	{
		tar:null,
		posX:null,
		posY:null,
		speed:2,
		hasTalked:false,
		TO_TARGET:1,
		TO_POSITION:2,
		TO_LEAD:3,
		TYPE:0,

		init:function()
		{
			
			  this.requires("SpriteAnimation")
			 .animate("walk_left",3,1,5)
			 .animate("walk_right",3,2,5)
			 .animate("walk_up",3,3,5)
			 .animate("walk_down",3,0,5)

			 this.bind('EnterFrame',function()
			 {
			 	switch(this.TYPE)
			 	{
			 		case this.TO_TARGET:
			 			this.walkToTarget();
			 		break;

			 		case this.TO_POSITION:
			 			this.walkToPosition();
			 		break;


			 		case this.TO_LEAD:
			 			this.walkToLead();
			 		break

			 	}
				  
			 });

		},

		reset:function()
		{
			this.tar = null;
			this.posX = null;
			this.posY = null;

		},

		setTarget:function(target)
		{
			this.reset();
			this.tar = target;
			this.TYPE = this.TO_TARGET;
		},

		setPosition:function(x,y)
		{	
			this.reset();
			this.posX = x;
			this.posY = y;
			this.TYPE = this.TO_POSITION;
		},

		setLead:function(target,x,y)
		{
			this.reset();
			this.tar = target;
			this.posX = x;
			this.posY = y;
			this.TYPE = this.TO_LEAD;
		},


		walkToPosition:function()
		{
			distance = Math.pow(this.posX - this.x,2) + Math.pow(this.posY - this.y,2);
			distance = Math.sqrt(distance);
			this.walk(distance,this.posX,this.posY);

		},


		walkToLead:function()
		{

			distance = Math.pow(this.posX - this.x,2) + Math.pow(this.posY - this.y,2);
			distance = Math.sqrt(distance);
			
			distance2 = Math.pow(this.tar.x - this.x,2) + Math.pow(this.tar.y - this.y,2);
			distance2 = Math.sqrt(distance2);

			if(distance2  < 100)
			{
				this.walk(distance,this.posX,this.posY);
				if(this.tar.x > 900)
				{
					jQuery.post("/intro/{{game.uid}}/"); 
					Crafty.scene("main");
				}	
			}else this.stop();


		},

		walkToTarget:function()
		{
			
			distance = Math.pow(this.tar.x - this.x,2) + Math.pow(this.tar.y - this.y,2);
			distance = Math.sqrt(distance);
			this.walk(distance,this.tar.x,this.tar.y);
		
			if(distance <= 45)
			{
				if(!dialog.inConversation && !this.hasTalked)
				{
					this.player = this.tar;
					this.player.npc = this;
					this.startDialog();
					this.hasTalked = true;
				}
				this.stop();
			} 
		},

		walk:function(distance,x,y)
		{

			if(distance  > 45)
			{
				velocityX = (x - this.x);
				velocityY = (y - this.y);

				tempVelX = Math.abs(velocityX);
				tempVelY = Math.abs(velocityY);

				if(tempVelX > tempVelY)
				{
					if(velocityX  > 0)
					{
						if (!this.isPlaying("walk_right"))
						this.stop().animate("walk_right", 10, -1);
					}
					else
					{
						if (!this.isPlaying("walk_left"))
						this.stop().animate("walk_left", 10, -1);
					}
				}
				else
				{

					if(velocityY  > 0)
					{
						if (!this.isPlaying("walk_down"))
						this.stop().animate("walk_down", 10, -1);

					}
					else
					{
						if (!this.isPlaying("walk_up"))
						this.stop().animate("walk_up", 10, -1);

					}

				}
				
				velocityX = velocityX / distance;
				velocityY = velocityY / distance;
				velocityX = velocityX * this.speed;
				velocityY = velocityY * this.speed;
				this.x += velocityX;
				this.y += velocityY; 
			}

		},


	});

	Crafty.c("Dialog",
	{
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
			this.addComponent("2D,Color2");
			this.x = 0;
			this.y = 0;
			this.w = 900;  
			this.h = 0;
			this.color('#fff');
		
			this.bind('EnterFrame', function()
			{
				if(this.hasStarted && !this.finished && this.checkDialog())
				{
					if(this.DialogText.length != this.DataText.length)
					{
						this.DialogText += this.DataText[this.TextIndex];
						if(this.DialogText.length == this.DataText.length)this.text('<div style="margin-top:12px;">' + this.DialogText  + '<div style="margin-top:10px;">'  +"Enter to continue");
						else this.text('<div style="margin-top:12px;">' + this.DialogText  + '<div style="margin-top:10px;">');
						this.TextIndex++;
					}
					else this.finished = true;
				}
			})
		},

		checkDialog:function()
		{
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
			trigger = craftyTriggers(this.DataText,this.npc); 
			
			if(trigger[0])
			{
				if(trigger[1])
				{
					this.nextDialog();
				}
				return true;
			}

			if(this.DataText == "Sandra: Welcome to the vacancy of ")
			{
				this.DataText += "{{game.vacancy}},"+ window.state.name() + "!";
				Crafty.trigger("getQuest");
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
			this.npc.player.mayMove = true;
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

	Crafty.scene("loading", function () 
	{
        //load takes an array of assets and a callback when complete
        Crafty.load(["/static/sign1.png", "/static/goal.png", "/static/controls.png","/static/controls2.png", "/static/spriteSheet.png" ,"/static/Sprite.png","/static/house.png","/static/Sprite2.png","/static/house2.png","/static/house3.png","/static/house4.png","/static/house5.png","/static/castle.png","/static/background.png","/static/background2.png","/static/fence.png"], function ()
        {
       		 // if('{{game.get_Intro}}' == 'False')Crafty.scene("Intro"); //when everything is loaded, run the main scene
          //    else Crafty.scene("main");
         	Crafty.scene("main");

             //$("#myModal").modal('show');
        });
    });

    //automatically play the loading scene
    Crafty.scene("loading");

    Crafty.scene("main", function ()
    {
    	Crafty.background("url('/static/background.png')");
		generateWorld();

		if(!state.checklog())
		{
			
			dialog = Crafty.e("Dialog, 2D, DOM,Text")
			.attr({x:0, y:500, w:900, h:0}).css({"font": "10pt Arial", "color": "#000", "text-align": "left","border-radius": "20px"});
			dialog.alpha = 0.8;

			if (typeof quest_log  === 'undefined') 
			{
				info = Crafty.e("Infolog,Persist");
				quest_log = Crafty.e("Questlog,Persist")
				.attr({ x: -150, y: 100, z: 1});
				quest1 = Crafty.e("Quest,Persist");
				quest2 = Crafty.e("Quest,Persist");
				quest3 = Crafty.e("Quest,Persist");
				quest4 = Crafty.e("Quest,Persist");

				quest1.addQuestInfo(1,"Cv","Need to upload your cv",
					state.check_cv,
					state.cvUnlocked,
					state.checkUnlockedCVQuest);

				quest2.addQuestInfo(2,"Motivation","Need to upload your motivationLetter",
					state.check_motivation,
					state.motivationUnlocked,
					state.checkUnlockedMotivationQuest);
				quest3.addQuestInfo(3,"Links","Need to upload your links",
					state.check_link,
					state.linkUnlocked,
					state.checkUnlockedLinkQuest);
				quest4.addQuestInfo(4,"Skills","Need to upload your Skills",
					state.check_skills,
					state.skillsUnlocked,
					state.checkUnlockedSkillsQuest);




				if(state.checkUnlockedCVQuest())
				{
					quest_log.addQuest(quest1,false);
				}

				if(state.checkUnlockedMotivationQuest())
				{
					quest_log.addQuest(quest2,false);
				}

				if(state.checkUnlockedLinkQuest())
				{
					quest_log.addQuest(quest3,false);
				}

				if(state.checkUnlockedSkillsQuest())
				{
					quest_log.addQuest(quest4,false);
				}
			}
		}

		var house  = Crafty.e("2D, Canvas,Image,Collision,Building,house,SetSorting,Keyboard,BOSS");
		house.setImage("/static/castle.png");
		house.setScene("Castle",state.check_boss_unlocked,null);
		house.x = 620;
		house.y = 0;


		var canvas = document.getElementById('mycanvas');
		var Mainplayer = Crafty.e("2D,  Canvas, player,Player,RightControls,Collision,Keyboard,Respawn,StatePosition")
			.attr({ x: 100, y: 300, z: 1})
			.rightControls(2);
		
		Mainplayer.Player();
		Mainplayer.respawn();

		var player2 = Crafty.e("2D,  Canvas, player,Collision,npc1,NPC,Solid");
			player2.attr({ x: 150, y: 100, z: 1});
			player2.setNpcData(quest1,getDialogData1);
			player2.putMark();


		var player3 = Crafty.e("2D,  Canvas, player,Collision,npc2,NPC,Solid");
			player3.attr({ x: 400, y: 450, z: 1});
			player3.setNpcData(quest2,getDialogData2);
			player3.bind("getQuest",player3.putMark);

		var player4 = Crafty.e("2D,  Canvas, player,Collision,npc3,NPC,Solid");
			player4.attr({ x: 400, y: 100, z: 1})
			player4.setNpcData(quest3,getDialogData3);
			player4.bind("getQuest",player4.putMark);

		var player5 = Crafty.e("2D,  Canvas, player,Collision,npc4,NPC,Solid");
			player5.attr({ x: 150, y: 450, z: 1});
			player5.setNpcData(quest4,getDialogData4);
			player5.bind("getQuest",player5.putMark);

		if(state.checkUnlockedCVQuest())
		{
			Crafty.trigger("getQuest");
		}		
    });

	Crafty.scene("Game2",function()
	{
		player1 = Crafty.e("2D,update")
		.startGame("BuildingMotivation");
	});

	Crafty.scene("Intro",function()
	{
		Crafty.background("url('/static/background2.png')");
		dialog = Crafty.e("Dialog, 2D, DOM,Text")
		.attr({x:0, y:500, w:900, h:0}).css({"font": "10pt Arial", "color": "#000", "text-align": "left","border-radius": "20px"});
			dialog.alpha = 0.8;

	    var	player1 = Crafty.e("2D,  Canvas, player,Player,RightControls,Collision,Keyboard,Respawn,StatePosition");
		player1.rightControls(2)
		player1.attr({ x: 150, y: 280, z: 1});
		player1.Player();

		var player2 = Crafty.e("2D,  Canvas, player,Collision,npc1,NPC,Solid,AI");
			player2.attr({ x: 650, y: 300, z: 1});
			player2.setNpcData(null,getDialogIntro);
			player2.setTarget(player1);
			player2.bind("LEAD",function()
			{
				player2.setLead(player1,1000,300);
				
			});



		var fence  = Crafty.e("2D, Canvas,Image,Collision,setCollision,Solid");
		fence.setImage("/static/fence.png");
		fence.attr({ x: 0, y: 320, z: 1});

		var fence  = Crafty.e("2D, Canvas,Image,Collision,setCollision,Solid");
		fence.setImage("/static/fence.png");
		fence.attr({ x: 0, y: 240, z: 0});


	});


	Crafty.scene("BuildingSkills", function()
	{
		generateIndoors("Test");
		if(state.checkMayUploadSkills() && !state.check_skills())
		{
			craftyTriggers(SKILL,null);
			Crafty.pause(true);
		}

		$("#mycanvas").hide();
	});


	Crafty.scene("BuildingLink", function()
	{
		generateIndoors("TestGame");
		if(state.checkMayUploadLink() && !state.check_link())
		{
			craftyTriggers(LINK,null);
			Crafty.pause(true);
		}

		$("#mycanvas").hide();

	});

	Crafty.scene("BuildingMotivation", function()
	{
		generateIndoors("RotateGame");
		if(state.checkMayUploadMotivation() && !state.check_motivation())
		{
			craftyTriggers(MOTIVATION,null);
			Crafty.pause(true);

		}

		$("#mycanvas").hide();
	});

	Crafty.scene("BuildingCV", function()
	{
		generateIndoors("BlockGame");
		if(state.checkMayUploadCV() && !state.check_cv())
		{
			craftyTriggers(UPLOAD,null);
			Crafty.pause(true);
		}
		$("#mycanvas").hide();
	});


	Crafty.scene("Hometown", function()
	{

		profile = Crafty.e("Profile");
		profile.bind("SHOW",function()
		{
			this.showProfile();

		});

		profile.bind("HIDE",function()
		{
			this.hideProfile();
			
		});
		
		dialog = Crafty.e("Dialog, 2D, DOM,Text")
		.attr({x:0, y:500, w:900, h:0}).css({"font": "10pt Arial", "color": "#000", "text-align": "left","border-radius": "20px"});
		dialog.alpha = 0.8;

		var player2 = Crafty.e("2D,  Canvas, player,Collision,master,NPC")
		.attr({ x: 400, y: 244, z: 1})
		.setNpcData(null,getDialogData5);
		
		generateIndoors("Hometown");
		$("#mycanvas").hide();

	});


	Crafty.scene("Castle", function()
	{
		dialog = Crafty.e("Dialog, 2D, DOM,Text")
		.attr({x:0, y:500, w:900, h:0}).css({"font": "10pt Arial", "color": "#000", "text-align": "left","border-radius": "20px"});
		dialog.alpha = 0.8;

		var player2 = Crafty.e("2D,  Canvas, boss,Collision,npc,NPC")
		.attr({ x: 200, y: 244, z: 1})
		.setNpcData(null,getDialogData6);


		generateIndoors("Castle");
		$("#mycanvas").hide();
	});


	Crafty.c("Profiletext",
	{
		str:"",

		init:function()
		{
			this.addComponent("2D,DOM,Text");
		},

		getText:function(str)
		{
			this.str = str;
		},

		showText:function()
		{
			this.text('<div style="margin-top:12px;">' + this.str + '<div style="margin-left:400px;">');
		}
	});

	Crafty.c('PopUp',
	{
		isShown:false,
		isHouse:false,
		isNpc:false,
		isExit:false,
		isWarp:false,

		init:function()
		{
			this.addComponent("2D,DOM,Text,Color");
			this.color('#fff');
			this.css({"border-radius": "5px"});
			//this.text('<div  style="margin-top:20px; text-align:center;">'+"Enter");
		},

		showTalk:function()
		{
			this.w = 80;  
			this.h = 40;
			this.text("Enter");
			this.text('<div  style="margin-top:20px; text-align:center;">'+"Talk");
			this.isShown = true;
			this.isHouse = false;
			this.isNpc = true;
			this.isWarp = false;
			this.isExit = false;
		},

		showEnter:function()
		{
			this.w = 80;  
			this.h = 40;
			this.text("Enter");
			this.text('<div  style="margin-top:20px; text-align:center;">'+"Enter");
			this.isShown = true;
			this.isHouse = true;
			this.isNpc = false;
			this.isWarp = false;
			this.isExit = false;
		},


		showWarp:function()
		{
			this.w = 80;  
			this.h = 40;
			this.text("Enter");
			this.text('<div  style="margin-top:20px; text-align:center;">'+"Warp");
			this.isShown = true;
			
			this.isHouse = false;
			this.isNpc = false;
			this.isWarp = true;
			this.isExit = false;
		},



		showExit:function()
		{
			this.w = 80;  
			this.h = 40;
			this.text("Enter");
			this.text('<div  style="margin-top:20px; text-align:center;">'+"Exit");
			this.isShown = true;
			
			this.isHouse = false;
			this.isNpc = false;
			this.isWarp = false;
			this.isExit = true;
		},


		hide:function()
		{
			this.w = 0;  
			this.h = 0;
			this.text("");
			this.isShown = false;
			this.isHouse = false;
			this.isNpc = false;
		}
	});

	Crafty.c("Profile",
	{
		attributePositionY:0,
		totalAttributes:Array,

		init:function()
		{
			this.addComponent("2D, DOM,Color");
			this.z = 1;
			this.w = 300;  
			this.h = 400;
			this.x = SCREEN_WIDTH *0.5-this.w*0.5;
			this.y = SCREEN_HEIGHT *0.5-this.h *0.5;
			this.color('#fff');
			this.css({"border-radius": "20px"})
			this.totalAttributes = new Array();
			this.getProfile();
			this.hideProfile();
		},

		addAttribute:function(str,bool)
		{
			e = Crafty.e("Profiletext");//.attr({x: 50, y: 50, w: 100, h: 20, z: 2, alpha: .5}) ;
			e.alpha = 0;
			//if(bool)e.addComponent("Mouse").bind("Click",function(e){console.log("hit");}).areaMap([0,0], [200,0], [200,50], [0,50]);
			e.getText(str);
			e.x = this.x;
			e.y = this.y+this.attributePositionY;
			e.z = 1;
			this.attributePositionY +=25;
			this.totalAttributes.push(e);
		},

		hideProfile:function()
		{
			for (var i = 0; i < this.totalAttributes.length; i++)
			{
				this.totalAttributes[i].text(""); 
			};

			this.h = 0;

		},

		showProfile:function()
		{
			for (var i = 0; i < this.totalAttributes.length; i++)
			{
				this.totalAttributes[i].showText(); 
			};
			this.h = 400;
		},

		getProfile:function()
		{

			$.ajax({
			  url: "/getprofile/{{game.uid}}/",
			  dataType: 'jsonp',
			  success: function(data){
			  }
			});


			this.addAttribute("Your Profile")
			
			this.addAttribute("Name  :"+state.my_name());	
			this.addAttribute("Email :"+state.my_email());
			this.addAttribute("Current vacancy :"+'{{game.vacancy}}');
			if(state.checkUnlockedCVQuest())
			{
				this.addAttribute("Uploaded CV:"+ state.check_cv());
			}

			if(state.checkUnlockedMotivationQuest())
			{
				this.addAttribute("Uploaded Motivation:"+ state.check_motivation());
			}

			if(state.checkUnlockedLinkQuest())
			{
				this.addAttribute("Uploaded Links:"+ state.check_link());
			}

			if(state.checkUnlockedSkillsQuest())
			{
				this.addAttribute("Uploaded Skills:"+ state.check_skills());
			}	

			for (var key in state.get_skills())
			{
				this.addAttribute(key+" score:"+state.get_skills()[key]);
			}

			for (var key in state.get_links())
			{
				this.addAttribute(state.get_links()[key],true);
			}
			
		}
	});

    return {
    	"crafty": Crafty,
    	"init_game": Crafty.init(SCREEN_WIDTH,SCREEN_HEIGHT)
    }
};
