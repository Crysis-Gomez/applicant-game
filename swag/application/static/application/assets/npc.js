
var CONTACT = "CONTACT";
var MOTIVATION = "MOTIVATION";
var UPLOAD = "UPLOAD";
var LINK = "LINK";
var SKILL = "SKILL";
var QUEST = "QUEST";
var PROFILE = "PROFILE";
var EXIT = "EXIT";
var QUESTION  = "QUESTION";


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
				"Bob: Time to upload your C.V man!"];
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


function getDialogData5(state)
{
 	data ="";

 	if(!state.check_name())
 	{
 		data = ["Richard: pls sumbit your name and e-mail at Bob and your first task"];
 	}
	else 
	{
		data = ["Richard: Here you can see your profile",
				PROFILE,EXIT,"Bye"];
	}

	return data;
}

function getDialogData6(state)
{
 	data ="";

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
				"Bye"];
 	}


	return data;
}

function getDialogIntro(state)
{
   	data="";
   	data = ["Rick: Hi, I have noticed that you want to apply for a job at Spil Games!!!",
		"Rick: Currently we have problems with our systems",
		"Rick: It`s has been taken over by the hiring manager!!",
		"Rick: Solve the problems and convenience the hiring manager that you can overcome these challenges!!"]  
 
  return data;

}


function uploadCV()
{
	$("#myModal").modal('show');
	document.getElementById("cv_form").style.display = 'block';
	document.getElementById("container").style.display = 'block';
	return (Crafty.pause(true));
}


function uploadContact()
{
	document.getElementById("contact_form").style.display = 'block';

	$("#myModal").modal('show');

	return !(Crafty.pause(true));
}

function uploadMotivation()
{
	$("#myModal").modal('show');
	document.getElementById("choice").style.display = 'block';
	document.getElementById("success_div").style.display = 'block';
	document.getElementById("success_div").innerHTML = "Please upload your motivation or write it in the free from";
	
	return !(Crafty.pause(true));
}

function uploadLink()
{
	$("#myModal").modal('show');
	document.getElementById("links_form").style.display = 'block';
	return !(Crafty.pause(true));
}


function uploadSkills()
{
	$("#myModal").modal('show');
	document.getElementById("skill_form").style.display = 'block';
	return !(Crafty.pause(true));
}


function uploadAnswer()
{
	


	$('#myModal').modal({
        backdrop: false,
        keyboard: false
    }).css({
    	'height':function(){
    		return 400;
    	},

	});

	document.getElementById("id_answer").style.display = 'block';
	document.getElementById("question_form").style.display = 'block';
	document.getElementById("question").style.display = 'block';
	document.getElementById("question").innerHTML = state.getQuestion();


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
		 		
		 return [true,addQuest(npc)];

		 case PROFILE:
		 		Crafty.trigger("SHOW");
		 return [true,false];

		 case QUESTION:
		 		
		 return [true,uploadAnswer()];

		 case EXIT:
		 		Crafty.trigger("HIDE");
		 return [true,false];

	}

	return [false,false];
}

