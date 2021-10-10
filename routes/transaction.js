const dbConnection = require("../connection/db");
const router = require("express").Router();

router.post("/transaction/:subtotal/:id", function (req, res) {
    if(!req.session.user){
        res.redirect("/login");
    } else {
        let qty = req.body.qty;
        let subTotal = req.params.subtotal;
        let idProduct = req.params.id;
        let total = qty * subTotal

        const sql = "INSERT INTO `tb_transaction` (`qty`, `sub_total`, `product_id`, `user_id`) VALUES (?,?,?,?)";

        const stock = "SELECT * FROM `tb_product` WHERE id_prod = ?";
        const updateStock = "UPDATE `tb_product` SET stock = ? WHERE id_prod = ?";

        dbConnection.getConnection((err, conn) => {
            if (err) throw err;

            conn.query(sql, [qty, total, idProduct, req.session.user], (err, resultsA) => {
                if (err) throw err;

                conn.query(stock, [idProduct], (err, resultsB) => {
                    if (err) throw err;
                    let oldStock = resultsB[0].stock
                    let stockNow = oldStock - qty

                    conn.query(updateStock, [stockNow, idProduct], (err, resultsC) => {
                        if (err) throw err;
            
                        req.session.message = {
                        type: "success",
                        message: "Checkout successfull!",
                        };
                        res.redirect("/transaction");
                    });
                    conn.release();
                });
            });
        });
    }
});


router.get('/transaction', (req, res) => {
    if(!req.session.user){
        res.redirect("/login");
    } else {
        const query = "SELECT * FROM tb_transaction JOIN tb_product ON tb_transaction.product_id = tb_product.id_prod JOIN tb_user ON tb_transaction.user_id = tb_user.id WHERE user_id = ? AND status_trsc = 'Menunggu Pembayaran'";

        dbConnection.getConnection((err, conn) => {
            if (err) throw err;

            conn.query(query, [req.session.user], (err, results) => {
                if (err) throw err;
                
                res.render('user/transaction', { 
                    title: 'Transaction',
                    isLogin: req.session.isLogin,
                    detail: results,
                });
            });
            conn.release();
        });
    }
});


router.get('/adm-transaction', (req, res) => {
    if(!req.session.admin){
        res.redirect("/login");
    } else {
        const query = "SELECT * FROM tb_transaction JOIN tb_user ON tb_transaction.user_id = tb_user.id";

        dbConnection.getConnection((err, conn) => {
            if (err) throw err;

            conn.query(query, (err, results) => {
                if (err) throw err;
                
                res.render('admin/adm-transac', { 
                    title: 'Transaction',
                    detail: results,
                });
            });
            conn.release();
        });
    }
});


router.get('/update-transaction/:id', (req, res) => {
    if(!req.session.admin){
        res.redirect("/login");
    } else {
        let idTrs = req.params.id
        const query = "SELECT * FROM tb_transaction WHERE id_trs = ?";

        dbConnection.getConnection((err, conn) => {
            if (err) throw err;

            conn.query(query, [idTrs], (err, results) => {
                if (err) throw err;
                
                res.render('admin/update-trsc', { 
                    title: 'Transaction',
                    detail: results,
                });
            });
            conn.release();
        });
    }
});


router.post('/update-trans/:id', (req, res) => {
    if(!req.session.admin){
        res.redirect("/login");
    } else {
        let status = req.body.status_trsc
        let idTransaction = req.params.id
        const query = "UPDATE `tb_transaction` SET `status_trsc` = ? WHERE id_trs = ?";

        dbConnection.getConnection((err, conn) => {
            if (err) throw err;

            conn.query(query, [status, idTransaction], (err, results) => {
                if (err) throw err;
                
                req.session.message = {
                    type: "success",
                    message: "Update success",
                  };
                res.redirect("/adm-transaction");
            });
            conn.release();
        });
    }
});


router.post('/transaction/:id', (req, res) => {

    let idTransaction = req.params.id

    const query = "INSERT INTO `tb_payment`(`transaction_id`) VALUES (?)";

    dbConnection.getConnection((err, conn) => {
        if (err) throw err;

        conn.query(query, [idTransaction], (err, results) => {
            if (err) throw err;
            
            req.session.message = {
                type: "success",
                message: "Trasaction success",
              };
            res.redirect("/payment");
        });
        conn.release();
    });
});


router.get('/delete/:id', (req, res) => {

    let idTransaction = req.params.id

    const query = "DELETE FROM `tb_transaction` WHERE id_trs = ?";

    dbConnection.getConnection((err, conn) => {
        if (err) throw err;

        conn.query(query, [idTransaction], (err, results) => {
            if (err) throw err;
            
            req.session.message = {
                type: "danger",
                message: "Delete success",
              };
            res.redirect("/transaction");
        });
        conn.release();
    });
});


router.get('/delete-trans/:id', (req, res) => {

    let idTransaction = req.params.id

    const query = "DELETE FROM `tb_transaction` WHERE id_trs = ?";

    dbConnection.getConnection((err, conn) => {
        if (err) throw err;

        conn.query(query, [idTransaction], (err, results) => {
            if (err) throw err;
            
            req.session.message = {
                type: "danger",
                message: "Delete success",
              };
            res.redirect("/adm-transaction");
        });
        conn.release();
    });
});

module.exports = router;