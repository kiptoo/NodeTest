const express = require('express');
const router = express.Router();
const ctrlApp = require('../controllers/appController');
const Model = require('../models/model')

router.get('/', (req, res, next) => {
  console.log("yes")
  res.send("header");
});
const PATH = '../front_end/src/assets/images';
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, PATH);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
});
let upload = multer({
  storage: storage
});

router.post('/new/company', ctrlApp.createCompany);
router.get('/companies', ctrlApp.GetCompany);
router.get('/company/:_id', ctrlApp.GetCompany);
router.post('/update/company/:_id', ctrlApp.createCompany);
router.post('/delete/company/:_id', ctrlApp.deleteCustomer);
router.get('/companies_by_city', ctrlApp.GetCompanyByCity);



router.post('/new/product', ctrlApp.createProduct);
router.get('/products', ctrlApp.GetProduct);
router.get('/product/:_id', ctrlApp.GetProduct);
router.post('/update/product/:_id', ctrlApp.createProduct);
router.post('/delete/product/:_id', ctrlApp.deleteCustomer);
router.get('/products_by_company', ctrlApp.GetProduct);

router.post('/new/customer', ctrlApp.createCustomer);
router.get('/customers', ctrlApp.GetCustomer);
router.get('/customer/:_id', ctrlApp.GetCustomer);
router.post('/update/customer/:_id', ctrlApp.updateCustomer);
router.post('/delete/customer/:_id', ctrlApp.deleteCustomer);
router.get('/customers_by_city', ctrlApp.GetCustomerByCity);



// router.get('/products', ctrlApp.GetProduct);
// router.get('/customers', ctrlApp.GetCustomer);

// router.post('/update/company/:_id', ctrlApp.createCompany);
// router.post('/update/product/:_id', ctrlApp.createProduct);
// router.post('/update/customer/:_id', ctrlApp.createCustomer);

// router.post('/delete/company/:_id', ctrlApp.createCompany);
// router.post('/delete/product/:_id', ctrlApp.createProduct);
// router.post('/delete/customer/:_id', ctrlApp.createCustomer);




module.exports = router;