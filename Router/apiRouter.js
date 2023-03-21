const router = require("express").Router();

const middleware = require("../Middleware/apimiddleware")

const { signup, login, profile } = require("../Controller/authController")

router.post("/signup", signup)

router.post("/login",login)

router.get("/profile", middleware, profile )

module.exports = router;