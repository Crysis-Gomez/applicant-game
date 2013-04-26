
var CONTACT = "CONTACT";
var MOTIVATION = "MOTIVATION";
var UPLOAD = "UPLOAD";
var QUEST = "QUEST";


function getDialogData1(state)
{
 	data ="";
  	if(!state.check_name())
  	{
			data = ["Bob: Hi I`m bob nice to meet you!",
								  "How may I call you?",
								   CONTACT, // Player enters name....
								  "Bob: Welcome to the vacancy of ", 
								  "Bob: Next thing you need to do is to upload your C.V.",
								  "But you need to fix the machine in the first building",
								   QUEST,
								  "Bob: Press L, so you can see the quest log.",
								  "Bob: Good luck."];
	}	
	else if(!state.check_cv())
	{
		data = ["Bob: Welcome back " + state.name(),
				"Bob: Next thing you need to do is to upload your C.V."];
	}
	else
	{ 
		data = ["Bob: Welcome back " + state.name(),
				 "Bob: It's time to kick some ass!"];
	}

	return data;
}

function getDialogData2(state)
{
 	data ="";

 	if(!state.check_name())
 	{
 		data = ["Richard: pls sumbit your name and e-mail at Bob and your first task"];
 	}
	else if(!state.check_motivation() && !state.checkUnlockedMotivationQuest())
	{
		 	data = ["Richard: Hi " + state.name(),
					"Richard: you can upload you motivation letter at the other building",
					 QUEST,
					"Richard: Good luck."];
	}
	else if(!state.check_motivation() && state.checkUnlockedMotivationQuest())
	{
		data = ["Richard: Hi " + state.name(),
		"Richard: Time upload you motivation man"];
	}
	else
	{
		data = ["Richard: Hi " + state.name(),
		"Richard: Time to kick some ass"];
	}

	return data;
}


function uploadCV()
{

	document.getElementById("form2").style.display = 'block';
	document.getElementById("container").style.display = 'block';
	return (Crafty.pause(true));
}

function uploadContact()
{

	document.getElementById("form").style.display = 'block';
	document.getElementById("container").style.display = 'block';
	document.getElementById("id_name").focus();
	
	return !(Crafty.pause(true));
}

function uploadMotivation()
{
	document.getElementById("container").style.display = 'block';
	document.getElementById("choice").style.display = 'block';
	return false;
}

function addQuest(npc)
{
	quest_log.addQuest(npc.quest,true);

	return true;
}


function craftyTriggers(str,npc)
{

	switch(str)
	{
		case UPLOAD:

		return [true,uploadCV()]



		 case CONTACT:
		 		 
		 return [true,uploadContact()]


		 case MOTIVATION:

		 return [true,uploadMotivation()]


		 case QUEST:
		 		
		 return [true,addQuest(npc)];

	}

	return [false,false];
}

