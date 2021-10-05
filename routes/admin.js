const dbConnection = require("../connection/db");
const router = require("express").Router();

router.get("/dashboard", function (req, res) {
    if(!req.session.admin){
        res.redirect("/login");
    } else {
        const queryBrand = "SELECT * FROM tb_brand";
        const queryCategory = "SELECT * FROM tb_category";
        const queryProduct = "SELECT * FROM tb_product";

        dbConnection.getConnection((err, conn) => {
            if (err) throw err;
    
            conn.query(queryBrand, (err, resultsBrand) => {
                if (err) throw err;
    
                conn.query(queryCategory, (err, resultsCategory) => {
                    if (err) throw err;

                    conn.query(queryProduct, (err, resultsproduct) => {
                        if (err) throw err;
        
                        res.render("admin/dashboard", { 
                            title: "Dashboard",
                            isLogin: req.session.isLogin,
                            admin: req.session.admin,
                            dataBrand: resultsBrand,
                            dataCategory: resultsCategory,
                            dataProduct: resultsproduct,
                        });
                    });
                });
            });
            conn.release();
        });
    }
    
});

module.exports = router;