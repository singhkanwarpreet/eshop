var express = require('express');
var router = express.Router();

const session = require('express-session');
const nodemailer = require('nodemailer');
//----------------------------------------------------------------------------------------------
//  --* Connection Module *--
var conn = require('../connection');
//  --* File Upload Module *--
const save_file_on_server = require('../uploadfile');
//----------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------

// Show Products Subcategory Vise

router.get('/showProductsSubcategoryVise', (req, res) => {
    console.log(req.query);
    let id = req.query.id;
    console.log(id);
    let Query = "SELECT * FROM `product` where subcategoryid='" + id + "'";
    conn.query(Query, (err, rows) => {
        if (err) throw err;

        res.render('showSubcategoryProduct.ejs', {'data': rows});
    })
})

//----------------------------------------------------------------------------------------------

// Get Men Subcategory
router.get("/getMenSubcategoryAction", (req, res) => {
    let name = 'men';
    let Query = "SELECT subcategory.subcategoryid,subcategory.subcategoryname,category.categoryname FROM `subcategory` INNER JOIN category ON subcategory.categoryid=category.categoryid WHERE category.categoryname='" + name + "'";
    conn.query(Query, (err, rows) => {
        // console.log(rows.length);
        if (err) throw err;
        res.send(rows);
    })
});

// Get Women Subcategory
router.get("/getWomenSubcategoryAction", (req, res) => {
    let name = 'women';
    let Query = "SELECT subcategory.subcategoryid,subcategory.subcategoryname,category.categoryname FROM `subcategory` INNER JOIN category ON subcategory.categoryid=category.categoryid WHERE category.categoryname='" + name + "'";
    conn.query(Query, (err, rows) => {
        // console.log(rows.length);
        if (err) throw err;
        res.send(rows);
    })
});

// Get Kids Subcategory
router.get("/getKidsSubcategoryAction", (req, res) => {
    let name = 'kids';
    let Query = "SELECT subcategory.subcategoryid,subcategory.subcategoryname,category.categoryname FROM `subcategory` INNER JOIN category ON subcategory.categoryid=category.categoryid WHERE category.categoryname='" + name + "'";
    conn.query(Query, (err, rows) => {
        // console.log(rows.length);
        if (err) throw err;
        res.send(rows);
    })
});

//----------------------------------------------------------------------------------------------

//--> Page: views/index.ejs

// Get Cart Product
router.get("/getCartProductsFromServer", (req, res) => {

    let cart = [];

    if (session.cart != undefined) {
        cart = session.cart;
    }

    res.send(cart);
});

// Add To Cart
router.post('/addToCartSelectedProduct', (req, res) => {

    console.log(req.body);

    let cart = [];
    //--> != undefined means SESSION is there.. 
    if (session.cart != undefined) {
        cart = session.cart;
    }

    let action = req.body.action;

    // To ADD Product in CART
    if (action == 'add') {
        let productobj = JSON.parse(req.body.product_obj);

        //--> To check Current PRODUCT user choose is already Exist or Not in CART.
        let productid = req.body.productid;
        let isexist = false;
        for (let i = 0; i < cart.length; i++) {
            
            if (cart[i].productid == productobj.productid) {
                isexist = true;
                break;
            }
        }
        //--> //To check Current PRODUCT user choose is already Exist or Not in CART.

        // If PRODUCT not exist in Cart.
        if (isexist == false) {

            productobj.qty = 1;
            cart.push(productobj);
            session.cart = cart;
            console.log(cart);
            res.send("" + cart.length);
        }
        // If PRODUCT exist (isexist == true) in Cart.
        else {
            res.send("duplicate");
        }
    }
    // To remove(DELETE) Product from CART
    else if (action == 'delete') {

        let tempcart = [];

        let productid = req.body.productid;

        for (let i = 0; i < cart.length; i++) {
            
            if (cart[i].productid != productid) {
                tempcart.push(cart[i]);
            }
        }
        session.cart = tempcart;
        res.send("" + cart.length);
    }

});
//----------------------------------------------------------------------------------------------

// To show all Products in Index Page.
router.get('/getAllProductsInIndexPage', (req, res) => {

    let Query = "select * from product order by product.productname asc";
    conn.query(Query, function (err, rows) {
        if (err) throw  err;
        console.log("Rows Length --> " + rows.length);
        res.send(rows);
    })
});
//----------------------------------------------------------------------------------------------

// SEARCH BAR --> SEARCH PRODUCT
router.post('/searchProductAction', (req, res) => {
    console.log(req.body)
    if (req.body.category === undefined) {
        let search = req.body.searchProduct;
        if (search == '') {
            console.log(search);
            res.send("empty");
        }
        //
        else {
            let Query = "select * from product where productname like '%" + search + "%' order by product.productname asc";
            console.log(Query);
            conn.query(Query, function (err, rows) {
                if (err) throw  err;

                res.render('searchProduct.ejs', {'data': rows});
            })
        }
    } else {
        let categoryid = req.body.category;
        let Query = "SELECT * FROM `product` INNER JOIN subcategory on product.subcategoryid=subcategory.subcategoryid where subcategory.categoryid=" + categoryid;
        console.log(Query);
        conn.query(Query, function (err, rows) {
            if (err) throw  err;
            res.send(rows);
        })
    }
})

/* GET Searched Products page. */
router.get('/searchedproduct', function (req, res) {
    res.render('searchProduct.ejs');
});

//----------------------------------------------------------------------------------------------

/* GET Products page. */
router.get('/product', function (req, res) {
    res.render('products.ejs');
});

//----------------------------------------------------------------------------------------------

// ADD Feedback
router.post('/feedback_Request', (req, res) => {
    let fullname = req.body.fullname;
    let conEmail = req.body.conEmail;
    let messageBox = req.body.messageBox;

    // datetime --> Javascript
    let currentDate = new Date();
    let cDay = currentDate.getDate();
    let cMonth = currentDate.getMonth() + 1;
    let cYear = currentDate.getFullYear();

    let datetime = cYear + '-' + cMonth + '-' + cDay + " " + currentDate.getHours() + ":" + currentDate.getMinutes() + ":" + currentDate.getSeconds();
    // console.log(datetime);

    // INSERT INTO `contactus`(`conid`, `fullname`, `conEmail`, `messageBox`, `datetime`) VALUES ()
    let Query = "INSERT INTO `contactus` VALUES(null,'" + fullname + "','" + conEmail + "','" + messageBox + "','" + datetime + "')";
    console.log(Query);
    conn.query(Query, (err) => {
        if (err) throw err;
        res.send('added');
    })
});

/* GET Contact page. */
router.get('/contact', function (req, res) {
    res.render('contact.ejs');
});

//----------------------------------------------------------------------------------------------

/* GET About page. */
router.get('/about', function (req, res) {
    res.render('about.ejs');
});

//----------------------------------------------------------------------------------------------

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index');
    // res.render('index', { title: 'Express' });
});
//----------------------------------------------------------------------------------------------

module.exports = router;
