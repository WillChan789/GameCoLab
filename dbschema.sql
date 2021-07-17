DROP DATABASE IF EXISTS heroku_3001774d8bc5909;
CREATE DATABASE IF NOT EXISTS heroku_3001774d8bc5909;
USE heroku_3001774d8bc5909;

DROP TABLE IF EXISTS Account;
CREATE TABLE Account(
	Username varchar(255) NOT NULL,
	Password varchar(255) NOT NULL,
	Mod_Flag bool DEFAULT False,
	Name varchar(255) UNIQUE,
	Avatar text,
	Profile_Description text,
	Points double DEFAULT 0,
	Stripe_ID varchar(255),
	Achievements longtext,
	PRIMARY KEY(Username)
);

DROP TABLE IF EXISTS Following;
CREATE TABLE Following(
	Username varchar(255) NOT NULL,
	User_Follows varchar(255) NOT NULL,
CONSTRAINT pk_Follow PRIMARY KEY (Username, User_Follows)
);

DROP TABLE IF EXISTS Messages;
CREATE TABLE Messages(
	Username varchar(255) NOT NULL,
	Message_To varchar(255) NOT NULL,
	Message_Date timestamp DEFAULT CURRENT_TIMESTAMP,
	Message_Content text,
	CONSTRAINT pk_Messages PRIMARY KEY (Username, Message_To, Message_Date)
);

DROP TABLE IF EXISTS Posts;
CREATE TABLE Posts(
	Post_ID int unsigned NOT NULL AUTO_INCREMENT,
	Post_Name varchar(255) NOT NULL,
	Username varchar(255) NOT NULL,
	File_location text NOT NULL,
	File_info text NOT NULL,
	Post_Description text,
	Total_Views double DEFAULT 0,
	Total_Downloads double DEFAULT 0,
	Tags text,
	Price DECIMAL(10,2),
	PriceID varchar(255),
	ProductID varchar(255),
	Delete_Flag bool DEFAULT False,
	PRIMARY KEY(Post_ID)
);

DROP TABLE IF EXISTS Purchased;
CREATE TABLE Purchased(
	Username varchar(255) NOT NULL,
	Post_ID int unsigned NOT NULL,
CONSTRAINT pk_Purchased PRIMARY KEY (Username, Post_ID)
);

DROP TABLE IF EXISTS Comments;
CREATE TABLE Comments(
	Post_ID int unsigned NOT NULL,
	Username varchar(255) NOT NULL,
	Comment_Content text,
	Comment_Date timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT pk_Comments PRIMARY KEY (Post_ID, Username, Comment_Date)
);

ALTER TABLE Following
	ADD CONSTRAINT fk_follow_username FOREIGN KEY (Username) REFERENCES Account(Username) ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT fk_follow_userfollows FOREIGN KEY (User_Follows) REFERENCES Account(Username) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE Messages
	ADD CONSTRAINT fk_message_username FOREIGN KEY (Username) REFERENCES Account(Username) ON DELETE CASCADE ON UPDATE CASCADE,
	ADD CONSTRAINT fk_message_messageto FOREIGN KEY (Message_To) REFERENCES Account(Username) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE Posts
	ADD CONSTRAINT fk_posts_username FOREIGN KEY (Username) REFERENCES Account(Username) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE Purchased
	ADD CONSTRAINT fk_purchased_username FOREIGN KEY (Username) REFERENCES Account(Username) ON DELETE CASCADE ON UPDATE CASCADE,
	ADD CONSTRAINT fk_purchased_postid FOREIGN KEY (Post_ID) REFERENCES Posts(Post_ID) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE Comments
	ADD CONSTRAINT fk_comments_postid FOREIGN KEY (Post_ID) REFERENCES Posts(Post_ID) ON DELETE CASCADE ON UPDATE CASCADE,
	ADD CONSTRAINT fk_comments_username FOREIGN KEY (Username) REFERENCES Account(Username) ON DELETE RESTRICT ON UPDATE CASCADE;

DELIMITER //
CREATE PROCEDURE Add_Account (
	IN vUsername varchar(255),
	IN vPassword varchar(255),
	IN vName varchar(255)
)
BEGIN
	INSERT INTO Account (Username, Password, Name)
	VALUES (vUsername, vPassword, vName);
END//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE Register_User (
	IN vUsername varchar(255),
	IN vPassword varchar(255),
	IN vName varchar(255)
)
BEGIN
	INSERT INTO Account (Username, Password, Name, Points)
	VALUES (vUsername, vPassword, vName, 100);
END//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE View_All_Accounts ()
BEGIN
	SELECT *
	FROM Account;
END//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE Get_Account (
	IN vUsername varchar(255)
)
BEGIN
	SELECT *
	FROM Account
	WHERE Username = vUsername;
END//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE Get_Account_Name (
	IN vUsername varchar(255)
)
BEGIN
	SELECT Name
	FROM Account
	WHERE Username = vUsername;
END//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE Get_Account_Profile (
	IN vUsername varchar(255)
)
BEGIN
	SELECT Username, Avatar, Profile_Description, Points, Achievements
	FROM Account
	WHERE Username = vUsername;
END//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE Get_Account_Points (
	IN vUsername varchar(255)
)
BEGIN
	SELECT Points
	FROM Account
	WHERE Username = vUsername;
END//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE Get_Stripe_ID (
	IN vUsername varchar(255)
)
BEGIN
	SELECT Stripe_ID
	FROM Account
	WHERE Username = vUsername;
END//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE Get_Account_Achievements (
	IN vUsername varchar(255)
)
BEGIN
	SELECT Achievements
	FROM Account
	WHERE Username = vUsername;
END//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE Edit_Account_Name(
	IN vUsername varchar(255),
	IN vName varchar(255)
)
BEGIN
	UPDATE Account
	SET Name = vName
	WHERE Username = vUsername;
END//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE Edit_Account_Avatar(
	IN vUsername varchar(255),
	IN vAvatar text
)
BEGIN
	UPDATE Account
	SET Avatar = vAvatar
	WHERE Username = vUsername;
END//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE Edit_Account_Profile(
	IN vUsername varchar(255),
	IN vDesc text
)
BEGIN
	UPDATE Account
	SET Profile_Description = vDesc
	WHERE Username = vUsername;
END//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE Edit_Account_Points(
	IN vUsername varchar(255),
	IN vPoints double
)
BEGIN
	UPDATE Account
	SET Points = vPoints
	WHERE Username = vUsername;
END//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE Add_Account_Points(
	IN vUsername varchar(255),
	IN vPoints double
)
BEGIN
	UPDATE Account
	SET Points = (Points + vPoints)
	WHERE Username = vUsername;
END//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE Edit_Stripe_ID (
	IN vUsername varchar(255),
	IN vID varchar(255)
)
BEGIN
	UPDATE Account
	SET Stripe_ID = vID
	WHERE Username = vUsername;
END//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE Edit_Account_Achievements (
	IN vUsername varchar(255),
	IN vAchievements longtext
)
BEGIN
	UPDATE Account
	SET Achievements = vAchievements
	WHERE Username = vUsername;
END//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE Add_Following(
	IN vUsername varchar(255),
	IN vUser_Follows varchar(255)
)
BEGIN
	INSERT INTO Following(Username, User_Follows )
	VALUES (vUsername, vUser_Follows );
END//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE Remove_Following(
	IN vUsername varchar(255),
	IN vUser_Follows varchar(255)
)
BEGIN
	DELETE FROM Following
	WHERE (Username = vUsername) AND (User_Follows = vUser_Follows);
END//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE Check_Following(
	IN vUsername varchar(255),
	IN vUser_Follows varchar(255)
)
BEGIN
	SELECT *
	FROM Following
	WHERE (Username = vUsername) AND (User_Follows = vUser_Follows);
END//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE Get_Following (
	IN vUsername varchar(255)
)
BEGIN
	SELECT User_Follows
	FROM Following
	WHERE Username = vUsername;
END//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE Get_Followers (
	IN vUsername varchar(255)
)
BEGIN
	SELECT Username
	FROM Following
	WHERE User_Follows = vUsername;
END//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE Add_Messages(
	IN vUsername varchar(255),
	IN vMessage_To varchar(255),
	IN vMessage_Content text
)
BEGIN
	INSERT INTO Messages(Username, Message_To, Message_Content)
	VALUES (vUsername, vMessage_To, vMessage_Content );
END//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE Get_Messages (
	IN vUsername varchar(255),
	IN vMessage_To varchar(255)
)
BEGIN
	SELECT *
	FROM Messages
	WHERE (Username = vUsername) AND (Message_To = vMessage_To);
END//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE Add_Posts(
	IN vPost_Name varchar(255),
	IN vUsername varchar(255),
	IN vFile_location text,
	IN vFile_info text,
	IN vPost_Description text,
	IN vTags text,
	IN vPrice DECIMAL(10,2)
)
BEGIN
	INSERT INTO Posts(Post_Name, Username, File_location, File_info, Post_Description, Tags, Price)
	VALUES (vPost_Name, vUsername, vFile_location, vFile_info, vPost_Description, vTags, vPrice);
END//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE Remove_Post(
	IN vPost_ID int unsigned
)
BEGIN
	UPDATE Posts
	SET Delete_Flag= True
	WHERE Post_ID = vPost_ID;
END//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE View_All_Posts ()
BEGIN
	SELECT *
	FROM Posts
	WHERE (Delete_Flag = False);
END//
DELIMITER ;


DELIMITER //
CREATE PROCEDURE Get_Post (
	IN vPost_ID int unsigned
)
BEGIN
	SELECT *
	FROM Posts
	WHERE (Post_ID = vPost_ID) AND (Delete_Flag = False);
END//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE Get_Post_of_User (
	IN vUsername varchar(255)
)
BEGIN
	SELECT *
	FROM Posts
	WHERE (Username = vUsername) AND (Delete_Flag = False);
END//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE Get_Post_PriceID (
	IN vPost_ID int unsigned
)
BEGIN
	SELECT PriceID
	FROM Posts
	WHERE (Post_ID = vPost_ID) AND (Delete_Flag = False);
END//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE Edit_Post_Description(
	IN vPost_ID int unsigned,
	IN vPost_Description text
)
BEGIN
	UPDATE Posts
	SET Post_Description= vPost_Description
	WHERE Post_ID = vPost_ID;
END//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE Edit_Post_Price(
	IN vPost_ID int unsigned,
	IN vPrice DECIMAL(10,2)
)
BEGIN
	UPDATE Posts
	SET Price = vPrice
	WHERE Post_ID = vPost_ID;
END//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE Get_Next_PostID(
)
BEGIN
	SELECT AUTO_INCREMENT
	FROM information_schema.TABLES
	WHERE TABLE_SCHEMA = "heroku_3001774d8bc5909" AND TABLE_NAME = "Posts";
END//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE Edit_Post_PriceID(
	IN vPost_ID int unsigned,
	IN vPriceID varchar(255)
)
BEGIN
	UPDATE Posts
	SET PriceID = vPriceID
	WHERE Post_ID = vPost_ID;
END//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE Edit_Post_ProductID(
	IN vPost_ID int unsigned,
	IN vProductID varchar(255)
)
BEGIN
	UPDATE Posts
	SET ProductID = vProductID
	WHERE Post_ID = vPost_ID;
END//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE Increment_Views(
	IN vID int unsigned
)
BEGIN
	UPDATE Posts
	SET Total_Views = (Total_Views + 1)
	WHERE Post_ID = vID;
END//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE Increment_Downloads(
	IN vID int unsigned
)
BEGIN
	UPDATE Posts
	SET Total_Downloads = (Total_Downloads  + 1)
	WHERE Post_ID = vID;
END//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE Add_Purchase(
	IN vUsername varchar(255),
	IN vID int unsigned
)
BEGIN
	INSERT INTO Purchased (Username, Post_ID)
	VALUES (vUsername, vID);
END//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE Get_Purchased(
	IN vUsername varchar(255)
)
BEGIN
	SELECT *
	FROM Purchased
	WHERE Username = vUsername;
END//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE Add_Comment(
	IN vID int unsigned,
	IN vUsername varchar(255),
	IN vContent text
)
BEGIN
	INSERT INTO Comments (Post_ID, Username, Comment_content)
	VALUES (vID, vUsername, vContent);
END//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE Get_Comments(
	IN vID int unsigned
)
BEGIN
	SELECT *
	FROM Comments
	WHERE Post_ID = vID;
END//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE Search_Post_Name(
	IN pattern varchar(255)
)
BEGIN
	SELECT *
	FROM Posts
	WHERE Post_Name LIKE CONCAT("%", pattern, "%") AND Delete_Flag = False
ORDER BY Post_Name ASC;
END//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE seedDB()
BEGIN
	INSERT INTO Account (Username, Password, Mod_Flag, Name)
	VALUES ("admin", "$2b$10$5EVpsOcPPs7QTrmJBMr5lOtQ6NDffF08X2EFdZiWSO40IjBQ2PxU6", True, "admin"); -- password is "1234"
	CALL Add_Account ("test1", "$2b$10$5EVpsOcPPs7QTrmJBMr5lOtQ6NDffF08X2EFdZiWSO40IjBQ2PxU6", "test1"); -- password is "1234"
	CALL Add_Account ("test2", "$2b$10$5EVpsOcPPs7QTrmJBMr5lOtQ6NDffF08X2EFdZiWSO40IjBQ2PxU6", "test2"); -- password is "1234"
	CALL Add_Account ("test3", "$2b$10$5EVpsOcPPs7QTrmJBMr5lOtQ6NDffF08X2EFdZiWSO40IjBQ2PxU6", "test3"); -- password is "1234"
	CALL Add_Account ("test4", "$2b$10$5EVpsOcPPs7QTrmJBMr5lOtQ6NDffF08X2EFdZiWSO40IjBQ2PxU6", "test4"); -- password is "1234"
	CALL Add_Account ("test5", "$2b$10$5EVpsOcPPs7QTrmJBMr5lOtQ6NDffF08X2EFdZiWSO40IjBQ2PxU6", "test5"); -- password is "1234"
	CALL Add_Account ("test6", "$2b$10$5EVpsOcPPs7QTrmJBMr5lOtQ6NDffF08X2EFdZiWSO40IjBQ2PxU6", "test6"); -- password is "1234"
	CALL Add_Account ("test7", "$2b$10$5EVpsOcPPs7QTrmJBMr5lOtQ6NDffF08X2EFdZiWSO40IjBQ2PxU6", "test7"); -- password is "1234"
	CALL Add_Account ("test8", "$2b$10$5EVpsOcPPs7QTrmJBMr5lOtQ6NDffF08X2EFdZiWSO40IjBQ2PxU6", "test8"); -- password is "1234"
	CALL Edit_Stripe_ID ("admin", "acct_1IOVQRIe9OaFzdJN");
	CALL Edit_Stripe_ID ("test1", "acct_1IOVMRA5PUy3IlPB");
	CALL Add_Messages ("admin", "test1", "hello world");
	CALL Add_Posts ("Animated Cube", "admin", "/items/models/AnimatedCube/glTF/AnimatedCube.gltf", "model", "Animated Cube", "3D", 1.00);
	CALL Edit_Post_PriceID('4', 'price_1IOr0zAtuxiufVwm1HVwJ0uq');
	CALL Edit_Post_ProductID('4', 'prod_J0smUJKU4yH2qT');
	CALL Add_Posts ("Horse", "admin", "/items/models/Horse/Horse.glb", "model", "Horse", "3D", 1.00);
	CALL Edit_Post_PriceID('14', 'price_1IOr1IAtuxiufVwmCe8i9Yzr');
	CALL Edit_Post_ProductID('14', 'prod_J0sm8heNnWaW14');
	CALL Add_Posts ("Game Development Image 1", "admin", "/items/gamedev1.png", "image", "Game Dev", "2D", 0.50);
	CALL Edit_Post_PriceID('24', 'price_1IOr1kAtuxiufVwmYU6DZ4Bh');
	CALL Edit_Post_ProductID('24', 'prod_J0snR98jNAcoH0');
	CALL Add_Posts ("Iron man", "test1", "/items/ironman.jpg", "image", "Iron Man", "2D", 0.00);
	CALL Edit_Post_PriceID('34', 'price_1IOr25AtuxiufVwmE3ZDeQxr');
	CALL Edit_Post_ProductID('34', 'prod_J0sn0jpjPaB7KD');
	CALL Add_Posts ("Among Us", "test1", "/items/amongus.jpg", "image", "Among Us", "2D", 0.00);
	CALL Edit_Post_PriceID('44', 'price_1IOr2MAtuxiufVwm613dJErE');
	CALL Edit_Post_ProductID('44', 'prod_J0sn0jl6NHbJJt');
	CALL Add_Posts ("Fox", "test1", "/items/models/Fox/glTF/Fox.gltf", "model", "Fox", "3D", 0.00);
	CALL Edit_Post_PriceID('54', 'price_1IOr2ZAtuxiufVwmZM6a4riW');
	CALL Edit_Post_ProductID('54', 'prod_J0so72XWVEh0Zl');
	CALL Add_Posts ("Assassin's Creed", "test1", "/items/assassincreed.jpg", "image", "Assassin's Creed", "2D", 0.00);
	CALL Edit_Post_PriceID('64', 'price_1IVk98AtuxiufVwmUjYxZIiJ');
	CALL Edit_Post_ProductID('64', 'prod_J809bz8MUs0Eub');
	CALL Add_Posts ("Binding of Isaac", "test1", "/items/bindingofisaac.jpg", "image", "Binding of Isaac", "2D", 0.00);
	CALL Edit_Post_PriceID('74', 'price_1IVk9UAtuxiufVwmqpcAafe6');
	CALL Edit_Post_ProductID('74', 'prod_J809lwgtYzSWMn');
	CALL Add_Posts ("Firewatch", "test1", "/items/firewatch.jpg", "image", "Firewatch", "2D", 0.00);
	CALL Edit_Post_PriceID('84', 'price_1IVk9hAtuxiufVwm6Q3IrSxY');
	CALL Edit_Post_ProductID('84', 'prod_J80AQu3ZSwiI96');
	CALL Add_Posts ("God of War", "test1", "/items/godofwar.jpg", "image", "God of War", "2D", 0.00);
	CALL Edit_Post_PriceID('94', 'price_1IVk9sAtuxiufVwmF0Yy5oVc');
	CALL Edit_Post_ProductID('94', 'prod_J80AAXszUyeHCC');
	CALL Add_Posts ("Nvidia", "test1", "/items/nvidia.png", "image", "Nvidia", "2D", 0.00);
	CALL Edit_Post_PriceID('104', 'price_1IVkA3AtuxiufVwm7azV0pBb');
	CALL Edit_Post_ProductID('104', 'prod_J80AYvxti5MYRx');
	CALL Add_Posts ("Razer", "test1", "/items/razer.jpg", "image", "Razer", "2D", 0.00);
	CALL Edit_Post_PriceID('114', 'price_1IOr2MAtuxiufVwm613dJErE');
	CALL Edit_Post_ProductID('114', 'prod_J0sn0jl6NHbJJt');
	CALL Add_Posts ("ROG", "test1", "/items/rog.jpg", "image", "ROG", "2D", 0.00);
	CALL Edit_Post_PriceID('124', 'price_1IVkANAtuxiufVwmpi3CAjxL');
	CALL Edit_Post_ProductID('124', 'prod_J80A9WvUu3hMBV');
	CALL Add_Posts ("SNES", "test1", "/items/snes.jpg", "image", "SNES", "2D", 0.00);
	CALL Edit_Post_PriceID('134', 'price_1IVkAXAtuxiufVwmU8Rrqm2a');
	CALL Edit_Post_ProductID('134', 'prod_J80AxAOUtMZrTZ');
	CALL Add_Posts ("Star Wars", "test1", "/items/starwars.jpg", "image", "Star Wars", "2D", 0.00);
	CALL Edit_Post_PriceID('144', 'price_1IVkAhAtuxiufVwmBhrSq6YH');
	CALL Edit_Post_ProductID('144', 'prod_J80BlUMOwsu9n2');
	CALL Add_Posts ("Zelda", "test1", "/items/zelda.jpg", "image", "Zelda", "2D", 0.00);
	CALL Edit_Post_PriceID('154', 'price_1IVkArAtuxiufVwm4kpAkTad');
	CALL Edit_Post_ProductID('154', 'prod_J80Bs2REuXjBQX');
	CALL Add_Following("admin", "test1");
	CALL Add_Following("admin", "test2");
	CALL Add_Following("admin", "test3");
	CALL Add_Following("admin", "test4");
	CALL Add_Following("admin", "test5");
	CALL Add_Following("admin", "test6");
	CALL Add_Following("admin", "test7");
	CALL Add_Following("admin", "test8");
	CALL Add_Following("test1", "test2");
	CALL Add_Following("test1", "test3");
	CALL Add_Following("test1", "test4");
	CALL Add_Following("test1", "test5");
	CALL Add_Following("test1", "test6");
	CALL Add_Following("test1", "test7");
	CALL Add_Following("test1", "test8");
	CALL Edit_Account_Avatar("admin", "Investor");
END//
DELIMITER ;

CALL seedDB();

-- Add new user
-- CREATE USER IF NOT EXISTS 'b1376f4ac96cee'@'us-cdbr-east-03.cleardb.com' IDENTIFIED BY 'de4c175e';
-- GRANT ALL PRIVILEGES ON heroku_3001774d8bc5909 . * TO 'b1376f4ac96cee'@'us-cdbr-east-03.cleardb.com';
-- FLUSH PRIVILEGES;
