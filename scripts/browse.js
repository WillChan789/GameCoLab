//stuff that needs to check if you logged in at that start
//not for buttons, for UI and navbar
function initiallogincheck() {
    changenavbar();
    if (isLogedin) {
        //do stuff
    } else {

    }
}

//function to insert card into html from array and id
function insertcard(postsarray, tempid, i) {
    var columnid = "#" + tempid + "a";
    $(columnid).append('<div id = "' + tempid + 'b" class="card"></div>');
    var cardid = "#" + tempid + "b";
    $(cardid).append('<a href="https://gcl-database.herokuapp.com/post/' + tempid + '" id="' + tempid + 'link"></a>');
    var cardlinkid = "#" + tempid + "link";
    $(cardlinkid).append('<div class="view overlay" id="' + tempid + 'c"></div>');
    var cardimgid = "#" + tempid + "c";
    $(cardimgid).append('<img src="../ui/img/placeholder.png" class="card-img-top" id="' + tempid + 'img" alt="">');
    $(cardimgid).append('<div class="mask rgba-white-slight"></div>');
    $(cardid).append('<div class="card-body text-center" id="' + tempid + 'd"></div>');
    var cardbodyid = "#" + tempid + "d";
    $(cardbodyid).append('<h5 class="grey-text" id="' + tempid + 'tags">' + postsarray[i].Tags + '</h5>');
    $(cardbodyid).append('<a href="https://gcl-database.herokuapp.com/post/' + tempid + '" id="' + tempid + 'textlink"></a>')
    var cardtextlinkid = "#" + tempid + "textlink";
    $(cardtextlinkid).append('<h5><strong><span class="dark-grey-text" id="' + tempid + 'name">' + postsarray[i].Post_Name + '</span></strong></h5>');
    $(cardbodyid).append('<h4 class="font-weight-bold blue-text"><strong class="jsprice" id="' + tempid + 'price">$' + postsarray[i].Price + '</strong></h4>');
    if (postsarray[i].File_info === "image") {
        var imgid = "#" + tempid + "img";
        $(imgid).attr("src", "../" + postsarray[i].File_location);
    }
}

//loop to insert cards
function insertloop(arraystart, arrayend, postsarray) {
    $(".prow1").empty();
    $(".prow2").empty();
    var countperrow = 0;
    for (var i = arraystart; i < arrayend; i++) {
        var tempid = postsarray[i].Post_ID;
        //console.log(tempid);
        if (countperrow < 4) {
            $(".prow1").append('<div class="col-lg-3 col-md-6 mb-4" id="' + tempid + 'a"></div>');
            insertcard(postsarray, tempid, i);
            countperrow++;
        } else if (countperrow >= 4) {
            $(".prow2").append('<div class="col-lg-3 col-md-6 mb-4" id="' + tempid + 'a"></div>');
            insertcard(postsarray, tempid, i);
            countperrow++;
        }
    }
    if (postsarray.length !== 0) {
        var newid = postsarray[postsarray.length - 1].Post_ID;
        var newcardid = "#" + newid + "name";
        $(newcardid).append('<span class="badge badge-pill danger-color">NEW</span>');
    }
}

//loop to insert pages
function insertpages(numpages, current) {
    $(".pagination").empty();
    $(".pagination").append('<li class="page-item disabled"><a class="page-link" href="#" aria-label="Previous"><span aria-hidden="true">&laquo;</span><span class="sr-only">Previous</span></a></li>');
    for (var n = 0; n < numpages; n++) {
        if (n == 0) {
            $(".pagination").append('<li class="page-item" id="lpage1"><span class="page-link pages" id="page1">1</span></li>');
        } else {
            var pn = n + 1;
            $(".pagination").append('<li class="page-item" id="lpage' + pn + '"><span class="page-link pages" id="page' + pn + '">' + pn + '</span></li>');
        }
    }
    $(".pagination").append('<li class="page-item disabled"><a class="page-link" href="#" aria-label="Next"><span aria-hidden="true">&raquo;</span><span class="sr-only">Next</span></a></li>');
    var currentid = "#page" + current;
    $(currentid).append('<span class="sr-only">(current)</span>');
    var currentid2 = "#lpage" + current;
    var oldclass = $(currentid2).attr("class");
    $(currentid2).attr("class", oldclass + " active")
    //console.log("done");
}

//on load setup
$(function() {
    checklogin_initalfunction(initiallogincheck);
    var url = "https://gcl-database.herokuapp.com/api/posts/";

    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status == 200) {
            var postsarray = JSON.parse(xhr.responseText);
            var numpages = Math.ceil(postsarray.length / 8);
            if (postsarray.length >= 8) {
                insertloop(0, 8, postsarray);
            } else {
                insertloop(0, postsarray.length, postsarray);
            }
            insertpages(numpages, 1);


            $(document).on('click', ".pages", function() {
                var pn = $(this).text();
                var pn2 = pn.replace(/\D+$/g, "");
                //console.log("pn2", pn2);

                var maxarrayend = pn2 * 8;
                var arraystart = maxarrayend - 8;
                if (numpages == pn2 && postsarray.length % 8 !== 0) {
                    var arrayend = arraystart + postsarray.length % 8;
                } else {
                    var arrayend = maxarrayend;
                }
                //console.log("end", arrayend);
                //console.log("start", arraystart);

                insertloop(arraystart, arrayend, postsarray);
                insertpages(numpages, pn2);
            });

        } else {
            //console.log("error");
        }


    };

    xhr.send();


    //on search setup
    $(".searchform").submit(function(event) {
        var searchterm = $(".search").val();
        //console.log(searchterm);
        var url = "https://gcl-database.herokuapp.com/api/posts/?Post_Name=" + searchterm;
        //console.log(url);
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url);

        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status == 200) {
                var postsarray = JSON.parse(xhr.responseText);
                var numpages = Math.ceil(postsarray.length / 8);

                if (postsarray.length >= 8) {
                    insertloop(0, 8, postsarray);
                } else {
                    insertloop(0, postsarray.length, postsarray);
                }
                insertpages(numpages, 1);

                $(document).on('click', ".pages", function() {
                    var pn = $(this).text();
                    var pn2 = pn.replace(/\D+$/g, "");
                    //console.log("pn2", pn2);
                    //console.log("pages", numpages);
                    var maxarrayend = pn2 * 8;
                    var arraystart = maxarrayend - 8;
                    if (numpages == pn2 && postsarray.length % 8 !== 0) {
                        var arrayend = arraystart + postsarray.length % 8;
                    } else {
                        var arrayend = maxarrayend;
                    }
                    //console.log("end", arrayend);
                    //console.log("start", arraystart);

                    insertloop(arraystart, arrayend, postsarray);
                    insertpages(numpages, pn2);
                });
            }
        };

        xhr.send();
        event.preventDefault();


    });

});
