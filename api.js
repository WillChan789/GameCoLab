//requires
require("dotenv").config();
const express = require("express"),
    bodyParser = require("body-parser"),
    mysql = require("mysql"),
    app = express(),
    connection = require("./db"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    bcrypt = require("bcryptjs"),
    path = require('path'),
    multer = require("multer"),
    fs = require('fs'),
    stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);


//Routes
const accountRoutes = require("./routes/account"),
    commentsRoutes = require("./routes/comments"),
    followingRoutes = require("./routes/following"),
    indexRoutes = require("./routes/index"),
    messagesRoutes = require("./routes/messages"),
    postsRoutes = require("./routes/posts"),
    purchasedRoutes = require("./routes/purchased");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


//Passport Setup, for the login features
app.use(require("express-session")({
    secret: "This is my secret",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function(user, done) {
    done(null, user.Username);
});
passport.deserializeUser(function(username, done) {

    done(null, {
        Username: username
    });
});
passport.use(new LocalStrategy(function(username, password, done) {
    let query = "CALL Get_Account(" + connection.escape(username) + ")";
    connection.query(query, function(error, results, fields) {
        if (error) {
            console.log(error);
            return done(error);
        }
        if (!results[0].length) {
            return done(null, false, {
                message: "No user found"
            });
        }

        bcrypt.compare(connection.escape(password), results[0][0].Password, function(err, res) {
            if (res == true) {
                return done(null, results[0][0]);
            } else {
                return done(null, false, {
                    message: "Wrong password"
                });
            }
        });

    });
}));


//Use Routes
app.use("/api/account/", accountRoutes);
app.use("/api/posts/:id/comments", commentsRoutes);
app.use("/api/account/:username/following", followingRoutes);
app.use("/api/account/:username/messages", messagesRoutes);
app.use("/api/posts/", postsRoutes);
app.use("/api/purchased", purchasedRoutes);
app.use(indexRoutes);
//files that are used or sent to client
app.use(express.static(path.join(__dirname)));
app.use("/ui", express.static(__dirname + '/ui'));
app.use("/images", express.static(__dirname + '/images'));
app.use("/scripts", express.static(__dirname + '/scripts'));
app.use("/items", express.static(__dirname + '/items'));

// viewed at based directory http://localhost:3000/
//Files to send for get requests to pages
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/views/index.html'));
});

app.get('/browse', function(req, res) {
    res.sendFile(path.join(__dirname + '/views/browse.html'));
});

app.get('/login', function(req, res) {
    res.sendFile(path.join(__dirname + '/views/login.html'));
});
app.get('/editor', function(req, res) {
    res.sendFile(path.join(__dirname + '/views/imgeditor.html'));
});

app.get('/upload', function(req, res) {
    if (req.user) {
        res.sendFile(path.join(__dirname + '/views/upload.html'));
    } else {
        res.sendFile(path.join(__dirname + '/views/login.html'));

    }
});
app.get('/profile', function(req, res) {
    if (req.user) {
        res.sendFile(path.join(__dirname + '/views/myprofile.html'));
    } else {
        res.sendFile(path.join(__dirname + '/views/login.html'));
    }
});

app.get('/profile/settings', function(req, res) {
    if (req.user) {
        res.sendFile(path.join(__dirname + '/views/settings.html'));
    } else {
        res.sendFile(path.join(__dirname + '/views/login.html'));
    }
});

app.get('/profile/purchases', function(req, res) {
    if (req.user) {
        res.sendFile(path.join(__dirname + '/views/purchases.html'));
    } else {
        res.sendFile(path.join(__dirname + '/views/login.html'));
    }
});

app.get('/profile/messages', function(req, res) {
    if (req.user) {
        res.sendFile(path.join(__dirname + '/views/messages.html'));
    } else {
        res.sendFile(path.join(__dirname + '/views/login.html'));
    }
});

app.get('/profile/:username', function(req, res) {
    res.sendFile(path.join(__dirname + '/views/profiles.html'));
});

app.get('/post/:id', function(req, res) {
    res.sendFile(path.join(__dirname + '/views/post.html'));
});

//Uploading files to disk storage
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './items/');
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});
var upload = multer({
    storage: storage
});
//for post request take file from myFile field and upload it
app.post('/uploadfile', upload.single('myFile'), (req, res) => {
    try {
        //redirect to recently uploaded file
        let query = "CALL Get_Next_PostID()";
        connection.query(query, function(error, results, fields) {
            if (error) {
                console.log(error);
            } else {
                var num = results[0][0].AUTO_INCREMENT - 10;
                //console.log("results", results);
                var url = "https://gcl-database.herokuapp.com/post/" + num;
                res.redirect(url);
            }
        });

    } catch (err) {
        res.send(400);
    }
});
//post request to create a product in stripe, edits post's stripe ids in database
app.post('/makeproduct', async (req, res) => {
    try {
        //console.log(req.body.Price);

        const product = await stripe.products.create({
            name: req.body.Post_Name,
        });

        let query = "CALL Get_Next_PostID()";
        connection.query(query, async function(error, results, fields) {
            if (error) {
                console.log(error);
            } else {
                var num = results[0][0].AUTO_INCREMENT - 10;
                let query2 = "CALL Edit_Post_ProductID(" + connection.escape(num) + ", " + connection.escape(product.id) + ")";
                connection.query(query2, function(error, results, fields) {
                    if (error) {
                        console.log(error);
                    }
                });

                var stripePrice = req.body.Price;
                if (stripePrice < 100) {
                    stripePrice = stripePrice * 100;
                } else {
                    req.body.Price.replace(".", "");
                }
                const price = await stripe.prices.create({
                    currency: 'cad',
                    product: product.id,
                    unit_amount: stripePrice,
                });

                let query3 = "CALL Edit_Post_PriceID(" + connection.escape(num) + ", " + connection.escape(price.id) + ")";
                connection.query(query3, function(error, results, fields) {
                    if (error) {
                        console.log(error);
                    }
                });
            }
        });

        res.send(200);
    } catch (err) {
        console.log(err);
        res.status(500).send({
            error: err.message,
        });
    }
});

//post request to allow user to connect their strpie account to database
app.post("/onboard-user", async (req, res) => {
    try {
        const account = await stripe.accounts.create({
            type: "standard"
        });
        req.session.accountID = account.id;

        const origin = `${req.headers.origin}`;
        const accountLinkURL = await generateAccountLink(account.id, origin, req.user.Username);

        res.send({
            url: accountLinkURL
        });
    } catch (err) {
        res.status(500).send({
            error: err.message,
        });
    }
});

app.get("/onboard-user/refresh", async (req, res) => {
    if (!req.session.accountID) {
        res.redirect("/");
        return;
    }
    try {
        const {
            accountID
        } = req.session;
        const origin = `${req.secure ? "https://" : "https://"}${req.headers.host}`;

        const accountLinkURL = await generateAccountLink(accountID, origin, req.user.Username);
        res.redirect(accountLinkURL);
    } catch (err) {
        res.status(500).send({
            error: err.message,
        });
    }
});

function generateAccountLink(accountID, origin, user) {
    //console.log(accountID);
    let query = "CALL Edit_Stripe_ID(" + connection.escape(user) + ", " + connection.escape(accountID) + ")";
    connection.query(query, function(error, results, fields) {
        if (error) {
            console.log(error);
        }
    });
    return stripe.accountLinks
        .create({
            type: "account_onboarding",
            account: accountID,
            refresh_url: `${origin}/onboard-user/refresh`,
            return_url: `${origin}/profile`,
        })
        .then((link) => link.url);
}

//get request to currently logged in username
app.get("/current_username", async (req, res) => {
    if (!req.user) {
        //res.redirect("https://gcl-database.herokuapp.com/login");
        res.send("");
        return;
    }
    try {
        res.send(req.user.Username);
        return;
        //const { accountID } = req.session;
        //const origin = `${req.secure ? "https://" : "https://"}${req.headers.host}`;

        //const accountLinkURL = await generateAccountLink(accountID, origin, req.user.Username);
        //res.redirect(accountLinkURL);
    } catch (err) {
        res.status(500).send({
            error: err.message,
        });
    }
});

//get request to suceessful purchase
app.get('/order/success', async (req, res) => {
    const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
    let query = "CALL Add_Purchase(" + connection.escape(req.user.Username) + ", " + connection.escape(session.metadata.pid) + ")";
    connection.query(query, function(error, results, fields) {
        if (error) {
            console.log(error);
        } else {
            let query2 = "CALL Increment_Downloads(" + connection.escape(session.metadata.pid) + ")";
            connection.query(query2, function(error, results, fields) {
                if (error) {
                    console.log(error);
                } else {
                    let query3 = "CALL Add_Account_Points(" + connection.escape(req.user.Username) + ", " + connection.escape(session.metadata.points) + ")";
                    connection.query(query3, function(error, results, fields) {
                        if (error) {
                            console.log(error);
                        } else {
                            res.send(`<html><body><h1>Thanks for your order, ${req.user.Username}!</h1></body><script>setTimeout(function() {window.location.href = 'https://gcl-database.herokuapp.com/profile/purchases';}, 5000);</script></html>`);
                        }
                    });
                }
            });
        }
    });
});

//config to initiate purchase
app.post('/config', async (req, res) => {
    const postid = req.body.postid;
    let query = "CALL Get_Post_PriceID(" + connection.escape(postid) + ")";
    connection.query(query, async function(error, results, fields) {
        if (error) {
            console.log(error);
        } else {
            var pid = results[0][0].PriceID;
            //console.log("pid ", pid);
            //console.log("results ", results[0][0].PriceID);
            const price = await stripe.prices.retrieve(pid);
            res.send({
                publicKey: process.env.STRIPE_PUBLISHABLE_KEY,
                unitAmount: price.unit_amount,
                currency: price.currency,
            });
        }
    });

});

//create a purchase session
app.post('/create-checkout-session', async (req, res) => {
    const domainURL = process.env.DOMAIN;

    const {
        quantity,
        locale,
        postid,
        seller,
        points
    } = req.body;
    let query = "CALL Get_Post_PriceID(" + connection.escape(postid) + ")";
    connection.query(query, async function(error, results, fields) {
        if (error) {
            console.log(error);
        } else {
            var priceid = results[0][0].PriceID;
            let query2 = "CALL Get_Stripe_ID(" + connection.escape(seller) + ")";
            connection.query(query2, async function(error, results, fields) {
                if (error) {
                    console.log(error);
                } else {
                    //console.log(results);
                    var accID = results[0][0].Stripe_ID;
                    const session = await stripe.checkout.sessions.create({
                        payment_method_types: process.env.PAYMENT_METHODS.split(', '),
                        mode: 'payment',
                        locale: locale,
                        metadata: {
                            pid: postid,
                            points: points,
                        },
                        line_items: [{
                            price: priceid,
                            quantity: quantity
                        }, ],
                        payment_intent_data: {
                            application_fee_amount: 0,
                            transfer_data: {
                                destination: accID,
                            },
                        },
                        // ?session_id={CHECKOUT_SESSION_ID} means the redirect will have the session ID set as a query param
                        success_url: `${domainURL}/order/success?session_id={CHECKOUT_SESSION_ID}`,
                        cancel_url: `${domainURL}/profile`,
                    });

                    res.send({
                        sessionId: session.id,
                    });
                }
            });
        }

    });
});
//get request to see if the loggied in user has connected stripe acount
app.get("/stripeidexists", async (req, res) => {
    if (!req.user) {
        //res.redirect("https://gcl-database.herokuapp.com/login");
        res.send(false);
        return;
    }

    let query2 = "CALL Get_Stripe_ID('" + req.user.Username + "')";
    connection.query(query2, async function(error, results, fields) {
        if (error) {
            console.log(error);
            res.send(error);
            return;
        } else {
            if (results[0][0].Stripe_ID !== null) {
                res.send(true);
                return;
            } else {
                res.send(false);
                return;
            }

        }
    });

});

//Start server
app.listen(process.env.PORT || 3000, function() {
    console.log("Server started on port ", process.env.PORT);
});
