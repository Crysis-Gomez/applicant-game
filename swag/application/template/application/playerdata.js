var isFreeFrom = false;

function freeForm()
{
    $("#myModal").modal('show');
    $("#id_entry").show();
    $("#letter_form").show();
    $("#choice").hide();
    $("#success_div").hide();
    document.getElementById("id_entry").focus();
    document.getElementById("freeformbutton").blur();
    isFreeFrom = true;
}

function uploadDocument()
{
    $("#myModal").modal('show');
    $("#id_attachment").show();
    $("#letter_form").show();
    $("#choice").hide();
    $("#success_div").hide();
    document.getElementById("uploaddocumentbutton").blur();
    isFreeFrom:false;
}

function unlockBoss()
{
  $.ajax(
  {
        url: "/boss/" + state.get_id() + "/",
        type: "POST",
        data: formdata,
        processData: false,
        contentType: false,
        success: function (res)
        {

        }
  });
}

function sendMotivation()
{
    var uploadURL = "/uploadfilemotivation/{{game.uid}}/";

    if(isFreeFrom)uploadURL = "/uploadmotivation/{{game.uid}}/";
    
 
     if(document.getElementById("id_attachment").value != "" || document.getElementById("id_entry").value != "")
     {
         $("#letter_form").ajaxSubmit({url:uploadURL, type: 'post',
             success:function(res)
             {

                updateGame('has_motivation','True')
             }
        });
    }
    else showError("Please input something");


    document.getElementById("letterbutton").blur();
}

function showError(string)
{
  document.getElementById("success_div").innerHTML = string;
  $("#success_div").show();
}

function submitMeeting()
{
    var date = document.getElementById("meeting");

    jQuery.post("/submitmeeting/{{game.uid}}/", {'value1':date.value,
                        'csrftoken': '{{ csrf_token }}'}, 
             function(data) {

                        alert("Data Loaded: " + data);
                            });
    document.getElementById("MeetButton").blur();
}


function updateGame(property,value)
{
    window.state.update(property, value);
    var game = window.game.crafty.pause(false);
    window.quest_log.update();
    document.getElementById("success_div").innerHTML = "Response will be placed here on submit";
    $("#contact_form").hide();
    $("#myModal").modal('hide');
    $("#id_attachment").hide();
    $("#letter_form").hide();
    $("#id_entry").hide();
    $("#cv_form").hide();
    $("#skill_form").hide();
    $("#links_form").hide();
    $("#id_answer").hide();
    $("#question_form").hide();
}
        
function sendContactInfo()
{
    $("#contact_form").ajaxSubmit({url:'/uploadcontact/{{game.uid}}/', type: 'post',
         success:function(res)
         {
            response = JSON.parse(res);
            text = response.player['result'];
            if(text == 'Thanks for submitting')
            {
                name = replaceText(response.player['name']);
                email =replaceText(response.player['email']);
                text = response.player['result'];
                updateGame('player_name', name);
                updateGame('player_email', email);
            }
            else document.getElementById("success_div").innerHTML = replaceText(text);
            
         }
     });

    document.getElementById("contactButton").blur();
}

function replaceText(string)
{
    tempText = string.replace(/([&;.*+?^=!:${}()|[\]\/\\])/g,"");
    tempText = tempText.replace(/quot/g,"");
    tempText = tempText.replace(/,/g,'<br>');
    return tempText
}

function checkURL(str) {
     var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
  '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
  '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  if(!pattern.test(str))return false;
  else return true;
}



function submitAnswer()
{
   $("#question_form").ajaxSubmit({url:'/answer/{{game.uid}}/', type: 'post',
        success:function(res)
        {

          response = JSON.parse(res);
          text = response.player['result'];
          if(text == 'Thanks for submitting')
          {
            updateGame('answered', 'True')
          }
          else document.getElementById("success_div").innerHTML = replaceText(text);
        }
    })

   document.getElementById("submit_answer").blur();
}

function submitSkills() 
{   
    //$.post('/uploadskills/{{game.uid}}/', $('#skill_form').serialize());
    $("#skill_form").ajaxSubmit({url:'/uploadskills/{{game.uid}}/', type: 'post',
        success:function(res)
        {
          response = JSON.parse(res);
          skills = response.player['skills'];
          window.state.skills = skills;
          updateGame('has_skills','True');
        }
    })
  
  document.getElementById("submit_skills").blur();
}


function addLink() 
{
    if(checkURL(document.getElementById('id_links').value))
    {
        $("#list").append("<li>" + document.getElementById('id_links').value+ "</li>");
        document.getElementById('id_links').value = "";
    }else  showError("Please insert a link");
}


function submitlinks()
{
    if(document.getElementById("list").children.length == 0)
    {
        showError("please add, at least one link");
        return;
    }
    if (window.FormData)
    {
        var list = Array();
        for (var i = 0; i < document.getElementById("list").children.length; i++) 
        {
            text = document.getElementById("list").children[i].textContent;
            list.push(text);
        }

        formdata = new FormData();
        formdata.append('list',list);
    }

    if (formdata) 
    {
        $.ajax({
            url: "/uploadlinks/{{game.uid}}/",
            type: "POST",
            data: formdata,
            processData: false,
            contentType: false,
             success: function (res)
             {
                
                updateGame('has_links','True')
            }
        });
    }

    document.getElementById("linksbutton").blur();
}

// function showUploadedItem (source)
// {
//       return true;
// }

function restartCrafty()
{

    var game = window.game.crafty.init(900, 600);
}   

function sendFiles()
{

    $("#cv_form").ajaxSubmit({url:'/submitfile/{{game.uid}}/', type: 'post',
         success:function(res)
         {
            response = JSON.parse(res);
            text = response.player['result'];
            if(text == 'Thanks for submitting')
            {
                name = replaceText(response.player['name']);
                text = response.player['result'];
                updateGame('has_cv', 'True')
            }
            else document.getElementById("success_div").innerHTML = replaceText(text);
         }
     });

    document.getElementById("cvButton").blur();
}

$(document).ready(function()
{
    window.game = crafty();
    var game = window.game.crafty.init(900, 600);
    {% if contact_info == 'yes' %}
       
    {% endif %}

    (function ()
    {
        
    // function showUploadedItem (source)
    // {
    //     return true;
    // }   

    if (window.FormData) 
    {
        formdata = new FormData();

    }

    }());

});

function getUrl(value)
{

  switch(value)
  {
    case 1:
    return "/cvquest/{{game.uid}}/";
    
    case 2:
    return "/motivationquest/{{game.uid}}/";
    
    case 3:
    return "/linkquest/{{game.uid}}/";
    
    case 4:
    return "/skillquest/{{game.uid}}/";
  }

}

function sendQuest(id)
{
    var urlString = getUrl(id);
   
   jQuery.post(urlString, {'csrftoken': '{{ csrf_token }}'});
}