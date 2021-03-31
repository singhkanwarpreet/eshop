var express = require('express');
var router = express.Router();

const query = require('querystring');
const session = require('express-session');
const nodemailer = require('nodemailer');
//----------------------------------------------------------------------------------------------
//  --* Connection Module *--
var conn = require('../connection');
//  --* File Upload Module *--
const save_file_on_server = require('../uploadfile');
//----------------------------------------------------------------------------------------------
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

                res.render('users/searchProduct.ejs', {'data': rows});
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
//----------------------------------------------------------------------------------------------

// Show Products Subcategory Vise

router.get('/showProductsSubcategoryVise', (req, res) => {
    console.log(req.query);
    let id = req.query.id;
    console.log(id);
    let Query = "SELECT * FROM `product` where subcategoryid='" + id + "'";
    conn.query(Query, (err, rows) => {
        if (err) throw err;

        res.render('users/showSubcategoryProduct.ejs', {'data': rows});
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

//--> Page: views/users/changePasswordtUser.ejs

//     --* UPDATE User password Request Handler *--
router.post("/userUpdatePassword", (req, res) => {
    let username = req.body.username;
    let oldpassword = req.body.oldpassword;
    let newpassword = req.body.newpassword;
    let confirmpassword = req.body.confirmpassword;

    // CHECK Old Password is Matching or Not.
    let passwordQuery = "select * from users where username='" + username + "' and password='" + oldpassword + "'";
    conn.query(passwordQuery, (err, rows) => {
        if (err) throw err;

        if (rows.length > 0) {

            let updateQuery = "update users set password='" + newpassword + "' where username='" + username + "'";
            conn.query(updateQuery, (err) => {
                if (err) throw err;
                res.send("success");
            })
        } else {
            res.send("Invalid old password");
        }
    })
});

/* Render User Change Password page. */
router.get("/userchangepassword", (req, res) => {
    res.render("users/changePassword.ejs")
});
//----------------------------------------------------------------------------------------------

//--> Page: views/users/myCancelled_Order_User.ejs

// get Cancelled Orders Request Handler
router.get('/get_Cancelled_Orders_Request', (req, res) => {
    let username = session.user_username;

    let Query = "SELECT `id`, `grandtotal`, `paymentmethod`, `province`, `postalcode`, `address`, `remarks`, `status`, `username`, date_format(`datetime`,'%Y-%m-%dT%T') as datetime FROM `bill` where username='" + username + "' and `status`='cancelled' order by id desc";
    console.log(Query);
    conn.query(Query, function (err, rows) {
        if (err) throw err;
        res.send(rows);
    })
});


// /* Render My Orders page. */
router.get("/cancelledorders", (req, res) => {
    res.render("users/myCancelled_Order.ejs")
});
//----------------------------------------------------------------------------------------------
//--> Page: views/users/myOrders_User.ejs

// Update STATUS -> Cancel
router.post('/cancel_Order_request', (req, res) => {
    let cancelid = req.body.cancelid;
    console.log(req.body);

    // UPDATE `bill` SET `status`=[value-9] WHERE 1
    let Query = "UPDATE `bill` SET `status`='cancelled' WHERE `id`='" + cancelid + "'";
    console.log(Query);
    conn.query(Query, (err) => {
        if (err) throw err;

        res.send('updated');
    })
});

// Order_Details Request Handler
router.post('/get_My_OrdersDetails_Request', (req, res) => {
    let id = req.body.id;

    // let Query = "SELECT * from bill_detail INNER JOIN product on bill_detail.productid=product.productid where bill_detail.billid='" + id + "'";
    let Query = "SELECT bill_detail.id,bill_detail.price,bill_detail.discount,bill_detail.netprice,bill_detail.quantity,product.productname,product.photo,product.pdescription FROM bill_detail INNER JOIN product ON bill_detail.productid=product.productid WHERE bill_detail.billid='" + id + "'";
    conn.query(Query, function (err, rows) {
        if (err) throw err;

        console.log(rows);
        res.send(rows);
    })
});

// get Orders Request Handler
router.get('/get_My_Orders_Request', (req, res) => {
    let username = session.user_username;

    // let Query = "SELECT `id`, `grandtotal`, `paymentmethod`, `province`, `postalcode`, `address`, `remarks`, `status`, `username`, date_format(`datetime`,'%Y-%m-%dT%T') as datetime FROM `bill` where username='" + username + "'";
    let Query = "SELECT `id`, `grandtotal`, `paymentmethod`, `province`, `postalcode`, `address`, `remarks`, `status`, `username`, date_format(`datetime`,'%Y-%m-%dT%T') as datetime FROM `bill` where username='" + username + "' order by id desc";
    // let Query = "SELECT bill_detail.price,bill_detail.discount,bill_detail.netprice,bill_detail.quantity,bill_detail.productid,product.productname,product.photo,product.pdescription FROM bill_detail INNER JOIN product ON bill_detail.productid=product.productid";
    console.log(Query);
    conn.query(Query, function (err, rows) {
        if (err) throw err;

        res.send(rows);
    })
});

// /* Render My Orders page. */
router.get("/myorders", (req, res) => {

    res.render("users/myOrders.ejs")
});
//----------------------------------------------------------------------------------------------

// Get Cart Product
router.get("/getCartProductsFromServer", (req, res) => {

    let cart = [];

    if (session.cart != undefined) {
        cart = session.cart;
    }

    res.send(cart);
});

// Get Stock Of Product
function getcurrentstock(productid) {

    return new Promise((resolve, reject) => {
        let totalstock = 0;
        let totalsoldstock = 0;

        let Query = "SELECT ifnull( sum(qty),0) as totalstock from stocks where  productid='" + productid + "'";
        console.log(Query);
        conn.query(Query, function (err, rows) {
            if (err) {
                reject(err);
            }

            // console.log(rows);
            totalstock = rows[0]['totalstock'];
            console.log("Total stock " + totalstock);

            let Query2 = "SELECT ifnull( sum(quantity),0) as totalsoldstock from `bill_detail` where  productid='" + productid + "'";
            console.log(Query2);
            conn.query(Query2, function (err, rows) {
                if (err) {
                    reject(err);
                }

                // console.log(rows);
                totalsoldstock = rows[0]['totalsoldstock'];
                console.log("Solds stock " + totalsoldstock);

                resolve(totalstock - totalsoldstock);
                console.log(totalstock - totalsoldstock);
            });
        })
    });
}

// ADD TO CART Request Handler || +,- Button
router.post('/addToCartSelectedProduct', async (req, res) => {

    console.log(req.body);

    let cart = [];
    
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
    // +,- BUTTON working
    else if (action == 'less' || action == 'inc') {

        let cart = session.cart;
        let productid = req.body.productid;

        let currentstock = await getcurrentstock(productid);

        for (let i = 0; i < cart.length; i++) {
            if (cart[i].productid == productid) {

                if (action == 'less') {
                    if (cart[i].qty > 1) {
                        cart[i].qty = cart[i].qty - 1;
                    }
                } else {
                    if (cart[i].qty < 5) {
                        if (currentstock > cart[i].qty) {
                            cart[i].qty = cart[i].qty + 1;
                        }
                    }
                }
                break;
            }
        }
        session.cart = cart;
        res.send("" + cart.length);
    }
});

// ----------------------------------------------------------------------------------------------

//--> Page: views/users/viewCart.ejs

// Paymet Request Handler
router.post('/paymetRequest', (req, res) => {

    if( session.cart !=undefined)
    {
    if (session.user_username == undefined) {
        res.send("");
    } else {

        // grandtotal
        let grandtotal = req.body.grandtotal;
        session.grandtotal = grandtotal;

        // datetime --> Javascript
        let currentDate = new Date();
        let cDay = currentDate.getDate();
        let cMonth = currentDate.getMonth() + 1;
        let cYear = currentDate.getFullYear();

        let datetime = cYear + '-' + cMonth + '-' + cDay + " " + currentDate.getHours() + ":" + currentDate.getMinutes() + ":" + currentDate.getSeconds();

        let paymentmethod = req.body.paymentmethod;
        let province = req.body.province;
        let postalcode = req.body.postalcode;
        let address = req.body.address;
        let remarks = req.body.remarks;

        let status = '';
        if (paymentmethod == 'COD') {
            status = 'placed';
        } else {
            status = 'payment pending';
        }

        // Get username from SESSION..
        let username = session.user_username;

        let subQuery = "select * from users where username='" + username + "'";
        conn.query(subQuery, (err, rows) => {
            if (err) throw err;

            // if Username found from users Table
            if (rows.length > 0) {
                let email = rows[0].email;

                // Now generate  message to send USER.
                let message = 'Your order is placed at ' + datetime + '. You will receive your order within 5-6 working days. Thankyou for shopping with us.';
                console.log(message);

                let Query = "insert into bill values(null,'" + grandtotal + "','" + datetime + "','" + paymentmethod + "','" + province + "','" + postalcode + "','" + address + "','" + remarks + "'," +
                    "'" + status + "','" + username + "')";
                console.log(Query);
                conn.query(Query, (err, result, fields) => {
                    if (err) throw err;

                    let billid = result.insertId;
                    session.billid = billid;

                    let cart = [];
                    cart = session.cart;

                    for (let i = 0; i < cart.length; i++) {

                        let price = cart[i].price;
                        let discount = cart[i].discount;
                        let qty = cart[i].qty;
                        let productid = cart[i].productid;

                        let discountedPrice = price - (price * (discount / 100));
                        let netprice = discountedPrice * qty;

                        // INSERT INTO `bill_detail`(`id`, `price`, `discount`, `netprice`, `quantity`, `productid`, `billid`) VALUES ()
                        let detailsQuery = "INSERT INTO `bill_detail`(`id`, `price`, `discount`, `netprice`, `quantity`, `productid`, `billid`)" +
                            " VALUES (null," + discountedPrice + "," + discount + "," + netprice + "," + qty + "," + productid + "," + billid + ")";
                        console.log(detailsQuery);
                        conn.query(detailsQuery, function (err) {
                            if (err) throw err;
                            session.cart=[];
                            res.send("orderSuccess")
                        })
                    }

                    
                });
            }
        });
    }
}
});

/* Render User Login page. */
router.get('/usercart', (req, res) => {
    res.render("users/viewCart.ejs");
});
//----------------------------------------------------------------------------------------------


// SESSION(user) for ViewCart page Request Handler
router.get('/userSession_forCart', (req, res) => {

    if (session.user_username != undefined) {
        res.send(session.user_username);
    } else {
        res.send("");
    }
});
//----------------------------------------------------------------------------------------------

// LOGOUT Request Handler
router.get('/userlogout', (req, res) => {
    session.user_username = undefined;
    res.send("logout");
    console.log(session.user_username);
});
//----------------------------------------------------------------------------------------------

//--> Page: views/users/userLogin.ejs

// LOGIN Request Handler
router.post('/ulogin', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    // let selectQuery = "select * from users where username='" + username + "' and password='" + password + "'";
    let selectQuery = "select * from users where username='" + username + "' and password='" + password + "'";
    conn.query(selectQuery, function (err, rows) {
        if (err) throw err;

        if (rows.length > 0) {
            session.user_username = username;
            res.send("success");
        } else {
            res.send("failed");
        }
    })
});

/* Render User Login page. */
router.get('/userlogin', (req, res) => {
    res.render("users/userLogin.ejs");
});

//----------------------------------------------------------------------------------------------

//--> Page: views/users/userSignup.ejs

router.post('/userSignupRequest', (req, res) => {
    let username = req.body.username;
    let email = req.body.email;
    let firstname = req.body.firstname;
    let lastname = req.body.lastname;
    let password = req.body.password;
    let address = req.body.address;
    let mobileno = req.body.mobileno;

    //--> This Query is to check whether the same USER is trying to SIGNUP or New User..
    var selectQuery = "select * from users where username='" + username + "'";

    //--> Here rows is Object Array..
    conn.query(selectQuery, function (err, rows) {
        console.log(rows.length);
        if (rows.length === 0) {

            // INSERT INTO `users`(`username`, `email`, `password`, `firstname`, `lastname`, `address`, `mobileno`) VALUES ()
            let Query = "INSERT INTO `users` VALUES('" + username + "','" + email + "','" + password + "','" + firstname + "','" + lastname + "'," +
                "'" + address + "','" + mobileno + "')";
            console.log(Query);
            conn.query(Query, (err) => {
                if (err) throw err;

                session.user_username = username;
                res.send("success");
            })
        } else {
            res.send("exist");
        }
    });
});

/* Render User Login page. */
router.get('/usersignup', (req, res) => {
    res.render("users/userSignup.ejs");
});

//----------------------------------------------------------------------------------------------

/* GET users listing. */
router.get('/userdashboard', function (req, res, next) {
    res.render('users/userHome.ejs');
});

/* GET users listing. */
router.get('/', function (req, res, next) {
    // res.send('respond with a resource');
    res.render('users/userHome.ejs');
});
//----------------------------------------------------------------------------------------------

module.exports = router;
