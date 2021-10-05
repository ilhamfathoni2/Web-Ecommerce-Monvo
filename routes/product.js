const dbConnection = require("../connection/db");
const router = require("express").Router();
const uploadFile = require("../middleware/upload");

router.get("/brand", function (req, res) {
    if(!req.session.admin){
        res.redirect("/login");
    } else {
        const sql = "SELECT * FROM tb_brand";
    
        dbConnection.getConnection((err, conn) => {
            if (err) throw err;
    
            conn.query(sql, (err, results) => {
                if (err) throw err;
    
                res.render("product/addbrand", { 
                    title: "Brand",
                    data: results
                });
            });
            conn.release();
        });
    }
});

router.get("/brand/edit/:id", function (req, res) {
    let idBrand = req.params.id;
    const sql = "SELECT * FROM tb_brand WHERE id = ?";

    dbConnection.getConnection((err, conn) => {
        if (err) throw err;

        conn.query(sql, [idBrand], (err, results) => {
            if (err) throw err;

            res.render("product/editbrand", { 
                title: "Edit Brand",
                data: results
            });
        });
        conn.release();
    });
});

router.get("/category", function (req, res) {
    if(!req.session.admin){
        res.redirect("/login");
    } else {
        const sqlCategory = "SELECT * FROM tb_category";
        dbConnection.getConnection((err, conn) => {
            if (err) throw err;
    
            conn.query(sqlCategory, (err, results) => {
                if (err) throw err;
    
                res.render("product/addcategory", { 
                    title: "Category",
                    data: results
                });
            });
            conn.release();
        });
    }
});

router.get("/category/edit/:id", function (req, res) {
    let idCategory = req.params.id;
    const sqlCategory = "SELECT * FROM tb_category WHERE id = ?";
    dbConnection.getConnection((err, conn) => {
        if (err) throw err;

        conn.query(sqlCategory, [idCategory], (err, results) => {
            if (err) throw err;

            res.render("product/categoryedit", { 
                title: "Edit Category",
                data: results
            });
        });
        conn.release();
    });
});

router.get("/product", function (req, res) {
    if(!req.session.admin){
        res.redirect("/login");
    } else {
        const queryBrand = "SELECT * FROM tb_brand";
        const queryCategory = "SELECT * FROM tb_category";
    
        dbConnection.getConnection((err, conn) => {
            if (err) throw err;
    
            conn.query(queryBrand, (err, resultsB) => {
                if (err) throw err;
    
                conn.query(queryCategory, (err, resultsC) => {
                    if (err) throw err;
    
                    res.render("product/addproduct", { 
                        title: "Product",
                        dataBrand: resultsB,
                        dataCategory: resultsC
                    });
                });
            });
            conn.release();
        });
    }
});

router.post("/brand", function (req, res) {
        let name = req.body.name;
        const sql = "INSERT INTO `tb_brand` (`name`) VALUES (?);";
    
        if (name == "") {
            req.session.message = {
              type: "danger",
              message: "Please fulfill input",
            };
            return res.redirect("/brand");
        }
    
        dbConnection.getConnection((err, conn) => {
            if (err) throw err;
    
            conn.query(sql, [name], (err, results) => {
                if (err) throw err;
          
                req.session.message = {
                  type: "success",
                  message: "Add brand successfull",
                };
                res.redirect("/brand");
            });
          
            // release connection back to pool
            conn.release();
        });
})

router.post("/edit/brand/:id", function (req, res) {
    let name = req.body.name;
    let brandId = req.params.id;
    const sql = "UPDATE `tb_brand` SET name = ? WHERE id = ?";

    if (name == "") {
        req.session.message = {
          type: "danger",
          message: "id not found",
        };
        return res.redirect("/brand");
    }

    dbConnection.getConnection((err, conn) => {
        if (err) throw err;

        conn.query(sql, [name, brandId], (err, results) => {
            if (err) throw err;
      
            req.session.message = {
              type: "success",
              message: "Edit brand successfull",
            };
            res.redirect("/brand");
        });
      
        // release connection back to pool
        conn.release();
    });
})

router.get("/brand/delete/:id", function (req, res) {
    let brandId = req.params.id;
    const sql = "DELETE FROM `tb_brand` WHERE id = ?";

    dbConnection.getConnection((err, conn) => {
        if (err) throw err;

        conn.query(sql, [brandId], (err, results) => {
            if (err) throw err;
      
            req.session.message = {
              type: "success",
              message: "Delete brand successfull",
            };
            res.redirect("/brand");
        });
      
        // release connection back to pool
        conn.release();
    });
})


router.post("/category", function (req, res) {
        let name = req.body.name;
        const sql = "INSERT INTO `tb_category` (`name`) VALUES (?);";
    
        if (name == "") {
            req.session.message = {
              type: "danger",
              message: "Please fulfill input",
            };
            res.redirect("/category");
            return;
        }
    
        dbConnection.getConnection((err, conn) => {
            if (err) throw err;
    
            conn.query(sql, [name], (err, results) => {
                if (err) throw err;
          
                req.session.message = {
                  type: "success",
                  message: "Add category successfull !",
                };
                res.redirect("/category");
            });
            conn.release();
        });
})

router.post("/category/edit/:id", function (req, res) {
    let name = req.body.name;
    let categoryId = req.params.id;
    const sql = "UPDATE `tb_category` SET name = ? WHERE id = ?";

    if (name == "") {
        req.session.message = {
          type: "danger",
          message: "Please fulfill input",
        };
        res.redirect("/category");
        return;
    }

    dbConnection.getConnection((err, conn) => {
        if (err) throw err;

        conn.query(sql, [name, categoryId], (err, results) => {
            if (err) throw err;
      
            req.session.message = {
              type: "success",
              message: "Edit category successfull",
            };
            res.redirect("/category");
        });
      
        // release connection back to pool
        conn.release();
    });
})


router.get("/category/delete/:id", function (req, res) {
    let categoryId = req.params.id;
    const sql = "DELETE FROM `tb_category` WHERE id = ?";

    dbConnection.getConnection((err, conn) => {
        if (err) throw err;

        conn.query(sql, [categoryId], (err, results) => {
            if (err) throw err;
      
            req.session.message = {
              type: "success",
              message: "Delete category successfull!",
            };
            res.redirect("/category");
        });
      
        // release connection back to pool
        conn.release();
    });
})


router.post("/product", uploadFile("image"), function (req, res) {
        let {name, description, price} = req.body;
        let photo = req.file.filename;
        let {stock, brand_id, category_id} = req.body;
    
        const sql = "INSERT INTO `tb_product` (`name`, `description`, `price`, `photo`,`stock`, `brand_id`, `category_id`) VALUES (?,?,?,?,?,?,?);";
    
        if (name == "" || description == "" || price == "" ||
            stock == "" || brand_id == "" || category_id == "") {
            req.session.message = {
              type: "danger",
              message: "Please fulfill input",
            };
            return res.redirect("/product");
        }
    
        dbConnection.getConnection((err, conn) => {
            if (err) throw err;
    
            conn.query(sql, [name, description, price, photo, stock, brand_id, category_id], (err, results) => {
                if (err) throw err;
          
                req.session.message = {
                  type: "success",
                  message: "Add product successfull!",
                };
                res.redirect("/");
            });
          
            // release connection back to pool
            conn.release();
        });
})

module.exports = router;