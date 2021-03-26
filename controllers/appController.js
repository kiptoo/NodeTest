const mongoose = require('mongoose');
const _ = require('lodash');
const path = require('path');
const { forEach } = require('lodash');
multer = require('multer')
bodyParser = require('body-parser');
const Customer = mongoose.model('Customer');
const Product = mongoose.model('Product');
const Company = mongoose.model('Company');
var unirest = require("unirest");

module.exports.createCompany = (req, res, next) => {
	console.log(req.body)
    var company = new Company();
    company.name = req.body.name;
    company.status = req.body.status;
   


    company.save((err, doc) => {
        if (!err)
            res.send(doc);
        else {
            if (err.code == 11000)
                res.status(422).send(['Duplicate email adrress found.']);
            else
                return next(err);
        }

    });
}
module.exports.GetCompany = (req,res,next)=>{
	if (req.params._id) {

		const id = req.params._id;

		console.log(id);

	    Company.find({_id:id})
	    .exec(function (err, companies) {
 			
 			if (err) {
                throw err;
            } else {
                res.status(200).json(companies);
            }

	        // res.send(companyMap);

	    });
	}
	else{
    Company.find({})
    .exec(function (err, companies) {

        var companyMap = [];

        companies.forEach(function (company) {

            companyMap.push(company);
        });

        res.send(companyMap);

    });
}
}
module.exports.updateCompany = (req, res, next) => {
    const id = req.params._id;
    const newCompanyData = req.body;
   
    Company.findByIdAndUpdate(id, { $set: newCompanyData }, (err, doc) => {
        if (err) return res.send(err.message)
        if (doc) return res.send(doc);
    })
}
module.exports.deleteCompany = (req,res,next)=>{
    Company.findByIdAndDelete(
        req.params._id,
        function (error, result) {
            if (error) {
                return res.status(500).send({
                        error: {
                            error: e.message
                        }
                    });
            } else {
                res.status(200).json(result);
            }
        }
    );
}
module.exports.GetCompanyByCity = (req,res,next)=>{
   Company.aggregate([{ $match: { 'city': req.params.query } }],
        function (error, result) {
            if (error) {
                return res.status(500).send({
                        error: {
                            error: e.message
                        }
                    });
            } else {
                res.status(200).json(result);
            }
        }
    );
}

module.exports.GetCompanyByCity = (req,res,next)=>{
   Company.aggregate([{ $match: { 'city': req.params.query } }],
        function (error, result) {
            if (error) {
                return res.status(500).send({
                        error: {
                            error: e.message
                        }
                    });
            } else {
                res.status(200).json(result);
            }
        }
    );
}
module.exports.CompanyDetails = (req,res,next)=>{
	var param =req.params.query
	var query =req.body
   Company.find([{ $match: { 'city': req.params.query } }],
        function (error, result) {
            if (error) {
                return res.status(500).send({
                        error: {
                            error: e.message
                        }
                    });
            } else {
                res.status(200).json(result);
            }
        }
    );
}

module.exports.PopularProducts = (req,res,next)=>{
	// var city = req.params.city
	// console.log(req.query)
	var query =req.body
	// var city="london";
	var city=0;
	var product=0;
	// var company=0;
	// var company="Sir Edwards LTD";
	// var company=req.query.company;
	var city=req.query.city;
	var query  = Object.keys(req.query)[0] ;

	console.log(query)

	if (query=='city') {
  Customer.aggregate(
  [
    { $match : { city : req.query.city } },
    { $unwind : "$product" },

    // { $group : { _id : "$product" , sales : { $sum : 1 },customers: { $push: '$product' } } },
      { $group : { _id : "$product" , sales : { $sum : 1 }} },
    {
        
        $lookup: {
            from: 'products',
            localField: '_id',
            foreignField: '_id',
            as: 'product'
        
         }
    },

    //    { $unwind : "$customers" },
    //  {
    // 	$lookup: {
    //         from: 'customers',
    //         localField: '_id',
    //         foreignField: 'product',
    //         as: 'customers'
        
    //      }
    // },
  

     { $unwind : "$product" },
     {
    	$lookup: {
            from: 'companies',
            localField: 'product.company',
            foreignField: '_id',
            as: 'product.company'
        
         }
    },
   

    // {$arrayToObject: "$product"},
    { $sort : { sales : -1 } },
    // { $limit : 5 }
  ],
     async   function  (error, result) {
            if (error) {
                return res.status(500).send({
                        error: {
                            error: error.message
                        }
                    });
            } else {

            	return  res.status(200).json(result);

            }}
            );

   }
   	else if (query=='company') {
Customer.aggregate(
  [
   
    { $unwind : "$product" },

    // { $group : { _id : "$product" , sales : { $sum : 1 },customers: { $push: '$product' } } },
      // { $group : { _id : "$product" , sales : { $sum : 1 }} },
    {
        
        $lookup: {
            from: 'products',
            localField: 'product',
            foreignField: '_id',
            as: 'product'
        
         }
    },

    //    { $unwind : "$customers" },
    //  {
    // 	$lookup: {
    //         from: 'customers',
    //         localField: '_id',
    //         foreignField: 'product',
    //         as: 'customers'
        
    //      }
    // },
  

     { $unwind : "$product" },
     {
    	$lookup: {
            from: 'companies',
            localField: 'product.company',
            foreignField: '_id',
            as: 'company'
        
         }
    },
     { $match : { "company.name" : req.query.company } },
     { $group : { _id : "$city" , sales : { $sum : 1 },customers: { $push: '$$ROOT'} } },
    // {$arrayToObject: "$product"},
    { $sort : { sales : -1 } },
    // { $limit : 5 }
  ],
     async   function  (error, result) {
            if (error) {
                return res.status(500).send({
                        error: {
                            error: error.message
                        }
                    });
            } else {

            	return  res.status(200).json(result);

            }}
            );

   }
   	else {
  Customer.aggregate(
  [
    // { $match : { city : city } },
    { $unwind : "$product" },

    // { $group : { _id : "$product" , sales : { $sum : 1 },customers: { $push: '$product' } } },
      { $group : { _id : "$product" , sales : { $sum : 1 }} },
    {
        
        $lookup: {
            from: 'products',
            localField: '_id',
            foreignField: '_id',
            as: 'product'
        
         }
    },
  

     // { $unwind : "$customers" },
    //  {
    // 	$lookup: {
    //         from: 'customers',
    //         localField: '_id',
    //         foreignField: 'product',
    //         as: 'customers'
        
    //      }
    // },

    // {$arrayToObject: "$product"},
    { $sort : { sales : -1 } },
    { $limit : 5 }
  ],
     async   function  (error, result) {
            if (error) {
                return res.status(500).send({
                        error: {
                            error: error.message
                        }
                    });
            } else {

            	return  res.status(200).json(result);

            }}
            );

   }
}
module.exports.customersList  = async (req,res,next)=>{
	// var city = req.params.city
	// console.log(req.query)
	var query =req.body
	// var city="london";
	var city=0;
	var product=0;
	// var company=0;
	// var company="Sir Edwards LTD";
	// var company=req.query.company;
	var city = req.query.city;
	var query  = Object.keys(req.query)[0] ;
	if(req.query.company){
    var companies = req.query.company.split(",");
      }
	// console.log(req.query.customer)
	if (req.query.customer) {
	 var customers = req.query.customer.split(",");
	 console.log(customers)
	}

	if (query=='customer') {
 var  companyMap =[];
   		// companies.forEach( async function (company) {
   			 for (let customer of customers) {
         
         console.log(customer)
          
       
 await  Customer.aggregate(
  [
    
     { $match : { "name" : customer } },
    { $unwind : "$product" },

    { $group : { _id : "$product" , purchases : { $sum : 1 },products: { $push: '$product' } } },
      // { $group : { _id : "$product" , sales : { $sum : 1 }} },
      { $unwind : "$products" },
    {
        

        $lookup: {
            from: 'products',
            localField: '_id',
            foreignField: '_id',
            as: 'products'
        
         }
    },

    //    { $unwind : "$customers" },
    //  {
    // 	$lookup: {
    //         from: 'customers',
    //         localField: '_id',
    //         foreignField: 'product',
    //         as: 'customers'
        
    //      }
    // },
  

     { $unwind : "$products" },
     {
    	$lookup: {
            from: 'companies',
            localField: 'products.company',
            foreignField: '_id',
            as: 'companies'
        
         }
    },
     // { $unwind : "$company" },
    
     // { $group : { _id : "$city" , sales : { $sum : 1 },customers: { $push: '$$ROOT'} } },
    // {$arrayToObject: "$product"},
    { $sort : { sales : -1 } },
    // { $limit : 5 }
  ],
        function async (error, result) {
     	  
            if (error) {
                return res.status(500).send({
                        error: {
                            error: error.message
                        }
                    });
            } else {
               // return result;
            	// return  res.status(200).json(result);
                var res={};
            	 res[customer]=result
            	 companyMap.push(res);
            	 // console.log(res)

            }
            // var res={};
            // 	 res[company]=result
            // 	 companyMap.push(result);
        }
            );
           // console.log(data)   
           // companyMap.push(data); 
    };

   		// console.log(companyMap)
  return  res.status(200).json(companyMap);


   }
   	else if (query=='company') {
   		 var  companyMap =[];
   		// companies.forEach( async function (company) {
   			 for (let company of companies) {
         
         console.log(company)
          
       
 await  Customer.aggregate(
  [
   
    { $unwind : "$product" },

    // { $group : { _id : "$product" , sales : { $sum : 1 },customers: { $push: '$product' } } },
      // { $group : { _id : "$product" , sales : { $sum : 1 }} },
    {
        
        $lookup: {
            from: 'products',
            localField: 'product',
            foreignField: '_id',
            as: 'product'
        
         }
    },

    //    { $unwind : "$customers" },
    //  {
    // 	$lookup: {
    //         from: 'customers',
    //         localField: '_id',
    //         foreignField: 'product',
    //         as: 'customers'
        
    //      }
    // },
  

     { $unwind : "$product" },
     {
    	$lookup: {
            from: 'companies',
            localField: 'product.company',
            foreignField: '_id',
            as: 'company'
        
         }
    },
     { $unwind : "$company" },
     { $match : { "company.name" : company } },
     // { $group : { _id : "$city" , sales : { $sum : 1 },customers: { $push: '$$ROOT'} } },
    // {$arrayToObject: "$product"},
    { $sort : { sales : -1 } },
    // { $limit : 5 }
  ],
        function async (error, result) {
     	  
            if (error) {
                return res.status(500).send({
                        error: {
                            error: error.message
                        }
                    });
            } else {
               // return result;
            	// return  res.status(200).json(result);
                var res={};
            	 res[company]=result
            	 companyMap.push(res);
            	 // console.log(res)

            }
            // var res={};
            // 	 res[company]=result
            // 	 companyMap.push(result);
        }
            );
           // console.log(data)   
           // companyMap.push(data); 
    };

   		// console.log(companyMap)
  return  res.status(200).json(companyMap);

   }
   	else {
  Customer.aggregate(
  [
    // { $match : { city : city } },
    { $unwind : "$product" },

    // { $group : { _id : "$product" , sales : { $sum : 1 },customers: { $push: '$product' } } },
      { $group : { _id : "$product" , sales : { $sum : 1 }} },
    {
        
        $lookup: {
            from: 'products',
            localField: '_id',
            foreignField: '_id',
            as: 'product'
        
         }
    },
  

     // { $unwind : "$customers" },
    //  {
    // 	$lookup: {
    //         from: 'customers',
    //         localField: '_id',
    //         foreignField: 'product',
    //         as: 'customers'
        
    //      }
    // },

    // {$arrayToObject: "$product"},
    { $sort : { sales : -1 } },
    { $limit : 5 }
  ],
     async   function  (error, result) {
            if (error) {
                return res.status(500).send({
                        error: {
                            error: error.message
                        }
                    });
            } else {

            	return  res.status(200).json(result);

            }}
            );

   }
}

module.exports.createProduct = (req, res, next) => {
    var product = new Product();
    product.name = req.body.name;
    product.price = req.body.price;
    product.company = req.body.company;




    product.save((err, doc) => {
        if (!err)
            res.send(doc);
        else {
            if (err.code == 11000)
                res.status(422).send(err);
            else
                return next(err);
        }

    });
}
module.exports.GetProduct = (req,res,next)=>{
   	if (req.params._id) {

		const id = req.params._id;

		console.log(id);

	    Product.find({_id:id})
	    .exec(function (err, product) {
 			
 			if (err) {
                throw err;
            } else {
                res.status(200).json(product);
            }

	        // res.send(companyMap);

	    });
	}
	else{
    Product.find({})
    .exec(function (err, products) {

        var productMap = [];

        products.forEach(function (product) {

            productMap.push(product);
        });

        res.send(productMap);

    });
}
}
module.exports.updateProduct = (req, res, next) => {
    const id = req.params._id;
    const newProductData = req.body;
   
    Product.findByIdAndUpdate(id, { $set: newProductData }, (err, doc) => {
        if (err) return res.send(err.message)
        if (doc) return res.send(doc);
    })
}
module.exports.deleteProduct = (req,res,next)=>{
    Product.findByIdAndDelete(
        req.params._id,
        function (error, result) {
            if (error) {
                return res.status(500).send({
                        error: {
                            error: e.message
                        }
                    });
            } else {
                res.status(200).json(result);
            }
        }
    );
}
module.exports.createCustomer = (req, res, next) => {
    var customer = new Customer();
    customer.name = req.body.name;
    customer.email = req.body.email;
    customer.city=req.body.city;
     customer.product = req.body.product;



    customer.save((err, doc) => {
        if (!err)
            res.send(doc);
        else {
            if (err.code == 11000)
                // res.status(422).send(['Duplicate email adrress found.']);
             res.status(422).send(err);
            else
                return next(err);
        }

    });
}
module.exports.GetCustomer = (req,res,next)=>{
	   	if (req.params._id) {

		const id = req.params._id;

		console.log(id);

	    Customer.find({_id:id})
	    .exec(function (err, product) {
 			
 			if (err) {
                throw err;
            } else {
                res.status(200).json(product);
            }

	        // res.send(companyMap);

	    });
	}
	else{
    Customer.find({})
    .exec(function (err, customers) {

        var customersMap = [];

        customers.forEach(function (customer) {

            customersMap.push(customer);
        });

        res.send(customersMap);

    });
}

}
module.exports.updateCustomer = (req, res, next) => {
    const id = req.params._id;
    const newCustomerData = req.body;
   
    Customer.findByIdAndUpdate(id, { $set: newCustomerData }, (err, doc) => {
        if (err) return res.send(err.message)
        if (doc) return res.send(doc);
    })
}
module.exports.deleteCustomer = (req,res,next)=>{
    Customer.findByIdAndDelete(
        req.params._id,
        function (error, result) {
            if (error) {
                return res.status(500).send({
                        error: {
                            error: e.message
                        }
                    });
            } else {
                res.status(200).json(result);
            }
        }
    );
}
module.exports.GetCustomerByCity = (req,res,next)=>{
	console.log(req.query.city)

	    Customer.find({ city: req.query.city })
	     //.where('City').equals(req.query.city)
	    
	     .where('city').equals(req.query.city)
	    .exec(function (err, customers) {
 			console.log(customers)
 			if (err) {
                throw err;
            } else {
    //             res.status(200).json(product);
    //         }
       var customersMap = [];

        customers.forEach(function (customer) {
        	console.log(customer)

            customersMap.push(customer);
        });

        res.send(customersMap);
    }

	        // res.send(companyMap);

	    });
  //  Customer.find({
  //   City: req.query.city,    
  //    // likes: { $in: [req.query.city] }
  // }).exec(
  //       function (error, result) {
  //           if (error) {
  //               return res.status(500).send({
                    //     error: {
                    //         error: e.message
                    //     }
                    // });
  //           } else {
  //               res.status(200).json(result);
  //           }
  //       }
  //   );
}