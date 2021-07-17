//stuff that needs to check if you logged in at that start

//check for stripe id
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
                if (xhr.responseText == "true") {
                    $('#jsconnectcheck').text("You're connected to stripe.");
                }
            }
        };

        xhr.send();
    }
}
//initiate onboard when clicked
$(function() {
    checklogin_initalfunction(initiallogincheck);
    let elmButton = document.querySelector("#onboard");

    if (elmButton) {
        elmButton.addEventListener(
            "click",
            e => {
                elmButton.setAttribute("disabled", "disabled");
                elmButton.textContent = "Opening...";

                fetch("/onboard-user", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        }
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.url) {
                            window.location = data.url
                            //console.log("data", data);

                        } else {
                            elmButton.removeAttribute("disabled");
                            elmButton.textContent = "<Something went wrong>";
                            //console.log("data", data);
                        }
                    });
            },
            false
        );
    }

    $(document).on("click", ".avatartext", function() {
        var avatar = $(this).text();
        $(".avatartext").css("background", "none");
        $(this).css("background", "lightblue");

        $("#savebutton").click(function() {
            var url = "https://gcl-database.herokuapp.com/api/account";

            var xhr = new XMLHttpRequest();
            xhr.open("PUT", url);

            xhr.setRequestHeader("Content-Type", "application/json");

            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4 && xhr.status == 200) {
                    console.log(xhr.responseText);
                }
            };

            var data = '{"avatar": "' + avatar + '"}';

            xhr.send(data);
        });
    });

    $("#closebutton").click(function() {
        $(".avatartext").css("background", "none");
    });

    $(".close").click(function() {
        $(".avatartext").css("background", "none");
    });

});
