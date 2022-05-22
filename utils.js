const storeTable = require("./models/store");
const locationTable = require("./models/location");
const categoriesTable = require("./models/category");
const productTable = require("./models/product");
const bcrypt = require("bcryptjs");
const passport = require("passport");

module.exports = {
  userLogIn: passport.authenticate("user-local", {
    successRedirect: "/user",
    failureRedirect: "/user/login",
  }),
  storeLogIn: passport.authenticate("store-local", {
    successRedirect: "/store",
    failureRedirect: "/store/login",
  }),
  adminLogIn: passport.authenticate("admin-local", {
    successRedirect: "/admin",
    failureRedirect: "/admin/login",
  }),

  userRegister: async function (req, res) {
    res.redirect("/login");
  },
  storeRegister: async function (req, res) {
    const {
      storeName,
      email,
      password,
      sellerName,
      phoneNumber,
      whatsappNumber,
      pincode,
      city,
      state,
    } = req.body;
    if (password.length < 8) {
      return res.redirect("/store/register");
    }

    const oldStore = await storeTable.findOne({phoneNumber});
    if (oldStore) {
      return res.redirect("/store/login");
    }

    const encryptedPassword = await bcrypt.hash(password, 10);
    await storeTable.create({
      storeName: storeName,
      email: email.toLowerCase(),
      password: encryptedPassword,
      sellerName: sellerName,
      phoneNumber: phoneNumber,
      whatsappNumber: whatsappNumber,
      address: {
        pincode: pincode,
        state: state,
        city: city,
        store: "gibberish",
        street: "gibberish",
        colony: "gibberish",
      },
    });
    //   e.preventdefault();
    //   alert("created a new store successfully");
    res.redirect("/store/login");
  },

  addProduct: async function (formData) {
    const {
      name,
      costPrice,
      mrp,
      salePrice,
      quantity,
      description
    } = formData;

    await productTable.create({
      name: name,
      storeID: req.user._id,
      categoryID: "noCategoryYet",
      costPrice: costPrice,
      mrp: mrp,
      salePrice: salePrice,
      quantity: quantity,
      description: description,
    });
  },
  // getProducts: async function(req, res){
    // const locations = await locationTable.find();
    // const categories = await categoriesTable.find();
    // const storeId = Array(stores.length);
    // for (let i = 0; i < stores.length; i++) {
    //   storeId[i] = stores[i]._id;
    // }
    // const products = await productTable.find({
    //   storeID: {
    //     $in: storeId
    //   }
    // });
    // const categoryDict = {},storeDict ={};
    // const cities = Array(locations.length);

    // // console.log(locations.length);
    // for(let i=0;i < locations.length;i++){
    //   cities[i] = locations[i].city;
    // }
    // for(let i=0;i<categories.length;i++){
    //   categoryDict[categories[i]._id] = categories[i].categoryName
    // }

    // for(let i=0;i < stores.length;i++){
    //   storeDict[stores[i]._id] = stores[i].storeName;
    // }
  // },
  // getCategories: async function(req,res) {
  //   const categories = await categoriesTable.find();
  //   const names= Array(categoriesTable.length);
  //   for(let i=0;i< categories.length;i++){
  //     names[i] = categories[i].categoryName;
  //   }
  //   res.render("admin/products",{
  //     user: req.user,
  //     authenticated: req.isAuthenticated(),
  //     names
  //   });
  // },

  // addCategory: async function(req,res) {
  //   const {categoryName} = req.body;
  //   const category = await categoriesTable.create({
  //     categoryName:categoryName,
  //   });
  //   e.preventdefault();
  //   alert("created a new store successfully");
  //   // console.log("created a new store");
  //   return;
  // }
};