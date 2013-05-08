var isFreeFrom = false;

function freeForm()
{
    $("#container").show();
    $("#id_entry").show();
    $(".letter").show();
    $(".Choice").hide();
    document.getElementById("id_entry").focus();
    document.getElementById("freeformbutton").blur();
    isFreeFrom = true;
}

function uploadDocument()
{
    $("#container").show();
    $("#id_attachment").show();
    $(".letter").show();
    $(".Choice").hide();
    document.getElementById("uploaddocumentbutton").blur();
    isFreeFrom:false;
}


function sendMotivation()
{
    var img, reader, file;
    var entry = document.getElementById("id_entry");
    var form = document.getElementById("id_attachment");
    document.getElementById("letterbutton").blur();
    var formdata;
    var uploadURL = "";
    if (window.FormData)
    {
        formdata = new FormData();

    }

    if(isFreeFrom)
    {
        uploadURL = "/uploadmotivation/{{game.uid}}/";
    }
    else
    {
      uploadURL = "/uploadfilemotivation/{{game.uid}}/";
          for ( i=0, len=form.files.length; i < len; i++)
          {
                file = form.files[i];
        
                if (window.FileReader)
                {
                    reader = new FileReader();
                    reader.onloadend = function (e)
                    { 
                        showUploadedItem(e.target.result, file.fileName);
                    };
                    reader.readAsDataURL(file);
                }
                if (formdata)
                {
                    formdata.append('title', "CV");
                    formdata.append('document', file);
                }
        }  
    } 

    

    if(entry.value.length > 0)
    {
        formdata.append('entry',entry.value);
    }


    if (formdata)
    {
        $.ajax({
            url: uploadURL,
            type: "POST",
            data: formdata,
            processData: false,
            contentType: false,
            success: function (res)
            {
                response = JSON.parse(res);
               // text = response['motivation']['result'];
                window.state.update('has_motivation', 'True');
                var game = window.game.crafty.pause(false);
                window.quest_log.update();
                $("#container").hide();
                $("#id_attachment").hide();
                $(".letter").hide();
                $("#id_entry").hide();

            }
        });
    }

}
        
function sendContactInfo()
{
    var name = document.getElementById("id_name");
    var email = document.getElementById("id_email");
    document.getElementById("contactButton").blur();
    if (window.FormData)
    {
        formdata = new FormData();
        formdata.append('name', name.value);
        formdata.append('email', email.value);
        //formdata.append('email', $("#id_email").val()) 
    }

       if (formdata) 
       {
        $.ajax({
            url: "/uploadcontact/{{game.uid}}/",
            type: "POST",
            data: formdata,
            processData: false,
            contentType: false,
             success: function (res)
             {
                //response = JSON.parse(res)

                //text = response['contact']['result'];
                //$("#info_div").html(text);
                //if (text.indexOf("Thx") !== -1){
                    //window.game = crafty();
                    //var game = window.game.crafty.init(900, 600);
                   
                    //$("#myinfo").hide();
                    $(".form").hide();
                    $("#container").hide();
                    window.state.update('player_name', name.value);
                    var game = window.game.crafty.pause(false);
                    window.quest_log.update();
                    
                    //remo       
                //} 

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
    document.getElementById("cvButton").blur();
    form = document.getElementById("id_document");
  //document.getElementById("success_div").innerHTML = "Uploading . . ."
        var img, reader, file;
        formdata = new FormData();
      
        for ( i=0, len=form.files.length; i < len; i++) 
        {
            file = form.files[i];
    
            if (window.FileReader)
            {
                reader = new FileReader();
                reader.onloadend = function (e)
                { 
                    showUploadedItem(e.target.result, file.fileName);
                };
                reader.readAsDataURL(file);
            }
            if (formdata)
            {
                formdata.append('title', "CV");
                formdata.append('document', file);
            }
        }
    
        if (formdata)
        {
            $.ajax({
                url: "/submitfile/{{game.uid}}/",
                type: "POST",
                data: formdata,
                processData: false,
                contentType: false,
                success: function (res)
                {
                    response = JSON.parse(res);
                    $("#container").hide();
                    $(".form2").hide();
                    window.state.update('has_cv', 'True');
                    var game = window.game.crafty.pause(false);
                    window.quest_log.update()
                }
            });
        }
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
          console.log("sendQuest");
          console.log(id)
         
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