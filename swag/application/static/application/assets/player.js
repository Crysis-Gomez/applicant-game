Crafty.c('Respawn',{

	init:function(){
		this.x = state.checkPosition()[0];
		this.y = state.checkPosition()[1];
	}
})

Crafty.c('Player',{
	
	house:Object,
	isCollidingWithHouse: false,
	isCollindingAbove:false,
	dir:0,
	count:0,
	mayStop:false,
	
	convert:function(obj){
		if(typeof this.house === obj)return;
		if(typeof this.house.sort === 'undefined')this.house = obj;
		
		this.house.sort(1,1);
		this.house = obj;
	},

	enterHouse:function(){
		this.house.enterBuilding();
	},

	resetSorting:function(){
		
		if(typeof this.house.sort === 'undefined')return;
		else this.house.sort(1,1);
	},
	
	Player:function(){

		this.z = 1;
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
						this.stop().animate("walk_left", 10, -1);
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
			state.setPosition(this.x,this.y);

        	if(this.hit('house')){
            	this.house = this.hit('house')[0].obj;
				if(this.y <= this.hit('house')[0].obj.y+80){
					this.convert(this.house);
					this.house.sort(0.5,2);
				}
				else{
					this.isCollidingWithHouse = true;
					this.attr({x: from.x, y:from.y});
					if(this.dir < 0)this.house.sort(1,1);
					else if(this.dir > 0) this.isCollidingWithHouse = false;
				}
			}else{
					this.resetSorting();
					this.isCollidingWithHouse = false;
				} 
		})
		 .requires('Keyboard').bind('KeyDown', function () { 
			if (this.isDown('ENTER') && this.isCollidingWithHouse){

				this.enterHouse();
			}
		})
			
		.bind('KeyUp', function (e) {
			if (e.key == 76 && !Crafty.isPaused()){
				if(quest_log.x  <= -150)quest_log.Up();
				 	else if(quest_log.x >=  10)quest_log.Out(); 
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
