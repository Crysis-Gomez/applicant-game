var state = function() 
{
	this.player_name = '{{ game.player_name }}';
	this.email = '{{ game.player_email }}';
	this.has_cv = '{{ game.has_cv }}';
	this.has_motivation = '{{game.has_motivation}}';
	this.has_links = '{{game.has_links}}';
	this.has_skills = '{{game.has_rated_skills}}'

	this.unLockedCVQuest = '{{game.player_cv_unlockedQuest}}';
	this.mayUploadCV = false;

	this.unLockedMotivationQuest = '{{game.player_motivation_unlockedQuest}}';
	this.MayUploadMotivation = false;

	this.unLockedLinkQuest = '{{game.player_link_unlockedQuest}}';
	this.MayUploadLink = false;

	this.unLockedSkillsQuest = '{{game.player_skill_unlockedQuest}}';
	this.MayUploadSkills = false;

	this.id = '{{game.uid}}';
	this.skills = {{skills|safe}};
	this.playerLinks = {{links|safe}};
		
	this.playerPositionx = 100;
	this.playerPositiony = 200;///django shit doen.
	this.has_quest_log = false;
	this.boss_unlocked = '{{game.player_unlocked_boss}}';

	var check_UnlockedSkillsQuest = function()
	{
		var my_val = false;
		if(unLockedSkillsQuest == 'True')
		{
			my_val = true;
		}
		return my_val;
	}

	var skills_Unlocked = function()
	{
		 unLockedSkillsQuest = 'True';
	}

	var skills_MayUpload = function()
	{
		MayUploadSkills = true;
	}

	var check_MayUploadSkills = function()
	{
		return MayUploadSkills;
	}



	///////////////////////////////////////////////

	var check_UnlockedLinkQuest = function()
	{
		var my_val = false;
		if(unLockedLinkQuest == 'True')
		{
			my_val = true;
		}
		return my_val;
	}

	var link_Unlocked = function()
	{
		 unLockedLinkQuest = 'True';
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

	var check_UnlockedMotivationQuest = function()
	{
		var my_val = false;
		if(unLockedMotivationQuest == 'True')
		{
			my_val = true;
		}
		return my_val;
	}

	var motivation_Unlocked = function()
	{
		 unLockedMotivationQuest = 'True';
	}

	var motivation_MayUpload = function()
	{
		MayUploadMotivation = true;
	}

	var check_MayUploadMotivation = function()
	{
		return MayUploadMotivation;
	}
/////////////////////////////////////////////
	var check_UnlockedCVQuest = function()
	{
		var my_val = false;
		if(unLockedCVQuest == 'True')
		{
			my_val = true;
		}
		return my_val;
	}

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


	return {
		getState: function() { init() },
		my_name: function()
		{
			return player_name;
		},

		my_email:function()
		{
			return email;
		}, 
		check_cv: get_cv,
		check_name:get_name,
		check_motivation:get_motivation,
		check_link:get_link,
		check_skills:get_skills,
		checkPosition:checkPosition,
		setPosition:setPosition,
		checklog:check_log,
		setlog:set_log,
		
		checkUnlockedCVQuest:check_UnlockedCVQuest,
		cvUnlocked:cv_Unlocked,
		cvMayUpload:cv_MayUpload,
		checkMayUploadCV:check_MayUploadCV,

		checkUnlockedMotivationQuest:check_UnlockedMotivationQuest,
		motivationUnlocked:motivation_Unlocked,
		motivationMayUpload:motivation_MayUpload,
		checkMayUploadMotivation:check_MayUploadMotivation,

		checkUnlockedLinkQuest:check_UnlockedLinkQuest,
		linkUnlocked:link_Unlocked,
		linkMayUpload:link_MayUpload,
		checkMayUploadLink:check_MayUploadLink,
		skills:skills,
		playerLinks:playerLinks,


		checkUnlockedSkillsQuest:check_UnlockedSkillsQuest,
		skillsUnlocked:skills_Unlocked,
		skillsMayUpload:skills_MayUpload,
		checkMayUploadSkills:check_MayUploadSkills,
		boss_unlocked:boss_unlocked,
		check_boss_unlocked:check_boss_unlocked,

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
