const router = require("express").Router();
const { storeLoggedIn, storeCheck } = require("../middleware/auth");
const { storeLogIn, storeRegister, addProduct } = require("../utils");
const productTable = require("../models/product");

// ----- Registration and authentication for Stores -----
router.get("/login", storeLoggedIn, (req, res) => {
  res.render("store/login");
});

router.post("/login", storeLogIn);

router.get("/register", storeLoggedIn, (req, res) => {
  res.render("store/register");
});

router.post("/register", storeRegister);

// ----------- APP ROUTES ---------------

router.get("/", storeCheck, (req, res) => {
  res.render("store/index",{
    authenticated: req.isAuthenticated(),
    user: req.user,
  });
});

router.get("/products", storeCheck, async (req, res) => {
  const products = await productTable.find({storeID: req.user._id});
  const context = {
    "products" : products
  };

  res.render("store/products",{
    user: req.user,
    authenticated: req.isAuthenticated(),
    ...context,
  });
});

router.get("/addProduct", storeCheck, (req, res) => {
  res.render("store/addProduct", {
    authenticated: req.isAuthenticated(),
    user: req.user,
  });
});
router.post("/addProduct", storeCheck, async (req, res) => {
  await addProduct(req.body);
  res.redirect("/store/products");
});

// router.get("/profile", storeCheck, (req, res) => {
//   res.render("store/profile", {
//     authenticated: req.isAuthenticated(),
//     user: req.user,
//   });
// });

// router.get("/contact", (req, res) => {
//   res.render("store/contact");
// });


// router.get("/faqs", (req, res) => {
//   res.render("store/faq");
// });

// // Logging Out
// router.delete("/logout", (req, res) => {
//   req.logOut();
//   res.redirect("/login");
// });

module.exports = router;
