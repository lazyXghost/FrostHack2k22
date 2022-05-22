const router = require("express").Router();
const { userLoggedIn, userCheck } = require("../middleware/auth");
const { userLogIn, userRegister } = require("../utils");

// ----- Registration and authentication for Users -----
router.get("/login", userLoggedIn, (req, res) => {
    res.render("user/login");
});
router.post("/login", userLogIn);

router.get("/register", userLoggedIn, (req, res) => {
    res.render("user/register");
});

router.post("/register", userRegister);

// ----------- APP ROUTES ---------------
router.get("/" , userCheck, (req, res) => {
    res.render("user/index",{
        authenticated: req.isAuthenticated(),
        user: req.user,
    });
});

// router.get("/contact", (req, res) => {
//     res.render("store/contact");
// });

// router.get("/products",authCheck , (req, res) => {
//     res.render("store/products",{
//         authenticated: req.isAuthenticated(),
//         user: req.user,
//     });
// });

// router.get("/faqs", (req, res) => {
//     res.render("user/faq");
// });

// router.get("/profile",authCheck, (req, res) => {
//     res.render("user/profile",{
//         authenticated: req.isAuthenticated(),
//         user: req.user,
//         token:req.body.token
//     });
// });

module.exports = router;
