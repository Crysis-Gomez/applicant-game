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
	isCollidingWithHouse: false,
	isCollindingWithDoor:false,
	dirX:0,
	dirY:0,
	count:0,
	mayStop:false,

	
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

	enterCollisionHouse:function(e)
	{
		this.house = e[0].obj;
		if(this.y <= this.house.y+80)
		{
			this.convert(this.house);
			this.house.sort(0.5,2);
		}
		else
		{
			if(this.dirY > 0 && this.y <= this.house.y+80)this.house.sort(0.5,2);
			this.stopMovement();
			this.isCollidingWithHouse = true;
		}
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


	enterCollisionMachine:function(e)
	{
		this.stopMovement();
		Crafty.scene(e[0].obj.startGame);
		
	},

	exitCollisionMachine:function(e)
	{
		
		
	},

	enterCollisionDoor:function(e)
	{
		this.stopMovement();
		this.isCollindingWithDoor = true;
	},

	exitCollisionHouse:function()
	{
		this.house.sort(1,1);
	},


	enterCollisionWall:function(e)
	{
		this.stopMovement();
		
	},


	Player:function(func)
	{

		this.z = 1;
		this.collisionFunction = func;
		
		this.requires("SpriteAnimation")
		 .animate("walk_left",8,0,10)
		 .animate("walk_right",11,0,13)
		 .animate("walk_up",5,0,7)
		 .animate("walk_down",2,0,4)
		 .bind('EnterFrame', function()
		 {

		 })
		

		.bind("NewDirection",
			function (direction)
			{
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
			
			if(this.update)this.update();
			
			if(this.isCollidingWithHouse)
			{
				this.isCollidingWithHouse = false;
			}
			if(this.isCollindingWithDoor)
			{
				this.isCollindingWithDoor = false;
			}
		})

		.requires('Keyboard').bind('KeyDown', function ()
		{ 

			if (this.isDown('ENTER'))
			{

				if(this.isCollidingWithHouse && state.checkUnlockedCVQuest())
				{
					this.enterHouse();
					this.isCollidingWithHouse = false;
				}

				if(this.isCollindingWithDoor)
				{
					Crafty.scene("main");
					this.isCollindingWithDoor = false;
				}
			}
		})
			
		.bind('KeyUp', function (e)
		{
			if (e.key == 76 && !Crafty.isPaused())
			{
				if(quest_log.x  <= -150)quest_log.Up();
				else if(quest_log.x >=  10)quest_log.Out();

			}
			return true;
		})

		.onHit("house",this.enterCollisionHouse,this.exitCollisionHouse)
		.onHit("Door",this.enterCollisionDoor)
		.onHit("Wall",this.enterCollisionWall)
		.onHit("Block",this.enterCollisionBlock)
		.onHit("Machine",this.enterCollisionMachine,this.exitCollisionMachine)
		.onHit("boss",this.enterCollisionBoss);	
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
