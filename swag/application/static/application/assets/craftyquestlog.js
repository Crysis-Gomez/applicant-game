Crafty.c("Infolog",{
		init:function(){
			this.addComponent("2D, DOM,Color,Text");
			this.x = 0;
			this.y = 0;
			this.z = 1;
			this.w = 250;  
			this.h = 0;
			this.color("#eee");
		}
	});


	Crafty.c("Questlog",{

		init:function(){
			var that = this;
			this.addComponent("2D, DOM,Color");
			this.x = 0;
			this.y = 0;
			this.w = 150;  
			this.h = 300;   
			this.color("#eee");
			this.array = [];
			this.infolog = info;
			this.popUp = false;
			this.popDown = false;
			this.arrayIndex = 0;
			this.maySelected = false;
			this.slideSpeed = 10;
			this.maxPosition= 10;
			this.minPosition = -150;
			this.marginX = 5;
			this.marginY = 30;
			this.infoLogHeight = 100;

			this.bind('EnterFrame', function() {
				if(this.popUp && this.x < this.maxPosition)this.x+=this.slideSpeed;
				if(this.popDown && this.x  > this.minPosition) this.x-=this.slideSpeed;

				if(this.x >= this.maxPosition && this.maySelected == false){
					this.goselect();
					this.maySelected = true;
					this.infolog.h = this.infoLogHeight;
				}

				if(this.x <= this.minPosition+this.maxPosition) this.maySelected = false;

			});

            this.bind('KeyUp', function (e) {

            	if(!this.maySelected)return;

				if(e.key == 40){
					this.deselect();
					if(this.arrayIndex < this.array.length-1)this.arrayIndex+=1; 
					this.goselect();
				}

				if(e.key == 38){
					this.deselect();
					if(this.arrayIndex > 0)this.arrayIndex--;
					this.goselect(); 
				}
			});	

			this.attach(info);	
		},

		deselect:function(){

			this.array[this.arrayIndex].isSelected = false;
			this.array[this.arrayIndex].selectQuest();
		},

		goselect:function(){
			this.array[this.arrayIndex].isSelected = true;
			this.array[this.arrayIndex].selectQuest();
		},

		Up:function(){
			this.popUp = true;
			this.popDown = false;

		},

		Out:function(){
			this.popUp = false;
			this.popDown = true;
			this.infolog.h = 0;
			this.infolog.text("");
		},

		show:function(){
			this.infolog.x = this.x+this.w;
			this.infolog.y = this.y;
			this.h = this.array.length *100; //make the questlog background longer
			this.attachAllQuests();
			for (var i = 0; i < this.array.length; i++) {
				this.array[i].showText();
			}
		},

		update:function(){
			for (var i = 0; i < this.array.length; i++) {
				this.array[i].update();
			}
		},

		attachAllQuests:function(){
			for (var i = 0; i < this.array.length; i++) {
				 this.attach(this.array[i]);
			}
		},

		detachAllQuests:function(){
			for (var i = 0; i < this.array.length; i++) {
				 this.detach(this.array[i]);
			}
		},

		addQuest:function(quest){
			this.array.push(quest);
			quest.x = this.x + this.marginX;
			quest.y = this.y + this.marginY*this.array.length;
			this.detachAllQuests();
			quest.z =1;
			quest.infolog = this.infolog;
			quest.questlog = this;
			this.show();
		}

	});

	Crafty.c("Quest",{

		init:function(){
			this.addComponent("2D, DOM,Color,Text,Mouse");
			this.x = 0;
			this.y = 0;
			this.w = 100;  
			this.h = 30;   
			this.textColor('#000');
			this.name = "";
			this.infolog = null;
			this.checkFunction = null;
			this.completed = false;
			this.isSelected = false;
			this.questlog = null;
			this.bind("MouseOver", function(){ 
                //this.css({"cursor": "pointer"});
                //this.isSelected = true;
           		//this.selectQuest();
           		
             });
			
			this.bind("MouseOut", function(){ 
           		//this.isSelected = false;
           		//this.selectQuest();
             });
		},

		selectQuest:function(){

			if(this.questlog.popDown) return;

			if(this.isSelected) this.color("#ccc");
			else this.color("#eee");
           	this.infolog.text('<div style="margin-top:12px;">' + this.info);
		},

		update:function(){
			this.completed = this.checkFunction();
			this.text('<div style="margin-top:12px;">' + this.name + '<div style="margin-left:100px;">' + this.completed);
		},

		addQuestInfo:function(name,info,checkFunction){
			this.name = name;
			this.info = info;
			this.checkFunction = checkFunction;
			this.completed = checkFunction();
		},
		showText:function(){
			this.text('<div style="margin-top:12px;">' + this.name + '<div style="margin-left:100px;">' + this.completed);
		}
	});