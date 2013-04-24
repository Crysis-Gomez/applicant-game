var questlog = function  () {
	
	var quests = new Array();


	return{
		init:function(){

			
		},

		getCurrentQuests:function(){
			return quests;
		},

		updateQuest:function(name){

			for (var i =quests.length - 1; i >= 0; i--) {
				if(quests[i].getName() == name){
					var row = document.getElementById(name);
					row.cells[0].innerHTML = quests[i].getCompleted();
				}
			};
			
		},

		currentQuest:quests,

		addQuest:function(quest){
			quests.push(quest);
			var table=document.getElementById("quest_container");
			var row=table.insertRow(0);
			row.setAttribute("id", "quest_row","name",quest.getName());
			row.innerHTML = quest.getName();
			var questInfo = document.getElementById("quest_info");
			$("#quest_row").hover(
				
			    function(event) {

			    	quest_info.innerHTML = quest.getInfo();
			        // The mouse has entered the element, can reference the element via 'this'
			    },
			    function (event) {
			    	//quest_info.innerHTML = "yes";
			        // The mouse has left the element, can reference the element via 'this'
			    }
			 );


			/*$("#"+quest.getName()).css({
				"background-color": "#eee"
			});


			$("#"+quest.getName()).mouseover(
					function () {
						$(this).css({"background-color": "#ccc", "cursor":"pointer"});
					}
				
			);

			$("#"+quest.getName()).mouseout(
					function () {
						$(this).css({"background-color": "#eee"});
					}
				
			);*/

			var cell1=row.insertCell(0);
			cell1.innerHTML= quest.getCompleted();
		}
	}
}


 function Quest(str,info,checkfunction){
	var name = str;
	var completed = false;
	var questHolder = null;
	var info = info;
	var check = checkfunction;

	this.getName = function(){
		return name;
	},
	this.getInfo = function(){
		return info;
	}

	this.getCompleted = function()
	{
		return checkfunction();
	}


}
Quest.prototype.getQuest =function(){

}

