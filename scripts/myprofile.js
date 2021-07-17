//stuff that needs to check if you logged in at that start

//setup to get user follows and profile
function initiallogincheck() {
    changenavbar();
    var url = "https://gcl-database.herokuapp.com/api/account/" + loggedusername + "/profile";

    var xhr = new XMLHttpRequest();
    xhr.open("Get", url);

    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status == 200) {
            //console.log(xhr.status);
            //console.log(xhr.responseText);
            var profile = JSON.parse(xhr.responseText)[0];
            //console.log(profile);
            if (profile.Avatar !== null) {
                $('.avatarp').text(profile.Avatar);
                if (profile.Avatar == "Game Developer") {
                    $('.avatarimg').attr('src', '../ui/img/gamedevavatar.png');
                } else if (profile.Avatar == "Artist") {
                    $('.avatarimg').attr('src', '../ui/img/artistavatar.png');
                } else if (profile.Avatar == "Investor") {
                    $('.avatarimg').attr('src', '../ui/img/investoravatar.png');
                }
            }
            $('#jsnamehere').text(profile.Username);
            //console.log(profile.Username);
            if (profile.Profile_Description === null) {
                $('#jsuserdesc').text("no profile description");
            } else {
                $('#jsuserdesc').text(profile.Profile_Description);
            }
        }
    };

    xhr.send();

    var url2 = "https://gcl-database.herokuapp.com/api/account/" + loggedusername + "/following";

    var xhr2 = new XMLHttpRequest();
    xhr2.open("Get", url2);

    xhr2.setRequestHeader("Content-Type", "application/json");

    xhr2.onreadystatechange = function() {
        if (xhr2.readyState === 4 && xhr2.status == 200) {
            //console.log(xhr2.status);
            //console.log(xhr2.responseText);
            var following = JSON.parse(xhr2.responseText);
            //console.log(following);
            $('#jsfollowingcount').text(following.length);
            for (var i = 0; i < following.length; i++) {
                $('#jsfollowinglist').append('<li><a href="https://gcl-database.herokuapp.com/profile/' + following[i].User_Follows + '">' + following[i].User_Follows + '</a></li>');
            }
        }
    };

    xhr2.send();

    var url3 = "https://gcl-database.herokuapp.com/api/account/" + loggedusername + "/following/followers";

    var xhr3 = new XMLHttpRequest();
    xhr3.open("Get", url3);

    xhr3.setRequestHeader("Content-Type", "application/json");

    xhr3.onreadystatechange = function() {
        if (xhr3.readyState === 4 && xhr3.status == 200) {
            //console.log(xhr3.status);
            //console.log(xhr3.responseText);
            var followers = JSON.parse(xhr3.responseText);
            //console.log(followers);
            $('#jsfollowersgcount').text(followers.length);
            for (var i = 0; i < followers.length; i++) {
                $('#jsfollowerlist').append('<li><a href="https://gcl-database.herokuapp.com/profile/' + followers[i].Username + '">' + followers[i].Username + '</a></li>');
            }
        }
    };

    xhr3.send();

    var url4 = "https://gcl-database.herokuapp.com/api/posts/user/" + loggedusername;

    var xhr4 = new XMLHttpRequest();
    xhr4.open("Get", url4);

    xhr4.setRequestHeader("Content-Type", "application/json");

    xhr4.onreadystatechange = function() {
        if (xhr4.readyState === 4 && xhr4.status == 200) {
            //console.log(xhr4.status);
            //console.log(xhr4.responseText);
            var posts = JSON.parse(xhr4.responseText);

            //console.log(posts);
            $('#jspostcount').text(posts.length);
        }
    };

    xhr4.send();

    var urlpoints = "https://gcl-database.herokuapp.com/api/account/" + loggedusername + "/points";

    var xhrpoints = new XMLHttpRequest();
    xhrpoints.open("Get", urlpoints);

    xhrpoints.setRequestHeader("Content-Type", "application/json");

    xhrpoints.onreadystatechange = function() {
        if (xhrpoints.readyState === 4 && xhrpoints.status === 200) {
            //console.log(xhrpoints.status);
            //console.log(xhrpoints.responseText);
            currentpoints = JSON.parse(xhrpoints.responseText)[0].Points;
            $('#jscurrentpoints').text(currentpoints + " Points");
        }
    };

    xhrpoints.send();
}

$(function() {

    checklogin_initalfunction(initiallogincheck);
    $("#editaboutbox").hide();
    $("#editabout").click(function() {
        $("#jsuserdesc").hide();
        $("#editaboutbox").show();
        $("#editabout").text("update");
        $("#editabout").click(function() {
            var update = $("#editabouttext").val().replace(/\n/g, "<br>");
            var url = "https://gcl-database.herokuapp.com/api/account";

            var xhr = new XMLHttpRequest();
            xhr.open("PUT", url);

            xhr.setRequestHeader("Content-Type", "application/json");

            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    //console.log(xhr.responseText);
                    window.location.reload(true);
                }
            };

            var data = '{"bio": "' + update + '"}';

            xhr.send(data);
        });
    });

});
