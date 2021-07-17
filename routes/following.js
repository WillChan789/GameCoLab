const express = require("express"),
    router = express.Router(),
    connection = require("../db"),
    middleware = require("../middleware/index");



//Index Route, get all following relations
router.get("/", function(req, res) {
    var username = connection.escape(req.baseUrl.split("/")[3]);
    var qresult = "CALL Get_Following (" + username + ")";
    //let username = req.params.username;
    //let qresult = "CALL Get_Following(" + connection.escape(username) + ")";
    connection.query(qresult, function(error, results) {
        if (error) {
            res.status(500);
            res.json({
                error: error
            });
        } else {
            res.json(results[0]);
        }
    });
});
//get the followers of a given user
router.get("/followers", function(req, res) {
    var username = connection.escape(req.baseUrl.split("/")[3]);
    var qresult = "CALL Get_Followers (" + username + ")";
    //let username = req.params.username;
    //let qresult = "CALL Get_Followers(" + connection.escape(username) + ")";
    connection.query(qresult, function(error, results) {
        if (error) {
            res.status(500);
            res.json({
                error: error
            });
        } else {
            res.json(results[0]);
        }
    });
});
//this one is for checking weather the logged in user is following the other user
router.get("/check", function(req, res) {
    let username = connection.escape(req.user.Username);
    let userFollows = connection.escape(req.baseUrl.split("/")[3]);

    var qresult = "CALL Check_Following (" + username + ", " + userFollows + ")";

    connection.query(qresult, function(error, results) {
        if (error) {
            res.status(500);
            res.json({
                error: error
            });
        } else {
            res.json(results[0]);
        }
    });
});

//Create Route, creat a following relation, logged in user follows other user
router.post("/", middleware.isLoggedIn, function(req, res) {
    let username = connection.escape(req.user.Username);
    let userFollows = connection.escape(req.baseUrl.split("/")[3]);

    let query = "CALL Add_Following(" + username + ", " + userFollows + ")";
    connection.query(query, function(error, results) {
        if (error) {
            res.status(500);
            res.json({
                error: error
            });
        } else {
            res.json({
                message: "Added following to db"
            });
        }
    });

});


//Delete Route, remove following relation, logged in user unfollows other user
router.delete("/", middleware.isLoggedIn, middleware.followingExist, function(req, res) {
    let username = connection.escape(req.user.Username);
    let userFollows = connection.escape(req.baseUrl.split("/")[3]);
    let query = "CALL Remove_Following(" + username + ", " + userFollows + ")";
    connection.query(query, function(error, results) {
        if (error) {
            res.status(500);
            res.json({
                error: error
            });
        } else {
            res.json({
                message: "Deleted following"
            });
        }
    });
});

module.exports = router;
