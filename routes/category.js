const dbConnection = require("../connection/db");
const router = require("express").Router();

// View category
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

// view edit category
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

// Insert Category
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


// Edit category
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
});

// Delete Category
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
});

module.exports = router;