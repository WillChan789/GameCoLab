const express = require("express"),
    router = express.Router(),
    connection = require("../db"),
    middleware = require("../middleware/index");



//get all posts or seaching posts
router.get("/", function(req, res) {
    if (Object.keys(req.query).length === 0) {
        connection.query("CALL View_All_Posts()", function(error, results, fields) {
            if (error) {
                res.status(500);
                res.json({
                    error: error
                });
            } else {
                res.json(results[0]);
            }
        });
    } else if (req.query.Post_Name != undefined) {
        var pattern = req.query.Post_Name;
        var qresult = "CALL Search_Post_Name(" + connection.escape(pattern) + ")";
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
    } else {
        console.log(req.query.Post_Name);
    }


});

//Create Route, add a post made by logged in user
router.post("/", middleware.isLoggedIn, function(req, res) {
    if (req.body.Post_Name && req.body.File_location && req.body.File_Info && req.body.Post_Desc && req.body.Tags && req.body.Price) {
        let Post_Name = connection.escape(req.body.Post_Name);
        let User = connection.escape(req.user.Username);
        let File_location = connection.escape(req.body.File_location);
        let File_Info = connection.escape(req.body.File_Info);
        let Post_Desc = connection.escape(req.body.Post_Desc);
        let Tags = connection.escape(req.body.Tags);
        let Price = connection.escape(req.body.Price);


        let query = "CALL Add_Posts(" + Post_Name + ", " + User + ", " + File_location + ", " + File_Info + ", " +
            Post_Desc + ", " + Tags + "," + Price + ")";
        connection.query(query, function(error, results) {
            if (error) {
                res.status(500);
                res.json({
                    error: error
                });
            } else {
                res.json({
                    message: "Added post to db"
                });
            }
        });
    } else {
        res.status(422);
        res.json({
            message: "Body is not well defined"
        });
    }
});

router.post("/dup", function(req, res) {
    if (req.body.pid) {
        let query = "CALL Increment_Downloads(" + connection.escape(req.body.pid) + ")";
        connection.query(query, function(error, results) {
            if (error) {
                res.status(500);
                res.json({
                    error: error
                });
            } else {
                res.json({
                    message: "Incremented Download of post"
                });
            }
        });
    } else {
        res.status(422);
        res.json({
            message: "BOdy is not well defined"
        });
    }
});

//Show Route, get post by id
router.get("/:id", middleware.postExist, function(req, res) {
    let id = parseInt(req.params.id, 10);
    let query = "CALL Get_Post(" + connection.escape(id) + ")";
    connection.query(query, function(error, results, fields) {
        if (error) {
            res.status(500);
            res.json({
                error: error
            });
        } else {
            let query2 = "CALL Increment_Views(" + connection.escape(id) + ")";
            connection.query(query2, function(error2, results2, fields2) {
                if (error2) {
                    console.log(error2);
                }
            });
            res.json(results[0]);
        }
    });

});
//get all the post of the given user
router.get("/user/:usernam", function(req, res) {
    let username2 = req.params.usernam;
    let qresult = "CALL Get_Post_of_User (" + connection.escape(username2) + ")";
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
//get price id for stripe purchases
router.get("/:id/priceid", middleware.postExist, function(req, res) {
    let id = parseInt(req.params.id, 10);
    let query = "CALL Get_Post_PriceID(" + connection.escape(id) + ")";
    connection.query(query, function(error, results, fields) {
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

//Update Route, editing existing post
router.put("/:id", middleware.postExist, function(req, res) {
    let id = parseInt(req.params.id, 10);
    if (req.body.desc) {
        let query = "CALL Edit_Post_Description(" + connection.escape(id) + ", " + connection.escape(req.body.desc) + ")";
        connection.query(query, function(error, results, fields) {
            if (error) {
                res.status(500);
                res.json({
                    error: error
                });
            }
        });
    } else if (req.body.priceid) {
        let query = "CALL Edit_Post_PriceID" + connection.escape(id) + ", " + connection.escape(req.body.priceid) + ")";
        connection.query(query, function(error, results, fields) {
            if (error) {
                res.status(500);
                res.json({
                    error: error
                });
            }
        });
    } else if (req.body.productid) {
        let query = "CALL Edit_Post_ProductID" + connection.escape(id) + ", " + connection.escape(req.body.productid) + ")";
        connection.query(query, function(error, results, fields) {
            if (error) {
                res.status(500);
                res.json({
                    error: error
                });
            }
        });
    }

    res.json({
        message: "Edited post."
    });
});


//Delete Route, delete a post, need to be admin for now
router.delete("/:id", middleware.postExist, middleware.isAdmin, function(req, res) {
    let id = parseInt(req.params.id, 10);
    let adminUser = connection.escape(req.user.Username);
    let query = "CALL Remove_Post(" + id + ", " + adminUser + ")";
    connection.query(query, function(error, results) {
        if (error) {
            res.status(500);
            res.json({
                error: error
            });
        } else {
            res.json({
                message: "Deleted post"
            });
        }
    });
});


module.exports = router;
