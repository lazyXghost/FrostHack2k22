var url = require('url');
const router = require("express").Router();
const { adminCheck,adminLoggedIn } = require("../middleware/auth");
const { adminLogIn } = require("../utils");
const storeTable = require("../models/store");
const productTable = require("../models/product");
const locationTable = require("../models/location");

// ----- Authentication for Admin -----
router.get("/login", adminLoggedIn, (req, res) => {
    res.render("admin/login");
});
router.post("/login", adminLogIn);

// ----------- APP ROUTES ---------------

router.get("/", adminCheck, async (req, res) => {
    res.render("admin/index", {
        user: req.user,
        authenticated: req.isAuthenticated(),
    });
});

router.get("/store", adminCheck, async (req, res) => {
    const pendingStores = await storeTable.find({status : 'pending'});
    const rejectedStores = await storeTable.find({status: 'rejected'});
    const acceptedStores = await storeTable.find({status: 'accepted'});
    const context = {
        "cities": ["indore", "IIT mandi","Chandigarh"],
        "pending": pendingStores,
        "rejected":rejectedStores,
        "accepted":acceptedStores
    }
    res.render("admin/store",{
        user :req.user,
        authenticated: req.isAuthenticated(),
        ... context,
    });    
});
router.get("/storeAccept", adminCheck, async (req, res) => {
    var store_id = url.parse(req.url, true).query.ID;
    await storeTable.findOneAndUpdate({ _id: store_id}, { status: 'accepted' });
    return res.redirect('/admin/store');
})
router.get("/storeReject", adminCheck, async (req, res) => {
    var store_id = url.parse(req.url, true).query.ID;
    await storeTable.findOneAndUpdate({ _id: store_id}, { status: 'rejected' });
    return res.redirect('/admin/store');
})
router.get("/addstore", adminCheck, async (req, res) => {
    const locations = await locationTable.find();
    return res.render("admin/addstore",{
        user: req.user,
        authenticated: req.isAuthenticated(),
        locations: locations,
    });
});  
router.post("/addstore", adminCheck, async (req, res) => {
    const {
        storeName, email, password, sellerName, phoneNumber, whatsappNumber, pincode, location
    } = req.body;
    const city = location.split(',')[0];
    const state = location.split(',')[1];

    await storeTable.create({
        storeName: storeName,
        email: email,
        password: password,
        sellerName: sellerName,
        phoneNumber: phoneNumber,
        whatsappNumber: whatsappNumber,
        address:{
            store: "gibberish",
            street: "gibberish",
            colony: "gibberish",
            pincode: pincode,
            state: state,
            city: city
        },
        status: "accepted"
    });
    return res.redirect("/admin/store");
});  

// router.get("/coupon", adminCheck, (req, res) => {
//     res.render("admin/coupon", {
//         user: req.user,
//         authenticated: req.isAuthenticated(),
//     });
    
// })
// router.get("/category",adminCheck , (req, res)=>{
//     res.render("admin/category", {
//         user: req.user,
//         authenticated: req.isAuthenticated(),
//     });
// });

// router.get("/addCategory",adminCheck , (req, res)=>{
//     res.render("admin/category", {
//         user: req.user,
//         authenticated: req.isAuthenticated(),
//     });
// });

router.get("/product", adminCheck, async (req, res) => {
    const pendingproducts = await productTable.find({status : 'pending'});
    const rejectedproducts = await productTable.find({status: 'rejected'});
    const acceptedproducts = await productTable.find({status: 'accepted'});
    const context = {
        "cities": ["indore", "IIT mandi","Chandigarh"],
        "pending": pendingproducts,
        "rejected":rejectedproducts,
        "accepted":acceptedproducts
    }
    res.render("admin/product", {
        user: req.user,
        authenticated: req.isAuthenticated(),
        ... context,
    });
});
router.get("/productAccept", adminCheck, async (req, res) => {
    var product_id = url.parse(req.url, true).query.ID;
    await productTable.findOneAndUpdate({ _id: product_id}, { status: 'accepted' });
    return res.redirect('/admin/product');
})
router.get("/productReject", adminCheck, async (req, res) => {
    var product_id = url.parse(req.url, true).query.ID;
    await productTable.findOneAndUpdate({ _id: product_id}, { status: 'rejected' });
    return res.redirect('/admin/product');
})
// router.get("/money", adminCheck,(req, res)=>{ 
//     res.render("admin/money", {
//         user: req.user,
//         authenticated: req.isAuthenticated(),
//     });
// })

module.exports = router;
