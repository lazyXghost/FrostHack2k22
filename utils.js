const storeTable = require("./models/store");
const userTable = require("./models/user");
// const locationTable = require("./models/location");
// const categoriesTable = require("./models/category");
const productTable = require("./models/product");
const orderTable = require("./models/order");
const bcrypt = require("bcryptjs");
const passport = require("passport");


module.exports = {
  userLogIn: passport.authenticate("user-local", {
    successRedirect: "/",
    failureRedirect: "/login",
  }),
  storeLogIn: passport.authenticate("store-local", {
    successRedirect: "/store",
    failureRedirect: "/store/login",
  }),
  adminLogIn: passport.authenticate("admin-local", {
    successRedirect: "/admin",
    failureRedirect: "/admin/login",
  }),

  userRegister: async function(formData) {
    const {
      name,
      email,
      password,
      phoneNumber,
      pincode,
      city,
      state,
    } = formData;
    const encryptedPassword = await bcrypt.hash(password, 10);
    await userTable.create({
      name: name,
      email: email.toLowerCase(),
      password: encryptedPassword,
      phoneNumber: phoneNumber,
      address: {
        pincode: pincode,
        state: state,
        city: city,
        house: "gibberish",
        street: "gibberish",
        colony: "gibberish",
      },
    });
    //   e.preventdefault();
    //   alert("created a new store successfully");
  },
  storeRegister: async function(formData, status) {
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
    } = formData;
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
      status: status
    });
    //   e.preventdefault();
    //   alert("created a new store successfully");
  },

  addProduct: async function (formData, status) {
    const {
      name,
      costPrice,
      mrp,
      salePrice,
      quantity,
      description,
      storeID
    } = formData;
    await productTable.create({
      name: name,
      storeID: storeID,
      categoryID: "noCategoryYet",
      costPrice: costPrice,
      mrp: mrp,
      salePrice: salePrice,
      quantity: quantity,
      description: description,
      status: status
    });
  },
  placeOrder: async function(formData){
    const {
      quantity,
      firstname,
      email,
      userID,
      house,
      street,
      colony,
      city,
      state,
      pincode,
      productID
    } = formData;
    await orderTable.create({
      userID: userID,
      orderTime: new Date(),
      products: [{
        productID: productID,
        quantity: quantity
      }],
      orderNumber: 101,
      shippingAddress: {
        house: house,
        street: street,
        colony: colony,
        pincode: pincode,
        city: city,
        state: state
      },
    })
  }
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