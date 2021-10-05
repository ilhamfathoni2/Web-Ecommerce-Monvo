const dbConnection = require("../connection/db");
const router = require("express").Router();

router.get("/transaction/:subtotal/:id", function (req, res) {
    let subTotal = req.params.subtotal;
    let idProduct = req.params.id;
    // let userID = req.session.user;

    const sql = "INSERT INTO `tb_transaction` (`sub_total`, `product_id`, `user_id`) VALUES (?,?,?)";

    dbConnection.getConnection((err, conn) => {
        if (err) throw err;

        conn.query(sql, [subTotal, idProduct, req.session.user], (err, results) => {
            if (err) throw err;
      
            req.session.message = {
              type: "success",
              message: "Add product successfull!",
            };
            res.redirect("/payment");
        });
        conn.release();
    });
})

module.exports = router;