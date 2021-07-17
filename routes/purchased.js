const express = require("express"),
    router = express.Router(),
    connection = require("../db"),
    middleware = require("../middleware/index");



//Index Route, get all of the logged in user's purcaheses
router.get("/", middleware.isLoggedIn, function(req, res) {
    if (Object.keys(req.query).length === 0) {
        var username = req.user.Username;
        var qresult = "CALL Get_Purchased (" + connection.escape(username) + ")";
        connection.query(qresult, function(error, results, fields) {
            if (error) {
                res.status(500);
                res.json({
                    error: error
                });
                return;
            } else {
                res.json(results[0]);
                return;
            }
        });
    } else {
        console.log(req.query);
    }
});

//Create Route, add post to logged in users purchased
router.post("/", middleware.isLoggedIn, function(req, res) {
    if (req.body.pid) {
        let username = connection.escape(req.user.Username);
        let pid = req.body.pid;
        let query = "CALL Add_Purchase(" + username + ", " + connection.escape(pid) + ")";
        //new commit
        connection.query(query, function(error, results) {
            if (error) {
                res.status(500);
                res.json({
                    error: error
                });
                return;
            } else {
                res.json({
                    message: "Added purchase"
                });
                return;
            }
        });
    } else {
        res.status(422);
        res.json({
            message: "Body is not well defined"
        });
        return;
    }
});



module.exports = router;
