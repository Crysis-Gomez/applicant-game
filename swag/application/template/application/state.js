var state = function() 
{
	this.player_name 	= '{{ game.player_name }}';
	this.email 			= '{{ game.player_email }}';
	this.has_cv 		= '{{ game.has_cv }}';
	this.has_motivation = '{{game.has_motivation}}';
	this.has_links 		= '{{game.has_links}}';
	this.has_skills 	= '{{game.has_rated_skills}}';

	
	this.mayUploadCV 			= false;
	this.MayUploadMotivation 	= false;
	this.MayUploadLink 			= false;
	this.MayUploadSkills 		= false;
	
	this.cvBuildingUnlocked         = '{{game.cv_building_unlocked}}';
	this.motivationBuildingUnlocked = '{{game.motivation_building_unlocked}}';
	this.skillsBuildingUnlocked 	= '{{game.skills_building_unlocked}}';
	this.linksBuildingUnlocked 		= '{{game.links_building_unlocked}}';
	

	this.id 			= '{{game.uid}}';
	this.skills 		= {{skills|safe}};
	this.playerLinks 	= {{links|safe}};
	this.question 		= {{question|safe}};
		
	this.playerPositionx 	= 100;
	this.playerPositiony 	= 200;///django shit doen.
	this.has_quest_log 		= false;
	this.boss_unlocked 		= '{{game.player_unlocked_boss}}';
	this.answered 			= '{{game.get_answer}}';

	this.ip = '{{ip}}'; 


	var skills_MayUpload = function()
	{
		MayUploadSkills = true;
	}

	var check_MayUploadSkills = function()
	{
		return MayUploadSkills;
	}

	var link_MayUpload = function()
	{
		MayUploadLink = true;
	}

	var check_MayUploadLink = function()
	{
		return MayUploadLink;
	}
//////////////////////////////////////////


	var motivation_MayUpload = function()
	{
		MayUploadMotivation = true;
	}

	var check_MayUploadMotivation = function()
	{
		return MayUploadMotivation;
	}
/////////////////////////////////////////////

	var cv_Unlocked = function()
	{
		 unLockedCVQuest = 'True';
	}

	var cv_MayUpload = function()
	{
		mayUploadCV = true;
	}

	var check_MayUploadCV = function()
	{
		return mayUploadCV;
	}

	that = this;

	var checkPosition = function()
	{
		return[playerPositionx,playerPositiony];
	}

	var check_log = function()
	{
		return has_quest_log;
	}

	var set_log = function(bool){
		has_quest_log = true;
	}

	var setPosition = function(x,y)
	{
		playerPositionx = x;
		playerPositiony = y;
	}

	var init = function()
	{

	}

	var setName = function(name)
	{
		this.player_name = name
	}

	var get_name = function()
	{
		var my_val = false;
		if (player_name.length > 0)
		{
			my_val = true;
		}
		return my_val;
	}


	var update_unlockQuest = function(id)
	{
		switch(id)
		{
			case 1:
					cv_Unlocked();
			break;

			case 2:
					motivation_Unlocked();
			break;

			case 3:
					link_Unlocked();
			break;

			case 4:
					skills_Unlocked();
			break;

		}
	}


	var boolChecker = function(value)
	{
		var my_val = false;
		if(value == 'True') my_val = true
		return my_val
	}

	var get_motivation = function()
	{
		return boolChecker(has_motivation);
	}

	var get_cv = function()
	{
		return boolChecker(has_cv);
	}


	var get_link = function()
	{
		return boolChecker(has_links);
	}


	var get_skills = function()
	{
		return boolChecker(has_skills)
	}

	var check_boss_unlocked = function()
	{
		return boolChecker(boss_unlocked);
	}

	var check_answered = function()
	{
		return boolChecker(answered);
	}

	var update_cv_building = function()
	{
		cvBuildingUnlocked = 'True';
	}

	var update_motivation_building = function()
	{
		motivationBuildingUnlocked = 'True';
	}

	var update_skills_building = function()
	{
		skillsBuildingUnlocked = 'True';
	}

	var update_links_building = function()
	{
		linksBuildingUnlocked = 'True';
	}




	var get_cv_building = function()
	{
		return cvBuildingUnlocked;
	}

	var get_motivation_building = function()
	{
		return motivationBuildingUnlocked;
	}

	var get_skills_building = function()
	{
		return skillsBuildingUnlocked;
	}

	var get_links_building = function()
	{
		return linksBuildingUnlocked;
	}


	return {
		getState: function() { init() },
		my_name: function()
		{
			return player_name;
		},

		getQuestion:function()
		{
			return question;
		},

		my_email:function()
		{
			return email;
		}, 
		check_cv: get_cv,
		check_name:get_name,
		check_answered:check_answered,
		check_motivation:get_motivation,
		check_link:get_link,
		check_skills:get_skills,
		checkPosition:checkPosition,
		setPosition:setPosition,
		checklog:check_log,
		setlog:set_log,


		isCvBuildingUnlocked:get_cv_building,          
		isMotivationBuildingUnlocked:get_motivation_building,
		isSkillsBuildingUnlocked:get_skills_building,
		islinksBuildingUnlocked:get_links_building,
		
		update_cv:update_cv_building,
		update_motivation:update_motivation_building,
		update_skills:update_skills_building,
		update_links:update_links_building,


		cvUnlocked:cv_Unlocked,
		cvMayUpload:cv_MayUpload,
		checkMayUploadCV:check_MayUploadCV,

		motivationMayUpload:motivation_MayUpload,
		checkMayUploadMotivation:check_MayUploadMotivation,

		linkMayUpload:link_MayUpload,
		checkMayUploadLink:check_MayUploadLink,
		skills:skills,
		playerLinks:playerLinks,

		skillsMayUpload:skills_MayUpload,
		checkMayUploadSkills:check_MayUploadSkills,
		boss_unlocked:boss_unlocked,
		check_boss_unlocked:check_boss_unlocked,
		update_unlockQuest: update_unlockQuest,
		ip:ip,



		get_skills: function() 
		{
			return skills;
		},

		get_links:function()
		{
			return playerLinks;
		},

		get_id: function() { return id },
		
		update_key: function (value)
		{
			has_cv = value;
			return true;
		},
		update: function(key, value)
		{
			that[key] = value;
			return true;
		},

		name: function()
		{ 
			return player_name; 
		}
	}
}();
