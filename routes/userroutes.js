var url = require('url');
const router = require("express").Router();
const { userLoggedIn, userCheck } = require("../middleware/auth");
const { userLogIn, userRegister, placeOrder } = require("../utils");
const userTable = require('../models/user');
const orderTable = require('../models/order');
const storeTable = require('../models/store');
const productTable = require('../models/product');

// ----- Registration and authentication for Users -----
router.get("/login", userLoggedIn, (req, res) => {
    res.render("user/login");
});
router.post("/login", userLogIn);

router.get("/register", userLoggedIn, (req, res) => {
    res.render("user/register");
});

router.post("/register", async (req, res) => {
    if (req.body.password.length < 8) {
        return res.redirect("/register");
    }
    const phoneNumber = req.body.phoneNumber;
    const oldUser = await userTable.findOne({ phoneNumber });
    if (oldUser) {
        return res.redirect("/login");
    }
    await userRegister(req.body);
    return res.redirect("/login");
});

// ----------- APP ROUTES ---------------
router.get("/" , userCheck, async (req, res) => {
    const products = await productTable.find({status: 'accepted'});
    res.render("user/index",{
        authenticated: req.isAuthenticated(),
        user: req.user,
        products: products
    });
});
router.get("/buyProduct" , userCheck, async (req, res) => {
    var product_id = url.parse(req.url, true).query.ID;
    const product = await productTable.findOne({_id: product_id});
    const store = await storeTable.findOne({_id: product.storeID});
    res.render("user/buyProduct",{
        authenticated: req.isAuthenticated(),
        user: req.user,
        product: product,
        store: store
    });
});
router.post("/buyProduct", userCheck, async(req, res) => {
    req.body.userID = req.user._id;  
    await placeOrder(req.body);
    return res.redirect("/orders")
})
router.get("/orders" , userCheck, async (req, res) => {
    const orders = await orderTable.find({userID: req.user._id});
    res.render("user/orders",{
        authenticated: req.isAuthenticated(),
        user: req.user,
        orders: orders
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

router.get("/profile", userCheck, (req, res) => {
    res.render("user/profile",{
        authenticated: req.isAuthenticated(),
        user: req.user,
        token:req.body.token
    });
});

module.exports = router;
