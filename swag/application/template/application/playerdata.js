function sendMotivation()
{

    var entry = document.getElementById("id_entry");
    console.log(entry)
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
                response = JSON.parse(res),
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
	{% if contact_info == 'no' %}

    var email = document.getElementById("id_email");
    var name = document.getElementById("id_name");

    if (window.FormData) {
        formdata = new FormData();
        formdata.append('name', name.value);
        formdata.append('email', email.value);
        formdata.append('email', $("#id_email").val()) 
    }


    if (formdata) {
        $.ajax({
            url: "/uploadcontact/{{game.uid}}/",
            type: "POST",
            data: formdata,
            processData: false,
            contentType: false,
            success: function (res) {
                response = JSON.parse(res),
                text = response['contact']['result'];
                $("#info_div").html(text);
                if (text.indexOf("Thx") !== -1){
                    window.game = crafty();
                    var game = window.game.crafty.init(900, 600);
                   
                    $("#myinfo").hide();
                    $("#container").hide();
                    
                }    
            }
        });
    }

    {%else %}
    return true;

    {% endif %}
}


$(document).ready(function() {
	{% if contact_info == 'yes' %}
        window.game = crafty();
        var game = window.game.crafty.init(900, 600);

	{% endif %}

    (function () {
    var input = document.getElementById("id_document"), 
        formdata = false;
        
    function showUploadedItem (source) {
        return true;
    }   

    if (window.FormData) {
        formdata = new FormData();

        document.getElementById("upload_btn").style.display = "none";

    }
    


    input.addEventListener("change", function (evt) {
        document.getElementById("success_div").innerHTML = "Uploading . . ."
        var img, reader, file;

        for ( i=0, len=this.files.length; i < len; i++   ) {
            file = this.files[i];
    
            if ( window.FileReader ) {
                reader = new FileReader();
                reader.onloadend = function (e) { 
                    showUploadedItem(e.target.result, file.fileName);
                };
                reader.readAsDataURL(file);
            }
            if (formdata) {
                formdata.append('title', document.getElementById('id_document').value)
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
                    document.getElementById("success_div").innerHTML = response['file_upload']['result']; 
                        $("#myform").hide();
                        $("#container").hide();
                        
                }
            });
        }
    }, false);
    
    }());

});