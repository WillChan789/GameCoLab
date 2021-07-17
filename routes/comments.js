const express = require("express"),
    router = express.Router(),
    connection = require("../db"),
    middleware = require("../middleware/index");



//Index Route
router.get("/", function(req, res) {
    let postID = connection.escape(req.baseUrl.split("/")[3]);
    var qresult = "CALL Get_Comments (" + postID + ")";
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
    if (req.body.Comment_Content) {
        let postID = connection.escape(req.baseUrl.split("/")[3]);
        let username = connection.escape(req.user.Username);
        let content = connection.escape(req.body.Comment_Content);
        let query = "CALL Add_Comment(" + postID + ", " + username + ", " + content + ")";
        connection.query(query, function(error, results) {
            if (error) {
                res.status(500);
                res.json({
                    error: error
                });
            } else {
                res.json({
                    message: "Added comment to db"
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
