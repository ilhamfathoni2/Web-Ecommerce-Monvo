const dbConnection = require("../connection/db");
const router = require("express").Router();
const uploadFile = require("../middleware/upload");
const fs = require("fs");

router.get("/dashboard", function (req, res) {
    if(!req.session.admin){
        res.redirect("/login");
    } else {
        const queryProduct = "SELECT * FROM tb_product";

        dbConnection.getConnection((err, conn) => {
            if (err) throw err;

            conn.query(queryProduct, (err, resultsproduct) => {
                if (err) throw err;
        
                res.render("admin/dashboard", { 
                    title: "Dashboard",
                    isLogin: req.session.isLogin,
                    admin: req.session.admin,
                    dataProduct: resultsproduct,
                });
            }); 
            conn.release();
        });
    } 
});

// Delete
router.get("/delete/:id/:name", function (req, res) {
    let idProduct = req.params.id;
    let productName = req.params.name;

    fs.unlinkSync("./uploads/" + productName);

    const queryProduct = "DELETE FROM tb_product WHERE id = ?";

    dbConnection.getConnection((err, conn) => {
        if (err) throw err;

        conn.query(queryProduct, [idProduct], (err, results) => {
            if (err) throw err;
        
            req.session.message = {
                type: "success",
                message: "Delete product successfull!",
            };
            res.redirect("/dashboard");
        }); 
        conn.release();
    });
});


router.get("/edit-product/:id", function (req, res) {
    let idProduct = req.params.id;

    const queryProduct = "SELECT * FROM tb_product WHERE id_prod = ?";
    const queryBrand = "SELECT * FROM tb_brand";
    const queryCategory = "SELECT * FROM tb_category";
    
        dbConnection.getConnection((err, conn) => {
            if (err) throw err;
    
            conn.query(queryProduct, [idProduct], (err, resultsA) => {
                if (err) throw err;

                conn.query(queryBrand, (err, resultsB) => {
                    if (err) throw err;
        
                    conn.query(queryCategory, (err, resultsC) => {
                        if (err) throw err;
        
                        res.render("admin/edit-product", { 
                            title: "Edit Product",
                            dataProduct: resultsA,
                            dataBrand: resultsB,
                            dataCategory: resultsC
                        });
                    });
                });
            });
            conn.release();
        });
});


// Edit Product
router.post("/edit-prod/:id/:photo", uploadFile("image"), function (req, res) {
    let idProduct = req.params.id;
    let photo = req.params.photo;

    let {name, description, price} = req.body;
    let newPhoto = req.file.filename;
    let {stock, brand_id, category_id} = req.body;

    if (newPhoto == "") {
            req.session.message = {
              type: "danger",
              message: "Please re-upload the image",
            };
            return res.redirect("/dashboard");
        }

    // delete in folder uploads
    fs.unlinkSync("./uploads/" + photo);

    const queryProduct = "UPDATE tb_product SET name = ?, description = ?, price = ?, photo = ?,stock = ?, brand_id = ?, category_id = ? WHERE id_prod = ?";

    dbConnection.getConnection((err, conn) => {
        if (err) throw err;

        conn.query(queryProduct, [name, description, price, newPhoto, stock, brand_id, category_id, idProduct], (err, results) => {
            if (err) throw err;
        
            req.session.message = {
                type: "success",
                message: "Edit product successfull!",
            };
            res.redirect("/dashboard");
        }); 
        conn.release();
    });
});

module.exports = router;