var tempcreator;
var currentpoints = 0;
var firstcheck = true;
//stuff that needs to check if you logged in at that start

//check for username and if logged in
function initiallogincheck() {
    changenavbar();
    if (isLogedin) {
        var url2 = "https://gcl-database.herokuapp.com/api/account/" + loggedusername + "/points";

        var xhr2 = new XMLHttpRequest();
        xhr2.open("Get", url2);

        xhr2.setRequestHeader("Content-Type", "application/json");

        xhr2.onreadystatechange = function() {
            if (xhr2.readyState === 4 && xhr2.status == 200) {
                //console.log(xhr2.status);
                //console.log(xhr2.responseText);
                currentpoints = JSON.parse(xhr2.responseText)[0].Points;
                $('#jspoints').text("you have " + currentpoints + " points");
            }
        };

        //var data2 = '{"username": "' + usernam + '"}';

        xhr2.send();


    } else {
        //console.log("not logged in for checking points");
        $("#pbuybutton").attr("onclick", "redirecttest()");
        $("#buybutton").attr("onclick", "redirecttest()");
        firstcheck = false;
    }
}

function redirecttest() {
    window.location = "https://gcl-database.herokuapp.com/login";
}
//follow button to follow seller
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

    var url = document.URL;
    var id = url.substring(url.lastIndexOf('/') + 1);
    //console.log(id);


    var url = "https://gcl-database.herokuapp.com/api/posts/" + id;

    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status == 200) {
            //console.log(xhr.status);
            //console.log(xhr.responseText);
            var myObj = JSON.parse(xhr.responseText);
            //console.log(myObj[0]);
            postname = myObj[0].Post_Name;
            //creatername is username not nickname
            creatername = myObj[0].Username;
            tempcreator = creatername;
            fileloc = myObj[0].File_location;
            fileinfo = myObj[0].File_info;
            filedes = myObj[0].Post_Description;
            postprice = myObj[0].Price;

            $('#jsname').text(postname);
            // if price is 0 say its free
            $('#jsprice').text("$" + postprice);
            var pointsprice = postprice * 100;
            if (firstcheck) {
                $("#pbuybutton").attr("onclick", "pointsbuy(" + pointsprice + ")");
            }
            $("#pbuybutton").text("use " + pointsprice + " points");
            if (postprice == 0) {
                $("#buybutton").text("Download");
                if (firstcheck) {
                    $("#buybutton").attr("onclick", "pointsbuy(0)");
                }
                $("#pbuybutton").hide();
            }
            if (myObj[0].Tags == "2D") {
                $("#taglist").append('<a href=""><span class="badge purple mr-1">2D</span></a>');
            } else if (myObj[0].Tags == "3D") {
                $("#taglist").append('<a href=""><span class="badge blue mr-1">3D</span></a>');
            }
            $("#viewnum").text(myObj[0].Total_Views);
            $("#downnum").text(myObj[0].Total_Downloads);
            $('#jscrename').text(creatername);
            //document.getElementById("jscrename").href="https://gcl-database.herokuapp.com/profile/"+creatername;
            $("#jscrenamelink").attr("href", "https://gcl-database.herokuapp.com/profile/" + creatername);
            $('#jspostdesc').text(filedes);
            //$('#jsdwn').attr("href", ".." + fileloc);
            document.title = postname;
            followbtn(creatername);
            if (fileinfo == "model") {
                //glTF too small and dont have anitmations
                var temp = fileloc.split(".");
                //console.log(temp[temp.length -1]);
                if (temp[temp.length - 1] == "gltf" || temp[temp.length - 1] == "glb") {
                    var scene = new THREE.Scene();
                    var camera = new THREE.PerspectiveCamera(60, 1, 1, 1000);
                    camera.position.set(0, 0, 500);
                    var renderer = new THREE.WebGLRenderer({
                        antialias: true
                    });
                    renderer.setClearColor(0x808080);
                    var canvas = renderer.domElement;
                    document.getElementById('jscan').appendChild(canvas);
                    document.getElementById("jsimg").style.visibility = "hidden";
                    document.getElementById("jscan").style.visibility = "visible";
                    document.getElementById("jsimg").style.display = "none";
                    document.getElementById("jscan").style.display = "inline";

                    var controls = new THREE.OrbitControls(camera, renderer.domElement);

                    var light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
                    //var light = new THREE.AmbientLight(0xFFFFFF);
                    scene.add(light);
                    //console.log("added light");


                    var loader = new THREE.GLTFLoader();
                    //console.log(fileloc);

                    loader.load('..' + fileloc, function(gltf) {
                        //console.log(gltf);
                        //gltf.scene.position.z = -10;

                        gltf.scene.traverse(function(child) {
                            if (child.isMesh) {
                                child.geometry.center(); // center here
                            }
                        });

                        gltf.scene.scale.set(5, 5, 5) // scale here


                        scene.add(gltf.scene);

                    }, undefined, function(error) {

                        console.error(error);

                    });


                    render();

                    function render() {
                        if (resize(renderer)) {
                            camera.aspect = canvas.clientWidth / canvas.clientHeight;
                            camera.updateProjectionMatrix();
                        }
                        renderer.render(scene, camera);
                        requestAnimationFrame(render);
                    }

                    function resize(renderer) {
                        const canvas = renderer.domElement;
                        const width = canvas.clientWidth;
                        const height = canvas.clientHeight;
                        const needResize = canvas.width !== width || canvas.height !== height;
                        if (needResize) {
                            renderer.setSize(width, height, false);
                        }
                        return needResize;
                    }
                } else if (temp[temp.length - 1] == "fbx") {
                    /*
                var container, stats, controls;
                var camera, scene, renderer, light;

                var clock = new THREE.Clock();

                var mixers = [];

                init();
                animate();

                function init() {
                container = document.createElement('div');
                document.body.appendChild(container);

                camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
                camera.position.set(100, 200, 300);

                controls = new THREE.OrbitControls(camera, container);
                controls.target.set(0, 100, 0);
                controls.update();

                scene = new THREE.Scene();
                scene.background = new THREE.Color(0xa0a0a0);
                scene.fog = new THREE.Fog(0xa0a0a0, 200, 1000);

                light = new THREE.HemisphereLight(0xffffff, 0x444444);
                light.position.set(0, 200, 0);
                scene.add(light);

                light = new THREE.DirectionalLight(0xffffff);
                light.position.set(0, 200, 100);
                light.castShadow = true;
                light.shadow.camera.top = 180;
                light.shadow.camera.bottom = -100;
                light.shadow.camera.left = -120;
                light.shadow.camera.right = 120;
                scene.add(light);

                // scene.add( new THREE.CameraHelper( light.shadow.camera ) );

                // ground
                var mesh = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000), new THREE.MeshPhongMaterial({
                    color: 0x999999,
                    depthWrite: false
                }));
                mesh.rotation.x = -Math.PI / 2;
                mesh.receiveShadow = true;
                scene.add(mesh);

                var grid = new THREE.GridHelper(2000, 20, 0x000000, 0x000000);
                grid.material.opacity = 0.2;
                grid.material.transparent = true;
                scene.add(grid);

                // model
                var loader = new THREE.FBXLoader();
                loader.load('../items/myfile.fbx', function(object) {

                    object.mixer = new THREE.AnimationMixer(object);
                    mixers.push(object.mixer);

                    var action = object.mixer.clipAction(object.animations[0]);
                    action.play();

                    object.traverse(function(child) {

                        if (child.isMesh) {

                            child.castShadow = true;
                            child.receiveShadow = true;

                        }

                    });

                    scene.add(object);

                }, (ev) => {
                    console.log(ev);
                }, (e) => {
                    console.log(e);
                });

                renderer = new THREE.WebGLRenderer();
                renderer.setPixelRatio(window.devicePixelRatio);
                renderer.setSize(window.innerWidth, window.innerHeight);
                renderer.shadowMap.enabled = true;
                container.appendChild(renderer.domElement);

                window.addEventListener('resize', onWindowResize, false);

                // stats
                stats = new Stats();
                container.appendChild(stats.dom);

            }


            function onWindowResize() {

                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();

                renderer.setSize(window.innerWidth, window.innerHeight);

            }

            //

            function animate() {

                requestAnimationFrame(animate);

                if (mixers.length > 0) {

                    for (var i = 0; i < mixers.length; i++) {

                        mixers[i].update(clock.getDelta());

                    }

                }

                renderer.render(scene, camera);

                stats.update();

            }
            */
                } else {
                    //not supported
                }



            } else if (fileinfo == "image") {
                $('#jsimg').attr("src", ".." + fileloc);

            } else {
                //console.log("didnt get right file info");
                $('#jsimg').attr("src", "../" + fileloc);
            }
        } else if (xhr.status == 400 || xhr.status == 404) {
            window.location = "https://gcl-database.herokuapp.com";
        } else {

        }

    };

    xhr.send();







});


//function when buy button is clicked
function buy() {
    if (isLogedin) {
        var url = document.URL;
        var id = url.substring(url.lastIndexOf('/') + 1);
        //console.log(id);

        /* Handle any errors returns from Checkout  */
        var handleResult = function(result) {
            if (result.error) {
                var displayError = document.getElementById('error-message');
                displayError.textContent = result.error.message;
            }
        };

        var points = $("#jsprice").text().substring(1) * 10;
        // Create a Checkout Session with the selected quantity
        var createCheckoutSession = function() {
            return fetch('/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    quantity: 1,
                    locale: 'en',
                    postid: id,
                    seller: tempcreator,
                    points: points,
                }),
            }).then(function(result) {
                return result.json();
            });
        };

        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/config");

        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status == 200) {
                var myObj = JSON.parse(xhr.responseText);
                //console.log(myObj);
                var stripe = Stripe(myObj.publicKey);
                // Setup event handler to create a Checkout Session on submit
                createCheckoutSession().then(function(data) {
                    stripe
                        .redirectToCheckout({
                            sessionId: data.sessionId,
                        })
                        .then(handleResult);
                });
            }
        }

        var url = document.URL;
        var id = url.substring(url.lastIndexOf('/') + 1);
        //console.log(id);
        var data = '{"postid": "' + id + '"}';
        xhr.send(data);



        /*
        var temp2 = fileloc.split("/");
        downloadURI("../"+fileloc, temp2[temp2.length -1]);
		*/

    } else {
        //console.log("not logged in");
    }




};

//buying with points
function pointsbuy(neededpoints) {

    if (isLogedin) {

        if (currentpoints >= neededpoints) {
            var url = document.URL;
            var id = url.substring(url.lastIndexOf('/') + 1);
            var url4 = "https://gcl-database.herokuapp.com/api/posts/dup";
            var xhr4 = new XMLHttpRequest();
            xhr4.open("POST", url4);
            xhr4.setRequestHeader("Content-Type", "application/json");
            xhr4.onreadystatechange = function() {
                if (xhr4.readyState === 4 && xhr4.status == 200) {
                    //console.log(xhr.responseText);
                }
            };

            var data4 = '{"pid": "' + id + '"}';
            //console.log(data4);
            xhr4.send(data4);

            var url3 = "https://gcl-database.herokuapp.com/api/account/";

            var xhr3 = new XMLHttpRequest();
            xhr3.open("PUT", url3);

            xhr3.setRequestHeader("Content-Type", "application/json");

            xhr3.onreadystatechange = function() {
                if (xhr3.readyState === 4 && xhr3.status == 200) {
                    //console.log(xhr3.status);
                    //console.log(xhr3.responseText);
                }
            };

            //var data3 = '{"points": "'+(myObj[0].Points - neededpoints)+'"}';
            var newpoints = currentpoints - neededpoints;
            //console.log(newpoints);
            //console.log('{"points": "'+newpoints+'"}');
            var data3 = '{"points": "' + newpoints + '"}';

            xhr3.send(data3);

            var url2 = "https://gcl-database.herokuapp.com/api/purchased";

            var xhr2 = new XMLHttpRequest();
            xhr2.open("POST", url2);

            xhr2.setRequestHeader("Content-Type", "application/json");

            xhr2.onreadystatechange = function() {
                if (xhr2.readyState === 4 && xhr2.status == 200) {
                    //console.log(xhr2.responseText);
                }
            };

            var data2 = '{"pid": "' + id + '"}';

            xhr2.send(data2);
            window.location.replace("https://gcl-database.herokuapp.com/profile/purchases");

            /*
					  var temp2 = fileloc.split("/");
					//console.log(temp[temp.length -1]);
					downloadURI("../"+fileloc, temp2[temp2.length -1]);
					*/
        } else {
            alert("not enough points");
        }
    } else {
        //console.log("not logged in");
    }


};
/* moved download to purchases page
function downloadURI(uri, name)
{
    var link = document.createElement("a");
    link.download = name;
    link.href = uri;
    link.click();
};
*/
