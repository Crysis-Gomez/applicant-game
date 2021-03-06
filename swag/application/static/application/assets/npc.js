
var CONTACT = "CONTACT";
var MOTIVATION = "MOTIVATION";
var UPLOAD = "UPLOAD";
var LINK = "LINK";
var SKILL = "SKILL";
var QUEST = "QUEST";
var PROFILE = "PROFILE";
var EXIT = "EXIT";
var QUESTION  = "QUESTION";
var LEAD ="LEAD";
var UNLOCK_BUILDING_ONE =   "UNLOCK_BUILDING_ONE";
var UNLOCK_BUILDING_TWO =   "UNLOCK_BUILDING_TWO";
var UNLOCK_BUILDING_THREE = "UNLOCK_BUILDING_THREE";
var UNLOCK_BUILDING_FOUR =  "UNLOCK_BUILDING_FOUR";



function getDialogData1(state)
{
 	var data ="";
  	if(!state.check_name())
  	{
			data = ["Sandra: Hi I`m Sandra nice to meet you!",
								  "How may I call you?",
								   CONTACT, // Player enters name....
								  "Sandra: Welcome to the vacancy of ", 
								  "Sandra: Next thing you need to do is to upload your C.V.",
								  "Sandra: But you need to fix the machine in the first building",
								   UNLOCK_BUILDING_ONE,
								  "Sandra: Good luck."];
	}
	else if(!state.check_cv())
	{

		data = ["Sandra: Welcome back " + state.name(),
		  "Sandra: Welcome to the vacancy of ",
		  "Sandra: Next thing you need to do is to upload your C.V.",
		  "Sandra: But you need to fix the machine in the first building",
		  UNLOCK_BUILDING_ONE,
		  "Sandra: Good luck."];
	}
	else
	{ 
		data = ["Sandra: Welcome back " + state.name(),
				 "Sandra: It's time to kick some ass!"];
	}

	return data;
}

function getDialogData2(state)
{
 	var data ="";

 	if(!state.check_name())
 	{
 		data = ["Maria: pls sumbit your name and e-mail at Sandra and your first task"];
 	}
	else if(!state.check_motivation())
	{
		 	data = ["Maria: Hi " + state.name(),
					"Maria: you can upload your motivation letter at the other building",
					 UNLOCK_BUILDING_TWO,
					"Maria: Good luck."];
	}
	else
	{
		data = ["Maria: Hi " + state.name(),
		"Maria: Time to kick some ass"];
	}

	return data;
}


function getDialogData3(state)
{
 	var data ="";

 	if(!state.check_name())
 	{
 		data = ["Sharron: pls sumbit your name and e-mail at Sandra and your first task"];
 	}
	else if(!state.check_link())
	{
		 	data = ["Sharron: Hi " + state.name(),
					"Sharron: you can upload your links at the other building",
					 UNLOCK_BUILDING_THREE,
					"Sharron: Good luck."];
	}
	else
	{
		data = ["Sharron: Hi " + state.name(),
		"Sharron: Time to kick some ass"];
	}

	return data;
}

function getDialogData4(state)
{
 	var data ="";

 	if(!state.check_name())
 	{
 		data = ["Vera: pls sumbit your name and e-mail at Sandra and your first task"];
 	}
	else if(!state.check_skills())
	{
		 	data = ["Vera: Hi " + state.name(),
					"Vera: you can upload your skills at the other building",
					 UNLOCK_BUILDING_FOUR,
					"Vera: Good luck."];
	}
	else
	{
		data = ["Vera: Hi " + state.name(),
		"Vera: Time to kick some ass"];
	}

	return data;
}


function getDialogData5(state)
{
 	var data ="";

 	if(!state.check_name())
 	{
 		data = ["Mr. miyagi: pls sumbit your name and e-mail at Sandra and your first task"];
 	}
	else 
	{
		data = ["Mr. miyagi: Here you can see your profile",
				PROFILE,EXIT,"Mr. miyagi:Bye"];
	}

	return data;
}

function getDialogData6(state)
{
 	var data ="";

 	if(!state.check_answered())
 	{
	 	data = ["Wouter: You have made it this far,impressive!... Whahahaha",
	 			"Wouter: Before you can continue anwser this question"
	 			,"Wouter: "+state.getQuestion(),
	 			 QUESTION,
	 			"Wouter: Thx for submitting"];
 	}
 	else
 	{
 		data = ["Wouter: see you soon ",
				"Wouter: Bye"];
 	}


	return data;
}

function getDialogIntro(state)
{
   	var data="";
   	
   	data = ["Sandra: Help,Help ......",
   		"Sandra: We have a problem! I have noticed that you want to apply for a job at Spil Games!!!",
		"Sandra: Currently we have problems with our systems",
		"Sandra: It`s has been taken over by the hiring manager!!",
		"Sandra: Solve the problems and convince the hiring manager that you can overcome these challenges!!",
		"Sandra: Here are your objectives",
		QUEST,
		"Sandra: Follow Me pls",
		 LEAD,
		]  
 
  return data;

}

function uploadCV()
{
	$("#myModal").modal('show');
	$("#model-header-text").html("Curriculum vitae");
	$("#submitButton").show();
	document.getElementById("cv_form").style.display = 'block';
	document.getElementById("container").style.display = 'block';
	document.getElementById("submitButton").onclick = sendFiles;
	return (Crafty.pause(true));
}

function uploadContact()
{
	document.getElementById("contact_form").style.display = 'block';
	$("#myModal").modal('show');
	$("#model-header-text").html("Contact information")
	$("#submitButton").show();
	document.getElementById("submitButton").onclick = sendContactInfo;
	return !(Crafty.pause(true));
}

function uploadMotivation()
{
	$("#myModal").modal('show');
	$("#model-header-text").html("Motivation");
	document.getElementById("choice").style.display = 'block';
	document.getElementById("success_div").style.display = 'block';
	document.getElementById("success_div").innerHTML = "Please upload your motivation or write it in the free from";
	document.getElementById("submitButton").onclick = sendMotivation;
	return !(Crafty.pause(true));
}

function uploadLink()
{
	$("#myModal").modal('show');
	$("#model-header-text").html("Links");
	$("#submitButton").show();
	document.getElementById("links_form").style.display = 'block';
	document.getElementById("submitButton").onclick = submitlinks;
	$("#addLink").show();
	$("#removeLink").show();
	return !(Crafty.pause(true));
}


function uploadSkills()
{
	$("#myModal").modal('show');
	$("#model-header-text").html("Skills");
	$("#submitButton").show();
	document.getElementById("skill_form").style.display = 'block';
	document.getElementById("submitButton").onclick = submitSkills;
	return !(Crafty.pause(true));
}


function uploadAnswer()
{
	
	document.getElementById("id_answer").style.display = 'block';
	document.getElementById("question_form").style.display = 'block';
	document.getElementById("question").style.display = 'block';
	document.getElementById("question").innerHTML = state.getQuestion();
	document.getElementById("submitButton").onclick = submitAnswer;
	$("#submitButton").show();

	$("#myModal").modal('show');

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
		 		Crafty.trigger(QUEST);
		 return [true,true];

		 case PROFILE:
		 		Crafty.trigger("SHOW");
		 return [true,false];

		 case QUESTION:
		 		
		 return [true,uploadAnswer()];

		 case EXIT:
		 		Crafty.trigger("HIDE");
		 return [true,false];

		 case LEAD:
		 		Crafty.trigger("LEAD");
		 return [true,true];

		 case UNLOCK_BUILDING_ONE:
		 		sendBuilding(0);
		 		state.update_cv();
		 		Crafty.trigger(UNLOCK_BUILDING_ONE);
		 return[true,true];

		 case UNLOCK_BUILDING_TWO:
		 		sendBuilding(1);
		 		state.update_motivation();
		 		Crafty.trigger(UNLOCK_BUILDING_TWO);
		 return[true,true];

		 case UNLOCK_BUILDING_THREE:
		 		sendBuilding(2);
		 		state.update_links();
		 		Crafty.trigger(UNLOCK_BUILDING_THREE);
		 return[true,true];

		 case UNLOCK_BUILDING_FOUR:
				 sendBuilding(3);
				 state.update_skills();
		 		Crafty.trigger(UNLOCK_BUILDING_FOUR);
		 return[true,true];

	}

	return [false,false];
}

