
var CONTACT = "CONTACT";
var MOTIVATION = "MOTIVATION";
var UPLOAD = "UPLOAD";
var LINK = "LINK";
var SKILL = "SKILL";
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
					"Richard: you can upload your motivation letter at the other building",
					 QUEST,
					"Richard: Good luck."];
	}
	else if(!state.check_motivation() && state.checkUnlockedMotivationQuest())
	{
		data = ["Richard: Hi " + state.name(),
		"Richard: Time upload your motivation man"];
	}
	else
	{
		data = ["Richard: Hi " + state.name(),
		"Richard: Time to kick some ass"];
	}

	return data;
}


function getDialogData3(state)
{
 	data ="";

 	if(!state.check_name())
 	{
 		data = ["Richard: pls sumbit your name and e-mail at Bob and your first task"];
 	}
	else if(!state.check_link() && !state.checkUnlockedLinkQuest())
	{
		 	data = ["Richard: Hi " + state.name(),
					"Richard: you can upload your links at the other building",
					 QUEST,
					"Richard: Good luck."];
	}
	else if(!state.check_motivation() && state.checkUnlockedLinkQuest())
	{
		data = ["Richard: Hi " + state.name(),
		"Richard: Time upload your links man"];
	}
	else
	{
		data = ["Richard: Hi " + state.name(),
		"Richard: Time to kick some ass"];
	}

	return data;
}

function getDialogData4(state)
{
 	data ="";

 	if(!state.check_name())
 	{
 		data = ["Richard: pls sumbit your name and e-mail at Bob and your first task"];
 	}
	else if(!state.check_skills() && !state.checkUnlockedSkillsQuest())
	{
		 	data = ["Richard: Hi " + state.name(),
					"Richard: you can upload your skills at the other building",
					 QUEST,
					"Richard: Good luck."];
	}
	else if(!state.check_skills() && state.checkUnlockedSkillsQuest())
	{
		data = ["Richard: Hi " + state.name(),
		"Richard: Time upload your links man"];
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

	document.getElementById("cv_form").style.display = 'block';
	document.getElementById("container").style.display = 'block';
	return (Crafty.pause(true));
}

function uploadContact()
{

	document.getElementById("contact_form").style.display = 'block';
	document.getElementById("container").style.display = 'block';
	document.getElementById("id_name").focus();
	
	return !(Crafty.pause(true));
}

function uploadMotivation()
{
	document.getElementById("container").style.display = 'block';
	document.getElementById("choice").style.display = 'block';
	$("#success_div").show();
	document.getElementById("success_div").innerHTML = "Pleas chose your picking";
	return !(Crafty.pause(true));
}

function uploadLink()
{
	document.getElementById("container").style.display = 'block';
	document.getElementById("links_form").style.display = 'block';
	$("#success_div").show();
	return !(Crafty.pause(true));
}


function uploadSkills()
{
	document.getElementById("container").style.display = 'block';
	document.getElementById("skill_form").style.display = 'block';
	$("#success_div").show();
	return !(Crafty.pause(true));
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

		 case LINK:

		 return [true,uploadLink()]

		 case SKILL:

		 return [true,uploadSkills()]


		 case QUEST:
		 		
		 return [true,addQuest(npc)];

	}

	return [false,false];
}

