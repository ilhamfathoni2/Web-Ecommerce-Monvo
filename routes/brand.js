const dbConnection = require("../connection/db");
const router = require("express").Router();

// view
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

// Insert
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
        conn.release();
    });
})

// View Edit
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

// Edit brand
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
});


// Delete brand
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
});

module.exports = router;