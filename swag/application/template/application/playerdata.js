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
    $("#submitButton").show();
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
    $("#submitButton").show();
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
       
        $("#letter_form").ajaxSubmit({url:uploadURL, type: 'post',

            uploadProgress: function(event, position, total, percentComplete) {
            
            $('#ajaxBusy').show();
            
            },
            
            success:function(res)
            {
                response = JSON.parse(res);
                text = response.player['result'];
                if(text == 'Thanks for submitting')
                {
                  updateGame('has_motivation','True')
                }
                else showError(replaceText(text));
          
            }
        });
    document.getElementById("submitButton").blur();
}

function showError(string)
{
  document.getElementById("success_div").innerHTML = string;
  $("#success_div").show();
  $('#ajaxBusy').hide();
}

function submitMeeting()
{
    var date = document.getElementById("meeting");

    jQuery.post("/submitmeeting/{{game.uid}}/", {'value1':date.value,
                        'csrftoken': '{{ csrf_token }}'}, 
             function(data) {

                        alert("Data Loaded: " + data);
                            });
    document.getElementById("submitButton").blur();
}


function updateGame(property,value)
{
    window.state.update(property, value);
    var game = window.game.crafty.pause(false);
    window.quest_log.update();
    document.getElementById("success_div").innerHTML = "";
    

    $("#myModal").modal('hide');

    $('#myModal').on('hidden', function () 
    {
      $("#contact_form").hide();
      $("#id_attachment").hide();
      $("#letter_form").hide();
      $("#id_entry").hide();
      $("#cv_form").hide();
      $("#skill_form").hide();
      $("#links_form").hide();
      $("#id_answer").hide();
      $("#question_form").hide();
      $("#question").hide();
      $("#success_div").hide();
      //$("#alert-success").show();
      $('#ajaxBusy').hide();
      $("#submitButton").hide();

      $("#addLink").hide();
      $("#removeLink").hide();

    
    });
}
        
function sendContactInfo()
{
    $("#contact_form").ajaxSubmit({url:'/uploadcontact/{{game.uid}}/', type: 'post',

        uploadProgress: function(event, position, total, percentComplete) {
          $('#ajaxBusy').show();
        },
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
            else showError(replaceText(text));
            
         }
     });

    document.getElementById("id_email").blur();
    document.getElementById("submitButton").blur();
}

function replaceText(string)
{ 

    
    tempText = string.replace(/([&;.*+?^=!:${}()|[\]\/\\])/g,"");
    tempText = tempText.replace(/quot/g,"");
    tempText = tempText.replace('__all__','');
    
    if(tempText.indexOf(", ") !== -1)
    {
       textArray = tempText.split(", ");

      for (var i = 0; i < textArray.length; i++) 
      {
          textArray[i] = capitaliseFirstLetter(textArray[i]);
      };

      finaltext  = "";

      for (var i = 1; i < textArray.length; i++) 
      {
          finaltext =  textArray[i-1] +"<br>" +textArray[i]; 
      };
    }
    else
    {
      return capitaliseFirstLetter(tempText);
    }

    return finaltext
}

function capitaliseFirstLetter(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1);
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

        uploadProgress: function(event, position, total, percentComplete) {
          $('#ajaxBusy').show();
        },

        success:function(res)
        {

          response = JSON.parse(res);
          text = response.player['result'];
          if(text == 'Thanks for submitting')
          {
            updateGame('answered', 'True')
          }
          else  showError(replaceText(text));

        }
    })

   document.getElementById("submitButton").blur();
}

function submitSkills() 
{   
    $("#skill_form").ajaxSubmit({url:'/uploadskills/{{game.uid}}/', type: 'post',

        uploadProgress: function(event, position, total, percentComplete) {
          $('#ajaxBusy').show();
        },

        success:function(res)
        {
          response = JSON.parse(res);
          skills = response.player['skills'];
          window.state.skills = skills;
          updateGame('has_skills','True');
        }
    })
  
  document.getElementById("submitButton").blur();
}


function addLink() 
{
    if(checkURL(document.getElementById('id_links').value))
    {
        $("#linkList").append("<li>" + document.getElementById('id_links').value+ "</li>");
        document.getElementById('id_links').value = "";
    }else  showError("Please insert a link");
}

function removeLink()
{
    list = $("#linkList")[0];
    if(list.children.length > 0)
    {
    	child = list.children[list.children.length -1];
    	list.removeChild(child); 	
    }  		
}

function submitlinks()
{
    if(document.getElementById("linkList").children.length == 0)
    {
        showError("please add, at least one link");
        return;
    }
    if (window.FormData)
    {
        var list = Array();
        for (var i = 0; i < document.getElementById("linkList").children.length; i++) 
        {
            text = document.getElementById("linkList").children[i].textContent;
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
            uploadProgress: function(event, position, total, percentComplete) {
              $('#ajaxBusy').show();
            },
             success: function (res)
             {
                
                updateGame('has_links','True')
            }
        });
    }

    document.getElementById("submitButton").blur();
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
        uploadProgress: function(event, position, total, percentComplete) {
          $('#ajaxBusy').show();
        },


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
            else  showError(replaceText(text));
         }
     });

    document.getElementById("submitButton").blur();
}

$(document).ready(function()
{ 

   $("#id_links").keydown(function() {
        if (event.keyCode == 13) 
        { 

            addLink();
            return false;
         }
    });


     $("#id_name").keydown(function() {
        if (event.keyCode == 13) 
        { 

           $("#id_email").focus();
            return false;
         }
    });

    $("#id_email").keydown(function() {
        if (event.keyCode == 13) 
        { 

           sendContactInfo();
            return false;
         }
    });





    $('#myModal').on('shown', function () {

      if(document.getElementById("contact_form") !== null ){
        if(document.getElementById("contact_form").style.display =='block')
        {
          document.getElementById("id_name").focus();
        }
      }
      

      if(!document.getElementById("id_answer"))return;

      if(document.getElementById("id_answer").style.display !== null){
        if(document.getElementById("id_answer").style.display == 'block')
        {
          document.getElementById("id_answer").focus();
        }
      }
      
    });


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
