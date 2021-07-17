var isLogedin = false;
var loggedusername = "";

// make request to get username
function checklogin_initalfunction(run) {
    var url = "https://gcl-database.herokuapp.com/current_username";

    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status == 200) {

            loggedusername = xhr.responseText;
            if (xhr.responseText !== "") {
                isLogedin = true;
            }
            run();
        } else {
            //if server stops working
        }

    };

    xhr.send();
}
//change login button to username if logged in
function changenavbar() {
    if (isLogedin) {
        $('#jsnavlogin').html('<i class="fas fa-sign-in-alt mr-2"></i>' + loggedusername);
    }
}
