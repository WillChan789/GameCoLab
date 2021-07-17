const express = require("express"),
    router = express.Router(),
    connection = require("../db"),
    middleware = require("../middleware/index");



//Index Route
router.get("/", middleware.isLoggedIn, function(req, res) {
    var username = connection.escape(req.user.Username);
    var messageTo = connection.escape(req.baseUrl.split("/")[3]);
    var qresult = "CALL Get_Messages (" + username + ", " + messageTo + ")";
    connection.query(qresult, function(error, results, fields) {
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

//Create Route
router.post("/", middleware.isLoggedIn, function(req, res) {
    if (req.body.messageContent) {
        let username = connection.escape(req.user.Username);
        let messageTo = connection.escape(req.baseUrl.split("/")[3]);
        let messageContent = connection.escape(req.body.messageContent);
        let query = "CALL Add_Messages(" + username + ", " + messageTo + ", " + messageContent + ")";
        connection.query(query, function(error, results) {
            if (error) {
                res.status(500);
                res.json({
                    error: error
                });
            } else {
                res.json({
                    message: "Added message to db"
                });
            }
        });
    } else {
        res.status(422);
        res.json({
            message: "Body is not well defined"
        })
    }
});



module.exports = router;
