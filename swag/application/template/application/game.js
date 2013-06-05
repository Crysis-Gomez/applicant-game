var quest_log;
var TILE_SIZE = 32;
var HOUSE_WIDTH = 20;
var HOUSE_HEIGHT = 10;
var OFFSET = 120;
var SCREEN_WIDTH = 900;
var SCREEN_HEIGTH = 600; 
	
var crafty = function() {

    Crafty.init(SCREEN_WIDTH, SCREEN_HEIGTH);

    Crafty.sprite(TILE_SIZE, "/static/Sprite.png",
    {
		grass:[0,0],
		sand:[1,0],
		player:[2,0]
  
    });

    Crafty.sprite(TILE_SIZE, "/static/Sprite2.png",
    {
		 tiles:[0,0],
		 wall:[1,0],
		 machine:[2,0],
		 door:[5,0]
    });

	var dialog;
	var houses;

	
	function generateWorld()
	{
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
							Crafty.e("2D, Canvas, wall,Collision,Wall")
					 		.collision(new Crafty.polygon([0,0],[32,0],[32,16],[0,16]))
	                  		.attr({ x: x * TILE_SIZE+OFFSET, y: y * TILE_SIZE, z:-1 });
					 break;


					 case "2":
					 		Crafty.e("2D, Canvas,Image,Collision,Door,door")
							.collision(new Crafty.polygon([0,0],[32,0],[32,16],[0,16]))
							.attr({ x: x * TILE_SIZE+OFFSET, y: y * TILE_SIZE, z:-1 });
					 break;


					 case "3":
					 		Crafty.e("2D, Canvas,Image,Collision,machine,Machine")
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
					var house  = Crafty.e("2D, Canvas,Image,Collision,Building,house,SetSorting,Keyboard")
					house.setImage("/static/house2.png");
					house.setScene("BuildingCV",state.checkUnlockedCVQuest,state.check_cv());
					house.x = TILE_SIZE*i;
					house.y = TILE_SIZE*j;
					houses.push(house);
				}

				if(i  == 15 && j == 0)
				{
					var house  = Crafty.e("2D, Canvas,Image,Collision,Building,house,SetSorting,Keyboard");
					house.setImage("/static/house3.png");
					house.setScene("BuildingLink",state.checkUnlockedLinkQuest,state.check_link());
					house.x = TILE_SIZE*i;
					house.y = TILE_SIZE*j;
					houses.push(house);
				}


				if(i  == 15 && j == 10)
				{
					var house  = Crafty.e("2D, Canvas,Image,Collision,Building,house,SetSorting,Keyboard")
					house.setImage("/static/house.png");
					house.setScene("BuildingMotivation",state.checkUnlockedMotivationQuest,state.check_motivation());
					house.x = TILE_SIZE*i;
					house.y = TILE_SIZE*j;
					houses.push(house);
				}

				if(i  == 24 && j == 13)
				{
					var house  = Crafty.e("2D, Canvas,Image,Collision,Building,house,SetSorting,Keyboard");
					house.setImage("/static/house4.png");
					house.setScene("Hometown",null,null);
					house.x = TILE_SIZE*i;
					house.y = TILE_SIZE*j;
				}



				if(i  == 1 && j == 10)
				{
					var house  = Crafty.e("2D, Canvas,Image,Collision,Building,house,SetSorting,Keyboard");
					house.setImage("/static/house5.png");
					house.setScene("BuildingSkills",state.checkUnlockedSkillsQuest,state.check_skills());
					house.x = TILE_SIZE*i;
					house.y = TILE_SIZE*j;
					houses.push(house);
				}

			}
		}
	}

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

		init: function()
		{
			this.onHit('player',function(hit)
			{
				this.isCollidingWithPlayer = true;
				this.player = hit[0].obj;
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
					if(!dialog.inConversation)
					{
						dialog.startDialog(this);
						this.player.mayMove = false;
					}
					if(dialog.finished)
					{
						dialog.nextDialog();
						

					}	
				}
			})
	     },

	     setNpcData:function(quest,func){
	     	this.quest = quest;
	     	this.dialogFunction = func;
	     }
		
	});


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

		walkToPlayer:function()
		{

		},

		update:function()
		{
			walkToPlayer();
		}
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
			this.color('#FFF')
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
        Crafty.load(["/static/Sprite.png","/static/house.png","/static/Sprite2.png","/static/house2.png","/static/house3.png","/static/house4.png","/static/house5.png"], function ()
        {
            Crafty.scene("main"); //when everything is loaded, run the main scene
            //Crafty.background('rgb(0, 0, 0)');
        });


    });

    //automatically play the loading scene
    Crafty.scene("loading");

    Crafty.scene("main", function ()
    {
		generateWorld();
	

		if(!state.checklog())
		{
			
			dialog = Crafty.e("Dialog, 2D, DOM,Text")
			.attr({x:0, y:500, w:900, h:0}).css({"font": "10pt Arial", "color": "#000", "text-align": "left"});

		
			if (typeof quest_log  === 'undefined') {

				
				info = Crafty.e("Infolog,Persist");
				quest_log = Crafty.e("Questlog,Persist")
				.attr({ x: -150, y: 100, z: 1});
				quest1 = Crafty.e("Quest,Persist");
				quest2 = Crafty.e("Quest,Persist");
				quest3 = Crafty.e("Quest,Persist");
				quest4 = Crafty.e("Quest,Persist");

				quest1.addQuestInfo(1,"Cv","Need to upload your cv",state.check_cv,state.cvUnlocked);
				quest2.addQuestInfo(2,"Motivation","Need to upload your motivationLetter",state.check_motivation,state.motivationUnlocked);
				quest3.addQuestInfo(3,"Links","Need to upload your links",state.check_link,state.linkUnlocked);
				quest4.addQuestInfo(4,"Skills","Need to upload your Skills",state.check_skills,state.skillsUnlocked);

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

		var house  = Crafty.e("2D, Canvas,Image,Collision,Building,house,SetSorting,Keyboard,BOSS").attr({ x: 620, y: -10, z: 1});
		house.setImage("/static/castle.png");
		house.setScene("Castle",state.check_boss_unlocked,null);

		var canvas = document.getElementById('mycanvas');
		player1 = Crafty.e("2D,  Canvas, player,Player,RightControls,Collision,Keyboard,Respawn,StatePosition")
			.rightControls(2)
			.Player();


		

		var player2 = Crafty.e("2D,  Canvas, player,Collision,npc,NPC")
			.attr({ x: 400, y: 364, z: 1})
			.setNpcData(quest1,getDialogData1);

		var player3 = Crafty.e("2D,  Canvas, player,Collision,npc,NPC")
			.attr({ x: 700, y: 300, z: 1})
			.setNpcData(quest2,getDialogData2);

		var player4 = Crafty.e("2D,  Canvas, player,Collision,npc,NPC")
			.attr({ x: 700, y: 200, z: 1})
			.setNpcData(quest3,getDialogData3);

		var player5 = Crafty.e("2D,  Canvas, player,Collision,npc,NPC")
			.attr({ x: 200, y: 500, z: 1})
			.setNpcData(quest4,getDialogData4);
    });

	Crafty.scene("Game2",function()
	{
		player1 = Crafty.e("2D,update")
		.startGame("BuildingMotivation");
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
		profile.bind("SHOW",function(){
			this.showProfile();

		});

		profile.bind("HIDE",function(){
			this.hideProfile();
			
		});
		
		dialog = Crafty.e("Dialog, 2D, DOM,Text")
		.attr({x:0, y:500, w:900, h:0}).css({"font": "10pt Arial", "color": "#000", "text-align": "left"});

		var player2 = Crafty.e("2D,  Canvas, player,Collision,npc,NPC")
		.attr({ x: 400, y: 244, z: 1})
		.setNpcData(null,getDialogData5);
		
		generateIndoors("Hometown");
		$("#mycanvas").hide();

	});


	Crafty.scene("Castle", function()
	{


		dialog = Crafty.e("Dialog, 2D, DOM,Text")
		.attr({x:0, y:500, w:900, h:0}).css({"font": "10pt Arial", "color": "#000", "text-align": "left"});

		var player2 = Crafty.e("2D,  Canvas, player,Collision,npc,NPC")
		.attr({ x: 400, y: 244, z: 1})
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


		getText:function(str){
			this.str = str;
		},

		showText:function()
		{
			this.text('<div style="margin-top:12px;">' + this.str + '<div style="margin-left:400px;">');
		}

	})

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
			this.y = SCREEN_HEIGTH *0.5-this.h *0.5;
			this.color("#eee");
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
				this.addAttribute("Uploaded Motivation:"+ state.check_cv());
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
    	"init_game": Crafty.init(SCREEN_WIDTH,SCREEN_HEIGTH)
    }
};
