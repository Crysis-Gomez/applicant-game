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
			row.setAttribute("id", quest.getName());
			row.innerHTML = quest.getName();
			$("#"+quest.getName()).css({
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
				
			);

			var cell1=row.insertCell(0);
			cell1.innerHTML= quest.getCompleted();
		}
	}
}

function damn(){

	console.log("DMAN");
}


 function Quest(str,checkfunction){
	var name = str;
	var completed = false;
	var questHolder = null;
	var check = checkfunction;
	console.log(checkfunction);


	this.getName = function(){
		return name;
	},
	this.getCompleted = function()
	{
		return checkfunction();
	}


}
Quest.prototype.getQuest =function(){

}

