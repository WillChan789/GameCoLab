project by William Chan and Umair Hassan
Site URL: https://gcl-database.herokuapp.com

INSTRUCTIONS
1. npm install in terminal to get node modules
2. Host database and change db.js to correct info
3. Host server online

COMPONENTS WE ARE USING
    - MySQL database
    - Passport.js
        - to keep users
    - Bcrypt.js
        - to hash passwords
    - Three.js
        - to load models
    - Toast UI Image Editor
    - Bootstrap
    - Node.js
    - Express
        - for routing
    - JQuery
    - Stripe
    - Multer
        - for file upload

Database User info is in db.js

Currently, items folder has sample images and models.
Re-importing database schema will remove new user uploads.

Database schema automatically seeds when imported with accounts and several images + models.
Seeded accounts have username and password in schema.

Three.js currently only loads gltf or glb models. No FBX support currently.
