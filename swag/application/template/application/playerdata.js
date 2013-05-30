var isFreeFrom = false;

function freeForm()
{
    $("#container").show();
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
    $("#container").show();
    $("#id_attachment").show();
    $("#letter_form").show();
    $("#choice").hide();
    $("#success_div").hide();
    document.getElementById("uploaddocumentbutton").blur();
    isFreeFrom:false;
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
}


function updateGame(propertie,value)
{
    window.state.update(propertie, value);
    var game = window.game.crafty.pause(false);
    window.quest_log.update();
    document.getElementById("success_div").innerHTML = "Response will be placed here on submit";
    $("#contact_form").hide();
    $("#container").hide();
    $("#id_attachment").hide();
    $("#letter_form").hide();
    $("#id_entry").hide();
    $("#cv_form").hide();
    $("#skill_form").hide();
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
                text = response.player['result'];
                updateGame('player_name', name)
            }
            else document.getElementById("success_div").innerHTML = replaceText(text);
            
         }
     });
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

function submitSkills() 
{   
    //$.post('/uploadskills/{{game.uid}}/', $('#skill_form').serialize());
    $("#skill_form").ajaxSubmit({url:'/uploadskills/{{game.uid}}/', type: 'post',
        success:function(res)
        {
             updateGame('has_skills','True')
        }
    })
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
}

function showUploadedItem (source)
{
        return true;
}

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

}

$(document).ready(function()
{
    //window.addEventListener('load', loadLevelTxt());
    
    //loadLevelTxt();
    window.game = crafty();
    var game = window.game.crafty.init(900, 600);
    {% if contact_info == 'yes' %}
       
    {% endif %}

    (function ()
    {
        
    function showUploadedItem (source)
    {
        return true;
    }   

    if (window.FormData) 
    {
        formdata = new FormData();

    }

    }());

});


function sendQuest(id)
{
      formdata = new FormData();
      formdata.append('quest_id',id.toString());

        $.ajax({
            url: "/uploadQuest/{{game.uid}}/",
            type: "POST",
            data: formdata,
            processData: false,
            contentType: false,
             success: function (res)
             {
                
            }
        });
}