//stuff that needs to check if you logged in at that start

function initiallogincheck() {
    changenavbar();
    //check if your following this person
}
//loading other user's follows and profile
function insertcard(post) {

    //console.log(post);

    var tempname = post.Post_Name;
    var tempid2 = post.Post_ID;
    var identifier = "#" + tempid2;
    $(".posts").append('<div class="col-md-12 mb-4" id="' + tempid2 + '"></div>');
    $(identifier).append('<div class="card" id="' + tempid2 + 'a"></div>');
    var cardbodyid = "#" + tempid2 + "a";
    $(cardbodyid).append('<div class="card-body" id="' + tempid2 + 'b"></div>');
    var contentid = "#" + tempid2 + "b";
    $(contentid).append('<img style="max-height: 100px ;" src="../ui/img/placeholder.png" alt="" class="img" id="' + tempid2 + 'c">');
    $(contentid).append('<a href="https://gcl-database.herokuapp.com/post/' + tempid2 + '" id="' + tempid2 + 'e" class="pnlink"></a>');
    var nameid = "#" + tempid2 + "e";
    $(nameid).append('<span class="item-name">' + tempname + '</span>');

    if (post.File_info == "image") {
        var imgid = "#" + tempid2 + "c";
        $(imgid).attr("src", "../" + post.File_location);
    }

}
//function used by followbtn, change button to follow
function followbtnfunc1(fname) {
    var urlfollow = "https://gcl-database.herokuapp.com/api/account/" + fname + "/following";
    var xhrfollow = new XMLHttpRequest();
    xhrfollow.open("POST", urlfollow);

    xhrfollow.setRequestHeader("Content-Type", "application/json");
    xhrfollow.onreadystatechange = function() {
        if (xhrfollow.readyState === 4 && xhrfollow.status === 200) {
            //console.log(xhrfollow.responseText);
            //alert( "you are following "+fname );
            followbtn(fname);
        }
    };

    //var data = '{""}';

    xhrfollow.send();
}
//function used by followbtn, change button to unfollow
function followbtnfunc2(fname) {
    var url = "https://gcl-database.herokuapp.com/api/account/" + fname + "/following";

    var xhr = new XMLHttpRequest();
    xhr.open("DELETE", url);

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            //console.log(xhr.status);
            //console.log(xhr.responseText);
            followbtn(fname);
        }
    };

    xhr.send();
}
//change follow button based on follow relation
function followbtn(fname) {
    if (isLogedin) {
        var urlcheck = "https://gcl-database.herokuapp.com/api/account/" + fname + "/following/check";
        var xhrcheck = new XMLHttpRequest();
        xhrcheck.open("GET", urlcheck);

        xhrcheck.setRequestHeader("Content-Type", "application/json");
        xhrcheck.onreadystatechange = function() {
            if (xhrcheck.readyState === 4 && xhrcheck.status === 200) {
                //console.log(xhrcheck.responseText);
                //console.log(xhrcheck.responseText.length);
                if (xhrcheck.responseText == "[]") {
                    $("#jsfollowbtn").text("follow");
                    $("#jsfollowbtn").css("background", "blue");
                    $("#jsfollowbtn").attr("onclick", "followbtnfunc1('" + fname + "')");
                } else {
                    $("#jsfollowbtn").text("unfollow");
                    $("#jsfollowbtn").css("background", "white");
                    $("#jsfollowbtn").attr("onclick", "followbtnfunc2('" + fname + "')");
                }
            }
        };

        xhrcheck.send();

    } else {
        $("#jsfollowbtn").click(function() {
            window.location.replace("https://gcl-database.herokuapp.com/login");
        });
    }
}
$(function() {

    checklogin_initalfunction(initiallogincheck);

    var prourl = document.URL;
    var proname = prourl.substring(prourl.lastIndexOf('/') + 1);
    //console.log(proname);
    console.log($(".avatarp").text());

    var url = "https://gcl-database.herokuapp.com/api/account/" + proname + "/profile";

    var xhr = new XMLHttpRequest();
    xhr.open("Get", url);

    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status == 200) {
            //console.log(xhr.status);
            //console.log(xhr.responseText);

            var profile = JSON.parse(xhr.responseText)[0];
            if (profile === undefined) {
                console.log("redirect");
                window.location.replace("https://gcl-database.herokuapp.com");
            }
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
            followbtn(profile.Username);
            if (profile.Profile_Description === null) {
                $('#jsuserdesc').text("no profile description");
            } else {
                $('#jsuserdesc').text(profile.Profile_Description);
            }
        }
    };

    xhr.send();

    var url2 = "https://gcl-database.herokuapp.com/api/account/" + proname + "/following";

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
        }
    };

    xhr2.send();
    var url3 = "https://gcl-database.herokuapp.com/api/account/" + proname + "/following/followers";

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
        }
    };

    xhr3.send();

    var url4 = "https://gcl-database.herokuapp.com/api/posts/user/" + proname;

    var xhr4 = new XMLHttpRequest();
    xhr4.open("Get", url4);

    xhr4.setRequestHeader("Content-Type", "application/json");

    xhr4.onreadystatechange = function() {
        if (xhr4.readyState === 4 && xhr4.status == 200) {
            //console.log(xhr4.status);
            //console.log(xhr4.responseText);
            var posts = JSON.parse(xhr4.responseText);
            //console.log(posts);
            if (posts.length !== 0) {
                $(".page-footer").css("position", "relative");
            }
            $('#jspostcount').text(posts.length);

            for (let i = 0; i < posts.length; i++) {
                //console.log("i, ", i);
                var temppost = posts[i];

                insertcard(temppost);

            }


        }
    };

    xhr4.send();

});
