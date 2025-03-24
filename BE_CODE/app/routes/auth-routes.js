const {verifyUser} = require("../middleware");
const authService = require("../services/auth-services");
module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "Authorization",
            "Origin, Content-Type, Accept"
        );
        next();
    });

    //user registration
    app.post(
        "/api/v1/signup",
        [verifyUser.checkExistingUsername],
        [verifyUser.checkExistingEmail],
        authService.signup
    );

    //user login
    app.post("/api/v1/signin", authService.signin);
};
