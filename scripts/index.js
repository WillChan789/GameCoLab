//stuff that needs to check if you logged in at that start

function initiallogincheck() {
    changenavbar();
    if (isLogedin) {
        //do stuff
    } else {

    }
}

//load first 6 posts to display
$(function() {
    checklogin_initalfunction(initiallogincheck);
    var url = "https://gcl-database.herokuapp.com/api/posts/";

    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status == 200) {
            //console.log(xhr.status);
            //console.log(xhr.responseText);
            var myObj = JSON.parse(xhr.responseText);
            //console.log(myObj);

            for (var i = 0; i < myObj.length && i < 6; i++) {
                var doc = document.getElementById("jsc" + i);
                //console.log("jsc"+ i);
                if (myObj[i].File_info !== "model") {
                    (doc.getElementsByClassName("card-img-top")[0]).src = "../" + myObj[i].File_location;
                }

                (doc.getElementsByClassName("jslink")[0]).href = "https://gcl-database.herokuapp.com/post/" + myObj[i].Post_ID;
                (doc.getElementsByClassName("card-title")[0]).innerHTML = myObj[i].Post_Name;
                (doc.getElementsByClassName("jsprice")[0]).innerHTML = "$" + myObj[i].Price;
                (doc.getElementsByClassName("card-text")[0]).innerHTML = myObj[i].Post_Description;

            }

        } else {
            //console.log("error");
        }


    };

    xhr.send();

});
