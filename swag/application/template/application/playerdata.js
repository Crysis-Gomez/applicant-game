function sendMotivation()
{

    var entry = document.getElementById("id_entry");
    var formdata;

    console.log(entry);
    if (window.FormData) {
        formdata = new FormData();
        formdata.append('entry',entry.value);
    }


    if (formdata) {
        $.ajax({
            url: "/uploadmotivation/{{game.uid}}/",
            type: "POST",
            data: formdata,
            processData: false,
            contentType: false,
            success: function (res) {
                response = JSON.parse(res);
                text = response['motivation']['result'];
  
                var game = window.game.crafty.init(900, 600);

                   $(".container").hide();
                   $(".letter").hide();

            }
        });
    }

}
        
function sendContactInfo()
{
    var name = document.getElementById("id_name");
    var email = document.getElementById("id_email");

    if (window.FormData) {
        formdata = new FormData();
        formdata.append('name', name.value);
        formdata.append('email', email.value);
        //formdata.append('email', $("#id_email").val()) 
    }

       if (formdata) {
        $.ajax({
            url: "/uploadcontact/{{game.uid}}/",
            type: "POST",
            data: formdata,
            processData: false,
            contentType: false,
             success: function (res) {
                //response = JSON.parse(res)

                //text = response['contact']['result'];
                //$("#info_div").html(text);
                //if (text.indexOf("Thx") !== -1){
                    //window.game = crafty();
                    //var game = window.game.crafty.init(900, 600);
                   
                    //$("#myinfo").hide();
                    $(".form").hide();
                    $("#container").hide();
                    window.state.update('name', name.value);
                    var game = window.game.crafty.pause(false);
                    
                    document.getElementById("contactButton").blur();
                    //remo       
                //} 

            }
        });
    }

}

function showUploadedItem (source) {
        return true;
}

function restartCrafty(){

    console.log("restartCrafty");
    var game = window.game.crafty.init(900, 600);
}   

function sendFiles(){

  form = document.getElementById("id_document");
  //document.getElementById("success_div").innerHTML = "Uploading . . ."
        console.log("SENDING FILES");
        var img, reader, file;
        formdata = new FormData();
      
        for ( i=0, len=form.files.length; i < len; i++   ) {
            file = form.files[i];
    
            if ( window.FileReader ) {
                reader = new FileReader();
                reader.onloadend = function (e) { 
                    showUploadedItem(e.target.result, file.fileName);
                };
                reader.readAsDataURL(file);
            }
            if (formdata) {
                formdata.append('title', "CV");
                formdata.append('document', file);
            }
        }
    
        if (formdata) {
            $.ajax({
                url: "/submitfile/{{game.uid}}/",
                type: "POST",
                data: formdata,
                processData: false,
                contentType: false,
                success: function (res) {
                    response = JSON.parse(res);
                    console.log(response);
                    $("#container").hide();
                    $(".form2").hide();
                    window.state.update('has_cv', 'True');
                    var game = window.game.crafty.pause(false);
                    //document.getElementById("cvButton").blur();
                    //document.getElementById("success_div").innerHTML = response['file_upload']['result']; 
                        // $(hide_id).hide();
                        // $("#container").hide();
                        // $(".letter").hide();
                        // $(".form").hide();
                        // $(".form2").hide();
             
                        // if(callback)callback();
                        
                }
            });
        }
}

$(document).ready(function() {
     window.game = crafty();
     var game = window.game.crafty.init(900, 600);
    {% if contact_info == 'yes' %}
       

    {% endif %}

    (function () {

    //var input2 = document.getElementById("id_attachment"),
        //formdata = false;
        
    function showUploadedItem (source) {
        return true;
    }   

    if (window.FormData) {
        formdata = new FormData();

    }

    }());

});