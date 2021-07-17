const express = require("express"),
    router = express.Router({
        mergeParams: true
    }),
    connection = require("../db"),
    middleware = require("../middleware/index");

//Show all accounts, need to be logged in as admin
router.get("/", middleware.isAdmin, function(req, res) {
    let query = "CALL View_All_Accounts()";
    connection.query(query, function(error, results) {
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
//Show ":username" account info, need to be logged in as admin
router.get("/:username", middleware.isAdmin, function(req, res) {
    let username = req.params.username;
    let query = "CALL Get_Account(" + connection.escape(username) + ")";
    connection.query(query, function(error, results) {
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
//get nick name from username
router.get("/:username/name", function(req, res) {
    let username = req.params.username;
    let query = "CALL Get_Account_Name(" + connection.escape(username) + ")";
    connection.query(query, function(error, results) {
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
//get porfile info for given user
router.get("/:username/profile", function(req, res) {
    let username = req.params.username;
    let query = "CALL Get_Account_Profile(" + connection.escape(username) + ")";
    connection.query(query, function(error, results) {
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
//get points for this user
router.get("/:username/points", middleware.isLoggedIn, function(req, res) {
    let username = req.params.username;
    let query = "CALL Get_Account_Points(" + connection.escape(username) + ")";
    connection.query(query, function(error, results) {
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

//Update Route, change account info of logged in user
router.put("/", middleware.isLoggedIn, function(req, res) {
    let user = connection.escape(req.user.Username);

    if (req.body.bio) {
        let bio = connection.escape(req.body.bio);
        let query = "CALL Edit_Account_Profile(" + user + ", " + bio + ")";
        connection.query(query, function(error, results) {
            if (error) {
                console.log(error);
            }
        });
    }
    if (req.body.name) {
        let name = connection.escape(req.body.name);
        let query = "CALL Edit_Account_Name(" + user + ", " + name + ")";
        connection.query(query, function(error, results) {
            if (error) {
                console.log(error);
            }
        });
    }
    if (req.body.points) {
        let points = req.body.points;
        let query = "CALL Edit_Account_Points(" + user + ", " + points + ")";
        connection.query(query, function(error, results) {
            if (error) {
                console.log(error);
            }
        });
    }

    if (req.body.avatar) {
        let avatar = connection.escape(req.body.avatar);
        let query = "CALL Edit_Account_Avatar(" + user + ", " + avatar + ")";
        connection.query(query, function(error, results) {
            if (error) {
                console.log(error);
            }
        });
    }

    if (req.body.ach) {
        let ach = connection.escape(req.body.ach);
        let query = "CALL Edit_Account_Achievements(" + user + ", " + ach + ")";
        connection.query(query, function(error, results) {
            if (error) {
                console.log(error);
            }
        });
    }
    res.json({
        message: "Edited account."
    });
});

module.exports = router;
