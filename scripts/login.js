//stuff that needs to check if you logged in at that start
function initiallogincheck() {
    changenavbar();
    //check login, give button to logout and hide button if logged in
    if (isLogedin) {
        $("#jslogstatus").html("Logged in as " + loggedusername);
        $(".login").text("logout");
        $(".login").click(function() {

            var url = "https://gcl-database.herokuapp.com/api/logout";

            var xhr = new XMLHttpRequest();
            xhr.open("GET", url);

            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4 && xhr.status == 200) {
                    window.location = "https://gcl-database.herokuapp.com/login";
                }
            };

            xhr.send();

        });
        $(".hideiflog").hide();
    } else {
        $(".login").click(function() {

            var url = "https://gcl-database.herokuapp.com/api/login";
            var str;

            var xhr = new XMLHttpRequest();
            xhr.open("POST", url);

            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    //console.log('readystate change and 200');
                    window.location = "https://gcl-database.herokuapp.com/profile";
                    var myObj = JSON.parse(xhr.responseText);
                    //console.log(xhr.responseText);
                    //console.log(myObj.message);
                    str = myObj.message;
                    str = str.split(" ")[3];
                    //console.log(str);
                    //$(".user").text(str);
                } else if (xhr.readyState === 4 && xhr.status === 422) {
                    alert("incorrect username or password.");
                }

            };

            var user = $("#username").val();
            var pass = $("#password").val();
            //console.log(user);
            //console.log(pass);

            var data = '{"username": "' + user + '", "password": "' + pass + '"}';
            //console.log(data);
            //console.log('before send');
            xhr.send(data);
            //console.log('data sent');
        });
    }
}

//wait for register and login/logout
$(function() {
    checklogin_initalfunction(initiallogincheck);


    $(".register").click(function() {

        var url = "https://gcl-database.herokuapp.com/api/register";
        var str;

        var xhr = new XMLHttpRequest();
        xhr.open("POST", url);

        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                window.location = "https://gcl-database.herokuapp.com/profile";

                var myObj = JSON.parse(xhr.responseText);
                var url2 = "https://gcl-database.herokuapp.com/api/account";

                var xhr2 = new XMLHttpRequest();
                xhr2.open("PUT", url2);

                xhr2.setRequestHeader("Content-Type", "application/json");

                xhr2.onreadystatechange = function() {
                    if (xhr2.readyState === 4 && xhr2.status == 200) {
                        console.log(xhr2.responseText);
                    }
                };

                var data2 = '{"ach": "Register Account"}';

                xhr2.send(data2);
            } else if (xhr.readyState === 4 && xhr.status === 400) {
                alert("Username is already taken.");
            }
        };

        var user = $("#username").val();
        var pass = $("#password").val();

        var data = '{"username": "' + user + '", "password": "' + pass + '"}';

        xhr.send(data);
    });

});
