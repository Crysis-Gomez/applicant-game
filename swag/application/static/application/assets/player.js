Crafty.c('Respawn',
{
	init:function()
	{
		this.x = state.checkPosition()[0];
		this.y = state.checkPosition()[1];
	}
})


Crafty.c('StatePosition',
{
	update:function()
	{
		state.setPosition(this.x,this.y);

	}
})

Crafty.c('Player',
{
	
	house:Object,
	npc:Object,
	collidedObject:Object,
	machine:Object,
	door:Object,
	dirX:0,
	dirY:0,
	count:0,
	mayStop:false,
	mayMove:true,

	init:function()
	{
		this.popUp = Crafty.e("PopUp");
		this.popUp.x = this.x+50;
		this.popUp.y = this.y-20;
		this.attach(this.popUp);

	},

	convert:function(obj)
	{
		if(typeof this.house === obj)return;
		if(typeof this.house.sort === 'undefined')this.house = obj;
		
		this.house.sort(1,1);
		this.house = obj;
	},

	enterHouse:function()
	{
		this.house.enterBuilding();
	},

	resetSorting:function()
	{
		
		if(typeof this.house.sort === 'undefined')return;
		else this.house.sort(1,1);
	},

	stopMovement:function()
	{
		this.speed = 0;
		if (this._movement)
		{
			this.x -= this._movement.x;
			this.y -= this._movement.y;
		}
	},

	enterCollisionSolid:function(e)
	{
		this.collidedObject = e[0].obj;
		 if(this.collidedObject.has("Building"))
		 {
		 	this.house = e[0].obj;
		 	if(this.y <= this.house.y+10)
			{
				this.convert(this.house);
				this.house.sort(0.5,2);
				return;
			}
			else
			{
				if(this.dirY > 0 && this.y <= this.house.y+10)this.house.sort(0.5,2);
				this.stopMovement();
				return;
			}
		 }

		 this.stopMovement();
	},

	exitCollisionSolid:function(e)
	{
		
		if(this.collidedObject.has("Building"))this.house.sort(1,1);
	},


	enterCollisionBoss:function(e)
	{
		/*if(!e[0].obj.locked)
		{
			e[0].obj.destroy();
			$.ajax(
			{
	            url: "/mail/" + state.get_id() + "/",
	            type: "POST",
	            data: formdata,
	            processData: false,
	            contentType: false,
	            success: function (res)
	            {

	            }
        	});
		}*/
	},

	enterCollisionBlock:function(e)
	{
		if(this.dirX != 0 && this.dirY == 0 || this.dirX == 0 && this.dirY != 0)
		{
			e[0].obj.move(this.dirX,this.dirY,this);
		}
		else this.stopMovement();
	},

	Player:function(func)
	{

		this.z = 1;
		this.collisionFunction = func;
		this.requires("SpriteAnimation")
		 .animate("walk_left",6,1,8)
		 .animate("walk_right",6,2,8)
		 .animate("walk_up",6,3,8)
		 .animate("walk_down",6,0,8)
		 .bind('EnterFrame', function()
		 {
		 	if(!this.mayMove)this.stopMovement();
		 })
		
		
		.bind("NewDirection",
			function (direction)
			{
				if(!this.mayMove)return;
				this.dirX = direction.x;
				this.dirY = direction.y;
				if (direction.x < 0)
				{
					if (!this.isPlaying("walk_left"))
						this.stop().animate("walk_left", 10, -1);
				}
				if (direction.x > 0)
				{
					if (!this.isPlaying("walk_right"))
						this.stop().animate("walk_right", 10, -1);
				}
				if (direction.y < 0)
				{
					if (!this.isPlaying("walk_up"))
						this.stop().animate("walk_up", 10, -1);
				}
				if (direction.y > 0)
				{
					if (!this.isPlaying("walk_down"))
						this.stop().animate("walk_down", 10, -1);
				}
				if(!direction.x && !direction.y)
				{
					this.stop();
				}
			})

		.bind('Moved',function()
		{

			list = Crafty.map.search({_x: this.x, _y: this.y, _w: 40, _h: 40}, true);

			if(this.update)this.update();
			
			if(this.isCollindingWithDoor)
			{
				this.isCollindingWithDoor = false;
			}

			for (enity in list)
			{
				if(list[enity].has("NPC"))
				{
					if(!this.popUp.isShown)
					{
						this.npc = list[enity];
						this.npc.player = this;
						this.popUp.showTalk();
					}
					return;
				}
				if(list[enity].has("Building"))
				{
					if(!this.popUp.isShown)
					{
						this.house = list[enity];
						this.popUp.showEnter();
					}
					return;
				}


				if(list[enity].has("Door"))
				{
					if(!this.popUp.isShown)
					{
						this.door = list[enity];
						this.popUp.showExit();
					}
					return;
				} 


				if(list[enity].has("Machine"))
				{
					if(!this.popUp.isShown)
					{
						this.machine = list[enity];
						this.popUp.showWarp();
					}
					return;
				} 
			}

			if(this.popUp.isShown)
			{
				this.popUp.hide();
			}
		})

		.requires('Keyboard').bind('KeyDown', function ()
		{ 

			if (this.isDown('ENTER'))
			{
				if(this.popUp.isHouse)
				{
					this.enterHouse();
				}

				if(this.popUp.isNpc)
				{
					this.npc.startDialog();
				}

				if(this.popUp.isWarp)
				{
					Crafty.scene(this.machine.startGame);
				}

				if(this.popUp.isExit)
				{
					Crafty.scene("main");
				}

			}
		})
			
		.bind('KeyUp', function (e)
		{
			if (e.key == 76 && !Crafty.isPaused())
			{
				if(quest_log.x  <= -150)
				{
					quest_log.Up();
					this.mayMove = false;
				}
				else if(quest_log.x >=  10)
				{
					quest_log.Out();
					this.mayMove = true;
				}

			}
			return true;
		})


		.onHit("Solid",this.enterCollisionSolid,this.exitCollisionSolid)
		.onHit("Block",this.enterCollisionBlock)
	}

});


Crafty.c("RightControls",
{
    init: function()
    {
        this.requires('Multiway');
    },
    
    rightControls: function(speed)
    {
        this.multiway(speed, {UP_ARROW: -90, DOWN_ARROW: 90, RIGHT_ARROW: 0, LEFT_ARROW: 180})
        return this;
    }
});
