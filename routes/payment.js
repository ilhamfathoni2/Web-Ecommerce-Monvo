const dbConnection = require("../connection/db");
const router = require("express").Router();

router.get("/payment", function (req, res) {
    if(!req.session.user){
        res.redirect("/login");
    } else {
        const sql = "SELECT * FROM tb_transaction LEFT JOIN tb_payment ON tb_transaction.id_trs = tb_payment.transaction_id LEFT JOIN tb_product ON tb_transaction.product_id = tb_product.id_prod LEFT JOIN tb_user ON tb_transaction.user_id = tb_user.id WHERE user_id = ?";
    
        dbConnection.getConnection((err, conn) => {
            if (err) throw err;
    
            conn.query(sql, [req.session.user], (err, results) => {
                if (err) throw err;
    
                res.render("user/payment", { 
                    title: "Payment",
                    isLogin: req.session.isLogin,
                    data: results
                });
            });
            conn.release();
        });
    }
});

//Admin
router.get('/adm-payment', (req, res) => {
    if(!req.session.admin){
        res.redirect("/login");
    } else {
        const query = "SELECT * FROM tb_transaction LEFT JOIN tb_payment ON tb_transaction.id_trs = tb_payment.transaction_id LEFT JOIN tb_product ON tb_transaction.product_id = tb_product.id_prod LEFT JOIN tb_user ON tb_transaction.user_id = tb_user.id";

        dbConnection.getConnection((err, conn) => {
            if (err) throw err;

            conn.query(query, (err, results) => {
                if (err) throw err;
                
                res.render('admin/adm-pay', { 
                    title: 'Payment',
                    detail: results,
                });
            });
            conn.release();
        });
    }
});

router.get('/update-pay/:id', (req, res) => {
    if(!req.session.admin){
        res.redirect("/login");
    } else {
        let idPay = req.params.id
        const query = "SELECT * FROM tb_payment WHERE id_pay = ?";

        dbConnection.getConnection((err, conn) => {
            if (err) throw err;

            conn.query(query, [idPay], (err, results) => {
                if (err) throw err;
                
                res.render('admin/update-pay', { 
                    title: 'Update Payment',
                    detail: results,
                });
            });
            conn.release();
        });
    }
});


router.post('/update-payment/:id', (req, res) => {
    if(!req.session.admin){
        res.redirect("/login");
    } else {
        let status = req.body.payment_status
        let idPay = req.params.id
        const query = "UPDATE `tb_payment` SET payment_status = ? WHERE id_pay = ?";

        dbConnection.getConnection((err, conn) => {
            if (err) throw err;

            conn.query(query, [status, idPay], (err, results) => {
                if (err) throw err;
                
                req.session.message = {
                    type: "success",
                    message: "Update successfull!",
                    };
                res.redirect("/adm-payment");
            });
            conn.release();
        });
    }
});

module.exports = router;