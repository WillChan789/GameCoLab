//stuff that needs to check if you logged in at that start

var stripeconnected = false;
// check for username
function initiallogincheck() {
    changenavbar();
    if (isLogedin) {
        var url = "https://gcl-database.herokuapp.com/stripeidexists";
        var xhr = new XMLHttpRequest();
        xhr.open("Get", url);

        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                //console.log(xhr.status);
                //console.log(xhr.responseText);
                //console.log("working?");
                if (xhr.responseText != "true") {
                    //console.log("this ran");
                    $("#jsneedstripe").html("You need to connect to stripe in settings to set prices.");
                } else {
                    stripeconnected = true;
                }
            }
        };

        xhr.send();
    }
}
//setup page to end details of pot to server to create products
$(function() {
    checklogin_initalfunction(initiallogincheck);
    $(".subbtn").click(function() {

        var url = "https://gcl-database.herokuapp.com/api/posts";
        var str;

        var xhr = new XMLHttpRequest();
        xhr.open("POST", url);

        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status == 200) {
                var myObj = JSON.parse(xhr.responseText);
                var xhr2 = new XMLHttpRequest();
                xhr2.open("POST", "/makeproduct");

                xhr2.setRequestHeader("Content-Type", "application/json");
                xhr2.onreadystatechange = function() {
                    if (xhr2.readyState === 4 && xhr2.status == 200) {
                        var myObj = JSON.parse(xhr2.responseText);
                        //console.log(xhr.responseText);
                        //console.log(myObj.message);
                        str = myObj.message;
                        str = str.split(" ")[3];
                        //console.log(str);
                        //$(".user").text(str);
                    }
                };

                var postname = $("#postname").val();
                if (stripeconnected) {
                    var price = $("#price").val();

                    var data2 = '{"Post_Name": "' + postname + '", "Price": "' + price + '"}';
                } else {
                    alert("You must connect a stripe account to sell items. ");
                    return;
                }

                console.log(data2);
                xhr2.send(data2);
            }
        };

        var postname = $("#postname").val();
        // can change loc later
        var fileloc = "/items/" + $("#fileupload").val().split("\\")[2];
        var filetype = $("#filetype").val();
        var desc = $("#description").val();
        var tags = $("#tags").val();
        var price = $("#price").val();
        if (price <= 0.49 && price > 0) {
            alert("Minimum price is 0.50 or type 0.00 for it to be free.");
            return;
        }

        var data = '{"Post_Name": "' + postname + '", "File_location": "' + fileloc + '", "File_Info": "' + filetype + '", "Post_Desc": "' + desc + '", "Tags": "' + tags + '", "Price": "' + price + '"}';
        console.log(data);
        xhr.send(data);


        $("#uploadForm").submit();
    });



});
