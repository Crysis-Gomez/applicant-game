
Crafty.c("Questlog",{

		init:function(){
			var that = this;
			this.addComponent("2D, DOM,Color2");
			this.y = 0;
			this.w = 150;  
			this.h = 200;   
			this.color("#fff");
			this.array = [];
			//this.infolog = info;
			this.popUp = false;
			this.popDown = false;
			this.arrayIndex = 0;
			this.maySelected = false;
			this.slideSpeed = 10;
			this.maxPosition= 300;
			this.minPosition = 400;
			this.marginX = 5;
			this.marginY = 30;
			this.infoLogHeight = 100;
			this.alpha = 0.5;
			this.css({"border-radius": "15px"});	
		},

		deselect:function()
		{
			this.array[this.arrayIndex].isSelected = false;
			this.array[this.arrayIndex].selectQuest();
		},

		goselect:function()
		{
			this.array[this.arrayIndex].isSelected = true;
			this.array[this.arrayIndex].selectQuest();
		},

		Up:function()
		{
			this.popUp = true;
			this.popDown = false;
		},

		Out:function()
		{
			this.popUp = false;
			this.popDown = true;
		},

		show:function()
		{
			this.attachAllQuests();
			for (var i = 0; i < this.array.length; i++) 
			{	
				this.array[i].showText();
			}
		},

		update:function()
		{
			for (var i = 0; i < this.array.length; i++)
			{
				this.array[i].update();
			}
		},

		attachAllQuests:function()
		{
			for (var i = 0; i < this.array.length; i++)
			{
				 this.attach(this.array[i]);
			}
		},

		detachAllQuests:function()
		{
			for (var i = 0; i < this.array.length; i++)
			{
				 this.detach(this.array[i]);
			}

			this.h = this.array.length*30 +100;
			this.attachAllQuests();
		},

		addQuest:function(quest)
		{
			this.detachAllQuests();
			this.array.push(quest);
			//quest.x = 100;
			quest.y = this.y + this.marginY*this.array.length;
			quest.h = 30;
			quest.z =1;
			quest.questlog = this;

			this.show();
			quest.isSelected = false;
			// if(quest.npc !== null) quest.npc.removeMark();
			// if(condition) sendQuest(quest.questID);
		}
	});

	Crafty.c("Quest",
	{

		init:function(){
			this.addComponent("2D, DOM,Color2,Text,Image");
			this.x = 50;
			this.y = 0;
			this.w = 300;  
			this.h = 500;   
			this.name = "";
			this.textColor('#FFFF00');
			this.checkFunction = null;
			this.completed = false;
			this.isSelected = false;
			this.questlog = null;
			this.questID = 0;
			this.npc = null;
			this.visible = false;

			this._element.setAttribute("id","shadow");

		},

		update:function()
		{
			this.completed = this.checkFunction();
			if(this.completed)this.image("/static/checkmark.png");
			else this.image("/static/checkmark2.png");
		},

		addQuestInfo:function(id,name,info,checkFunction,unlock,checkGotQuest)
		{
			this.name = name;
			this.info = info;
			this.questID = id;
			this.checkFunction = checkFunction;
			this.completed = checkFunction();
			this.unlock = unlock;
			this.isSelected = false;
			this.checkGotQuest = checkGotQuest;
		},
		showText:function()
		{
			this.text('<div style="margin-left:-80px; margin-top: 5px; font-size:15px;" >' + this.name); //+ '<div style="margin-left:100px;">' + this.completed);
			if(this.completed)this.image("/static/checkmark.png");
			else this.image("/static/checkmark2.png");

		}
	});
