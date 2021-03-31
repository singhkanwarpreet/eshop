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

    // let Query = "SELECT `id`, `grandtotal`, `paymentmethod`, `province`, `postalcode`, `address`, `remarks`, `status`, `username`, date_format(`datetime`,'%Y-%m-%dT%T') as datetime FROM `bill` where username='" + username + "'";
    let Query = "SELECT `id`, `grandtotal`, `paymentmethod`, `province`, `postalcode`, `address`, `remarks`, `status`, `username`, date_format(`datetime`,'%Y-%m-%dT%T') as datetime FROM `bill` order by id desc";
    // let Query = "SELECT bill_detail.price,bill_detail.discount,bill_detail.netprice,bill_detail.quantity,bill_detail.productid,product.productname,product.photo,product.pdescription FROM bill_detail INNER JOIN product ON bill_detail.productid=product.productid";
    console.log(Query);
    conn.query(Query, function (err, rows) {
        if (err) throw err;

        res.send(rows);
    })
});

// /* Render Orders page. */
router.get("/orders", (req, res) => {
    res.render("admin/orders.ejs")
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

// Show Products Subcategory wise

router.get('/showProductsSubcategoryVise', (req, res) => {
    console.log(req.query);
    let id = req.query.id;
    console.log(id);
    let Query = "SELECT * FROM `product` where subcategoryid='" + id + "'";
    conn.query(Query, (err, rows) => {
        if (err) throw err;

        res.render('admin/showSubcategoryProduct.ejs', {'data': rows});
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

//--> Page: views/admin/manageStock.ejs

router.post('/stockRequest', (req, res) => {
    let action = req.body.action;
    let Query = '';

    // get Product Request Handler to show in Select Tag
    if (action == "getproduct") {
        let subcategoryid = req.body.subcategoryid;

        Query = "select * from product where subcategoryid='" + subcategoryid + "' order by `productname` asc";
        conn.query(Query, function (err, rows) {
            if (err) throw err;

            res.send(rows);
        })
    }
    // ADD Stock Request Handler
    else if (action == "add") {

        let qty = req.body.qty;

        // datetime --> Javascript
        let currentDate = new Date();
        let cDay = currentDate.getDate();
        let cMonth = currentDate.getMonth() + 1;
        let cYear = currentDate.getFullYear();

        let datetime = cYear + '-' + cMonth + '-' + cDay + " " + currentDate.getHours() + ":" + currentDate.getMinutes() + ":" + currentDate.getSeconds();

        let productid = req.body.productid;
        console.log(req.body);

        let subQuery = "SELECT * FROM `stocks` WHERE productid='" + productid + "'";
        console.log(subQuery);
        conn.query(subQuery, function (err, rows) {
                if (err) throw  err;

                // productid found
                if (rows.length > 0) {
                    res.send("exist");
                }
                // productid not found, so add new Stock
                else {
                    // INSERT INTO `stocks`(`stockid`, `qty`, `dateofstock`, `productid`) VALUES ()
                    Query = "  INSERT INTO stocks VALUES (null,'" + qty + "','" + datetime + "','" + productid + "')";
                    console.log(Query);
                    conn.query(Query, function (err) {
                        if (err) throw  err;

                        res.send("added");
                    })
                }
            }
        );
    }
    // VIEW Stock Request Handler
    else if (action == "view") {

        // Query = "SELECT product.productid,product.productname,product.pdescription,stocks.qty,stocks.dateofstock,stocks.stockid FROM stocks INNER JOIN product on product.productid=stocks.productid";
        Query = "SELECT product.productid,product.productname,product.pdescription,stocks.qty,stocks.dateofstock,stocks.stockid FROM stocks INNER JOIN product on product.productid=stocks.productid ORDER BY `stockid` DESC";
        // Query ="SELECT product.productid,product.productname,product.pdescription,stocks.qty,stocks.dateofstock FROM stocks INNER JOIN product on product.productid=stocks.productid";
        console.log(Query);
        conn.query(Query, function (err, rows) {
            if (err) throw  err;

            res.send(rows);
        })
    }
    // DELETE Stock Request Handler
    else if (action == "delete") {
        let stockid = req.body.stockid;

        // DELETE FROM `stocks` WHERE 0
        Query = "DELETE FROM `stocks` WHERE stockid='" + stockid + "'";
        console.log(Query);
        conn.query(Query, (err) => {
            if (err) throw err;

            res.send("deleted");
        })
    }
    // UPDATE Stock Request Handler
    else {
        console.log(req.body);

        let stockid = req.body.stockid;
        let qty = req.body.qty_U;

        // datetime --> Javascript
        let currentDate = new Date();
        let cDay = currentDate.getDate();
        let cMonth = currentDate.getMonth() + 1;
        let cYear = currentDate.getFullYear();

        let datetime = cYear + '-' + cMonth + '-' + cDay + " " + currentDate.getHours() + ":" + currentDate.getMinutes() + ":" + currentDate.getSeconds();

        // UPDATE `stocks` SET `stockid`=,`qty`=,`dateofstock`=,`productid`= WHERE 1
        Query = "UPDATE `stocks` SET `qty`='" + qty + "',`dateofstock`='" + datetime + "' WHERE `stockid`='" + stockid + "'";
        console.log(Query);
        conn.query(Query, (err) => {
            if (err) throw err;

            res.send("updated");
        })
    }
});

// /* Render Manage Stock page. */
router.get("/managestock", (req, res) => {
    res.render("admin/mangeStock.ejs")
});
//----------------------------------------------------------------------------------------------

//--> Page: views/admin/manageProduct.ejs

// Product CRUD Operation Request Handler
router.post('/productRequest', (req, res) => {
    let action = req.body.action;
    let Query = '';

    // ADD Product Request Handler
    if (action == "add") {
        let categoryid = req.body.categoryid;
        let subcategoryid = req.body.subcategoryid;
        let productid = req.body.productid;
        let productname = req.body.productname;
        let price = req.body.price;
        let discount = req.body.discount;
        let pdescription = req.body.pdescription;

        let photo = req.files.photo;
        // console.log(photo.name);
        save_file_on_server(photo, 'product_images');
        let photopath = 'product_images/' + photo.name;

        // INSERT INTO `product`(`productid`, `productname`, `price`, `discount`, `photo`, `pdescription`, `subcategoryid`)
        Query = "insert into product values(null,'" + productname + "','" + price + "','" + discount + "','" + photopath + "'," +
            "'" + pdescription + "','" + subcategoryid + "')";
        conn.query(Query, (err) => {
            if (err) throw err;
            res.send('added');
        })
    }
    // VIEW Product Request Handler
    else if (action == "view") {

        // Query = "SELECT * FROM `product` INNER JOIN subcategory ON product.subcategoryid=subcategory.subcategoryid";
        Query = "SELECT * FROM `product` INNER JOIN subcategory ON product.subcategoryid=subcategory.subcategoryid ORDER BY `productid` DESC";
        conn.query(Query, (err, rows) => {
            if (err) throw err;

            res.send(rows);
        })
    }
    // DELETE Product Request Handler
    else if (action == "delete") {
        let productid = req.body.productid;

        // DELETE FROM `admin` WHERE 0
        Query = "DELETE FROM `product` WHERE productid='" + productid + "'";
        conn.query(Query, (err) => {
            if (err) throw err;

            res.send("deleted");
        })
    }
    // SESSION Request Handler
    else if (action == "session") {

        if (session.username != undefined) {
            res.send(session.username);
        } else {
            res.send(""); // Client will receive value of username else receive Empty("") 
        }
    }
    // Get SUB-CATEGORY
    else if (action == "getsubcategory") {

        let category = req.body.categoryid;

        let Query = "select * from subcategory where categoryid='" + category + "'";
        conn.query(Query, function (err, rows) {
            if (err) throw err;

            res.send(rows);
        })
    }
    // UPDATE Product Request Handler
    else {
        let categoryid = req.body.categoryid;
        let subcategoryid = req.body.subcategoryid;
        let productid = req.body.productid;
        let productname = req.body.productname;
        let price = req.body.price;
        let discount = req.body.discount;
        let pdescription = req.body.pdescription;


        let filepath = '';
        if (req.files != null) {
            let photo = req.files.photo;
            // console.log(photo.name);
            save_file_on_server(photo, 'product_images');
            filepath = 'product_images/' + photo.name;
            // console.log(filepath);
        }

        let subQuery = '';
        if (filepath != '') {
            subQuery = ",photo='" + filepath + "'";
        }


        // UPDATE `product` SET `productid`=,`productname`=,`price`=,`discount`=,`photo`=,
        // `pdescription`=,`subcategoryid`= WHERE 1
        Query = "UPDATE `product` SET `productname`='" + productname + "',`price`='" + price + "',`discount`='" + discount + "'" +
            "" + subQuery + ",`pdescription`='" + pdescription + "',`subcategoryid`='" + subcategoryid + "' WHERE `productid`='" + productid + "'";
        console.log(Query);
        conn.query(Query, (err) => {
            if (err) throw err;

            res.send('updated');
        })
    }
});

/* Render Product page. */
router.get("/manageproduct", (req, res) => {
    res.render("admin/manageProduct.ejs")
});
//----------------------------------------------------------------------------------------------
//--> Page: views/admin/manageSub_Category.ejs

// Sub-Category CRUD Operation Request Handler
router.post('/subcategoryRequest', (req, res) => {
    let action = req.body.action;
    let Query = '';

    // ADD Category Request Handler
    if (action == "add") {
        // let categoryid = req.body.categoryid;
        let subcategoryname = req.body.subcategoryname;
        let sdescription = req.body.sdescription;
        let categoryid = req.body.categoryid;


        // (`subcategoryid`, `subcategoryname`, `sdescription`, `categoryid`)
        Query = "insert into subcategory values(null,'" + subcategoryname + "','" + sdescription + "','" + categoryid + "')";
        conn.query(Query, (err) => {
            if (err) throw err;

            res.send('added');
        })
    }
    // VIEW Category Request Handler
    else if (action == "view") {

        Query = "select * from subcategory inner join category on subcategory.categoryid=category.categoryid ORDER BY `subcategoryid` DESC";
        // Query = "select * from subcategory inner join category on subcategory.categoryid=category.categoryid";
        conn.query(Query, (err, rows) => {
            if (err) throw err;

            res.send(rows);
        })
    }
    // DELETE Category Request Handler
    else if (action == "delete") {
        let subcategoryid = req.body.subcategoryid;

        // DELETE FROM `admin` WHERE 0
        Query = "DELETE FROM `subcategory` WHERE subcategoryid='" + subcategoryid + "'";
        conn.query(Query, (err) => {
            if (err) throw err;

            res.send("deleted");
        })
    }
    // SESSION Request Handler
    else if (action == "session") {

        if (session.username != undefined) {
            res.send(session.username);
        } else {
            res.send(""); 
        }
    }
    // UPDATE Category Request Handler
    else {
        let subcategoryid = req.body.subcategoryid;
        let categoryid = req.body.categoryid;
        let subcategoryname = req.body.subcategoryname;
        let sdescription = req.body.sdescription;

        // (`subcategoryid`, `subcategoryname`, `sdescription`, `categoryid`)
        Query = "UPDATE `subcategory` SET `subcategoryname`='" + subcategoryname + "',`sdescription`='" + sdescription + "'," +
            "`categoryid`='" + categoryid + "' WHERE `subcategoryid`='" + subcategoryid + "'";
        console.log(Query);
        conn.query(Query, (err) => {
            if (err) throw err;

            res.send('updated');
        })
    }
});

/* Render Sub_Category page. */
router.get("/managesubcategory", (req, res) => {
    res.render("admin/manageSub_Category.ejs")
});
//----------------------------------------------------------------------------------------------

//--> Page: views/admin/manageCategory.ejs

// Category CRUD Operation Request Handler
router.post('/categoryRequest', (req, res) => {
    let action = req.body.action;
    let Query = '';

    // ADD Category Request Handler
    if (action == "add") {
        // let categoryid = req.body.categoryid;
        let categoryname = req.body.categoryname;
        let description = req.body.description;
        let supercategory = req.body.supercategory;


        // (`categoryid`, `categoryname`, `description`, `supercategory`)
        Query = "insert into category values(null,'" + categoryname + "','" + description + "','" + supercategory + "')";
        conn.query(Query, (err) => {
            if (err) throw err;

            res.send('added');
        })
    }
    // VIEW Category Request Handler
    else if (action == "view") {
        Query = "SELECT * FROM `category` ORDER BY `categoryname` ASC";
        console.log(Query);
        conn.query(Query, (err, rows) => {
            if (err) throw err;

            res.send(rows);
        })
    }
    // DELETE Category Request Handler
    else if (action == "delete") {
        let categoryid = req.body.categoryid;

        // DELETE FROM `admin` WHERE 0
        Query = "DELETE FROM `category` WHERE categoryid='" + categoryid + "'";
        conn.query(Query, (err) => {
            if (err) throw err;

            res.send("deleted");
        })
    }
    // SESSION Request Handler
    else if (action == "session") {

        if (session.username != undefined) {
            res.send(session.username);
        } else {
            res.send(""); // Client will receive value of username else receive Empty("") 
        }
    }
    // UPDATE Category Request Handler
    else {
        let categoryid = req.body.categoryid;
        let categoryname = req.body.categoryname;
        let description = req.body.description;
        let supercategory = req.body.supercategory;

        // (`categoryid`, `categoryname`, `description`, `supercategory`)
        Query = "UPDATE `category` SET `categoryname`='" + categoryname + "',`description`='" + description + "'," +
            "`supercategory`='" + supercategory + "' WHERE `categoryid`='" + categoryid + "'";
        console.log(Query);
        conn.query(Query, (err) => {
            if (err) throw err;

            res.send('updated');
        })
    }
});

/* Render Category page. */
router.get("/managecategory", (req, res) => {

    res.render("admin/manageCategory.ejs")
});
//----------------------------------------------------------------------------------------------

//--> Page: views/admin/manageAdmin.ejs

router.post('/adminRequest', (req, res) => {
    let action = req.body.action;
    let Query = '';

    // ADD Admin Request Handler
    if (action == "add") {
        let username = req.body.username;
        let password = req.body.password;
        let email = req.body.email;
        let type = req.body.type;

        let selectQuery = "select * from admin where username='" + username + "' and password='" + password + "'";
        conn.query(selectQuery, (err, rows) => {
            if (err) throw err;
            if (rows.length > 0) {
                res.send("duplicate")
            } else {
                // (`username`, `password`, `email`, `type`)
                Query = "insert into admin values('" + username + "','" + password + "','" + email + "','" + type + "')";
                conn.query(Query, (err) => {
                    if (err) throw err;
                    res.send('added');
                })
            }
        })
    }
    // VIEW Admin Request Handler
    else if (action == "view") {

        Query = "select * from admin";
        conn.query(Query, (err, rows) => {
            if (err) throw err;

            res.send(rows);
        })
    }
    // DELETE Admin Request Handler
    else if (action == "delete") {
        let username = req.body.username;

        // DELETE FROM `admin` WHERE 0
        Query = "DELETE FROM `admin` WHERE username='" + username + "'";
        conn.query(Query, (err) => {
            if (err) throw err;

            res.send("deleted");
        })
    }
    // SESSION Request Handler
    else if (action == "session") {

        if (session.username != undefined) {
            res.send(session.username);
        } else {
            res.send(""); 
        }
    }
    // UPDATE Admin Request Handler
    else {
        let username = req.body.username;
        let password = req.body.password;
        let email = req.body.email;
        let type = req.body.type;

        // UPDATE `admin` SET `username`=,`password`=,`email`=,`type`= WHERE 1
        Query = "UPDATE `admin` SET `username`='" + username + "',`password`='" + password + "',`email`='" + email + "'," +
            "`type`='" + type + "' WHERE `username`='" + username + "'";
        console.log(Query);
        conn.query(Query, (err) => {
            if (err) throw err;

            res.send('updated');
        })
    }
});

router.get('/manageadmin', (req, res) => {
    res.render('admin/manageAdmin.ejs')
});

//----------------------------------------------------------------------------------------------
//--> Page: views/admin/changePasswordAdmin.ejs

//     --* UPDATE Admin password Request Handler *--
router.post("/adminUpdatePassword", (req, res) => {
    console.log(req.body);

    let username = req.body.username;
    let oldpassword = req.body.oldpassword;
    let newpassword = req.body.newpassword;
    let confirmpassword = req.body.confirmpassword;


    // CHECK Old Password is Matching or Not.
    let passwordQuery = "select * from admin where username='" + username + "' and password='" + oldpassword + "'";
    conn.query(passwordQuery, (err, rows) => {
        if (err) throw err;

        if (rows.length > 0) {

            let updateQuery = "update admin set password='" + newpassword + "' where username='" + username + "'";
            conn.query(updateQuery, (err) => {
                if (err) throw err;

                res.send("success");
            })
        } else {
            res.send("Invalid old password");
        }
    })
});

/* Render Change Password page. */
router.get('/adminchangepassword', (req, res) => {
    res.render('admin/changePasswordAdmin.ejs')
});

//----------------------------------------------------------------------------------------------

// LOGOUT Request Handler
router.get('/adminlogout', (req, res) => {
    session.username = undefined;

    res.redirect("/admin/adminlogin");
    console.log(session.username);
});
//----------------------------------------------------------------------------------------------

//--> Page: views/admin/adminLogin.ejs

// LOGIN Request Handler
router.post('/admin_login', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    let selectQuery = "select * from admin where username='" + username + "' and password='" + password + "'";
    conn.query(selectQuery, function (err, rows) {
        if (err) throw err;
        if (rows.length > 0) {
            session.username = username;
            res.send("success")
        } else {
            res.send("failed");
        }
    })
});

router.get('/adminlogin', (req, res) => {
    res.render('admin/adminLogin.ejs')
});

//----------------------------------------------------------------------------------------------

/* GET Admin Home Page. */
router.get('/admindashboard', function (req, res) {
    res.render('admin/adminHome.ejs');
});

//----------------------------------------------------------------------------------------------

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('Hello Admin');
    
});

module.exports = router;
