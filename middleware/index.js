//This file is for all the middleware functions needed for the API and routes
const connection = require("../db");

let middlewareObj = {};

//contniue if this user is logged in, else send message
middlewareObj.isLoggedIn = function(req, res, next) {
    if (!req.user) {
        res.status(401);
        res.json({
            message: "You need to be logged in to access this"
        });
        return;
    }
    return next();
}
//contniue if this user is logged in as admin, else send message
middlewareObj.isAdmin = function(req, res, next) {
    if (!req.user) {
        res.status(401);
        res.json({
            message: "You need to be logged in to access this"
        });
        return;
    } else {
        //Check user is an admin
        let user = connection.escape(req.user.Username);
        let query = "CALL Get_Account(" + user + ")";
        connection.query(query, function(error, results) {
            if (error) {
                res.json({
                    error: error
                });
            }
            if (!results[0].length) {
                res.status(403);
                res.json({
                    message: "You are not an adminstrator"
                });
                return;
            } else if (results[0][0].Mod_Flag = 1) {
                res.locals.admin = results[0][0]; //might be wrong, double ckeck if problems
                return next();
            } else {
                res.status(403);
                res.json({
                    message: "You are not an adminstrator"
                });
                return;
            }
        });
    }
}
//contniue if this post exists, else send message
middlewareObj.postExist = function(req, res, next) {
    let id = parseInt(req.params.id, 10);
    if (!Number.isNaN(id)) {
        let query = "CALL Get_Post(" + connection.escape(id) + ")";
        connection.query(query, function(error, results, fields) {
            if (error) {
                res.json({
                    error: error
                });
            }
            if (!results[0].length) {
                //post not found
                res.status(404);
                res.json({
                    message: "This post does not exist"
                });
                return;
            } else {
                return next();
            }
        });
    } else {
        res.status(400);
        res.json({
            message: "Not a valid id!"
        });
    }
}
//contniue if this following relation exists, else send message
middlewareObj.followingExist = function(req, res, next) {
    let user = connection.escape(req.user.Username);
    let unfollow = connection.escape(req.baseUrl.split("/")[3]);
    let query = "CALL Check_Following (" + user + ", " + unfollow + ")";
    connection.query(query, function(error, results) {
        if (error) {
            res.status(500);
            res.json({
                error: error
            });
            return;
        }
        if (!results[0].length) {
            //No following relation found
            res.status(404);
            res.json({
                message: "This user does not follow"
            });
            return;
        } else {
            res.locals.following = results[0][0];
            return next();
        }
    });
}

module.exports = middlewareObj;
