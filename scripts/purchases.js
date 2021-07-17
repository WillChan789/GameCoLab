//stuff that needs to check if you logged in at that start

function initiallogincheck() {
    changenavbar();
    if (isLogedin) {
        //do stuff
    } else {

    }
}
//insert card to html page for each purchase
function insertcard(postarray, i) {
    if (i == postarray.length) {
        return;
    }
    var tempid = postarray[i].Post_ID;
    var url2 = "https://gcl-database.herokuapp.com/api/posts/" + tempid;
    var xhr2 = new XMLHttpRequest();
    xhr2.open("GET", url2);

    xhr2.onreadystatechange = function() {
        if (xhr2.readyState === 4 && xhr2.status == 200) {
            //console.log(xhr2.responseText);
            var postinfo = JSON.parse(xhr2.responseText);
            var tempname = postinfo[0].Post_Name;
            var tempid2 = postinfo[0].Post_ID;
            var identifier = "#" + tempid2;
            $(".posts").append('<div class="col-md-12 mb-4" id="' + tempid2 + '"></div>');
            $(identifier).append('<div class="card" id="' + tempid2 + 'a"></div>');
            var cardbodyid = "#" + tempid2 + "a";
            $(cardbodyid).append('<div class="card-body" id="' + tempid2 + 'b"></div>');
            var contentid = "#" + tempid2 + "b";
            $(contentid).append('<img src="../ui/img/placeholder.png" alt="" class="img" id="' + tempid2 + 'c">');
            $(contentid).append('<a href="https://gcl-database.herokuapp.com/post/' + tempid2 + '" id="' + tempid2 + 'e" class="pnlink"></a>');
            var nameid = "#" + tempid2 + "e";
            $(nameid).append('<span class="item-name">' + tempname + '</span>');
            $(contentid).append('<a href="../' + postinfo[0].File_location + '" id="' + tempid2 + 'd" download></a>');
            var buttonid = "#" + tempid2 + "d";
            $(buttonid).append('<button type="button" name="button" class="btn btn-blue download">Download</button>');
            if (postinfo[0].File_info == "image") {
                var imgid = "#" + tempid2 + "c";
                $(imgid).attr("src", ".." + postinfo[0].File_location);
            }
            insertcard(postarray, i + 1);

        }
    };

    xhr2.send();


}
//get user's purchases
$(function() {
    checklogin_initalfunction(initiallogincheck);

    var url = "https://gcl-database.herokuapp.com/api/purchased";

    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status == 200) {
            //console.log(xhr.responseText);
            var postarray = JSON.parse(xhr.responseText);
            if (postarray.length > 4) {
                $(".page-footer").css("position", "relative");
            }
            //console.log(postarray.length);
            insertcard(postarray, 0);

        }
    };

    xhr.send();

});
