function getDialogData1(state){
 	data ="";
  	if(!state.check_name()){
			data = ["Bob: Hi I`m bob nice to meet you!",
								  "How may I call you?",
								  "CONTACT", // Player enters name....
								  "Bob: Welcome to the vacancy of ", 
								  "Bob: Next thing you need to do is to upload your C.V.",
								  "UPLOAD",
								  "Bob: THX for Uploading!!!.",
								  "Bob: Go upload your motivation, at Richard."];
	}	
	else if(!state.check_cv()){
			data = ["Bob: Welcome back " + state.name(),
								  "Bob: Next thing you need to do is to upload your C.V.",
								  "UPLOAD",
								  "Bob: THX for Uploading!!!.",
								  "Bob: Go upload your motivation, at Richard."];
	}
	else{ 
		data = ["Bob: Welcome back " + state.name(),
				 "Bob: It's time to kick some ass!"];
	}

	return data;
}

function getDialogData2(state){
 	data ="";

 	if(!state.check_name()){
 		data = ["Richard: pls sumbit your name and e-mail at Bob"];
 	}
	else if(!state.check_motivation()){
		 	data = ["Richard: Hi " + state.name(),
					"Richard: Here you will upload your motivation letter",
					"MOTIVATION",
					"Richard: THX for Uploading!!!."];

	}else{
		data = ["Richard: Hi " + state.name(),
		"Richard: It's time to kick some ass!"];
	}

	return data;
}


