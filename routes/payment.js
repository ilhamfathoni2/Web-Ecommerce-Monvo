const dbConnection = require("../connection/db");
const router = require("express").Router();

router.get("/payment", function (req, res) {
    // if(!req.session.admin && !req.session.user){
    //     res.redirect("/login");
    // } else {
        const sql = "SELECT name FROM tb_transaction LEFT JOIN tb_product ON tb_transaction.product_id = tb_product.id";
    
        dbConnection.getConnection((err, conn) => {
            if (err) throw err;
    
            conn.query(sql, (err, results) => {
                if (err) throw err;
    
                res.render("payment", { 
                    title: "Payment",
                    data: results
                });
            });
            conn.release();
        });
    // }
});

module.exports = router;