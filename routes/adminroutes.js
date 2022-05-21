var url = require('url');
const router = require("express").Router();
const { adminCheck,adminLoggedIn } = require("../middleware/auth");
const { adminLogIn, getLocations,getProducts } = require("../utils");
const storeTable = require("../models/store");
const locationTable = require("../models/location");

// ----- Authentication for Admin -----
router.get("/login", adminLoggedIn, (req, res) => {
    res.render("admin/login");
});
router.post("/login", adminLogIn);

// ----------- APP ROUTES ---------------

router.get("/", adminCheck, async (req, res) => {
    res.render("admin/home", {
        user: req.user,
        authenticated: req.isAuthenticated(),
    });
});

router.get("/store", adminCheck, async (req, res) => {
    const query = {status : 'pending'};
    const acceptedStores = await storeTable.find({status: 'accepted'});
    const rejectedStores = await storeTable.find({status: 'rejected'});
    const stores = await storeTable.find(query);
    const context = {
        "cities": ["indore", "IIT mandi","Chandigarh"],
        "stores": stores,
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

    let store = new storeTable({
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
    console.log(store);
    await store.save();
    return res.redirect("/admin/store");
});  

router.get("/coupon", adminCheck, (req, res) => {
    res.render("admin/coupon", {
        user: req.user,
        authenticated: req.isAuthenticated(),
    });
    
})
router.get("/category",adminCheck , (req, res)=>{
    res.render("admin/category", {
        user: req.user,
        authenticated: req.isAuthenticated(),
    });
});

router.get("/addCategory",adminCheck , (req, res)=>{
    res.render("admin/category", {
        user: req.user,
        authenticated: req.isAuthenticated(),
    });
});

router.get("/products", adminCheck, getProducts);

router.get("/money", adminCheck,(req, res)=>{ 
    res.render("admin/money", {
        user: req.user,
        authenticated: req.isAuthenticated(),
    });
})

module.exports = router;
