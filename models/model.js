const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CustomerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'Name can\'t be empty',
        // unique: true
    },
     email: {
        type: String,
        required: 'Email can\'t be empty',
        // unique: true
    },
     
      city: {
        type: String,
        required: 'city can\'t be empty',
        // unique: true
    },
    Products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
});
var ProductSchema = new mongoose.Schema({
	 name: {
	        type: String,
	        required: 'Name can\'t be empty',
	        // unique: true
	    },
	     price: {
	        type: String,
	        required: 'price can\'t be empty',
	        // required: true
	    },	    
	    company: { type: Schema.Types.ObjectId, ref: 'Company' },
});
var CompanySchema = new mongoose.Schema({
      name: {
	        type: String,
	        required: 'Name can\'t be empty',
	        
	    },
	   status: {
	        type: String,
	        required: 'status can\'t be empty',
	       
	    }	    
});
 mongoose.model('Customer', CustomerSchema);
 mongoose.model('Product', ProductSchema);
mongoose.model('Company', CompanySchema);
// var customer  = mongoose.model('customer', CustomerSchema);
// var product  = mongoose.model('product', ProductSchema);
// var company  = mongoose.model('company', CompanySchema);