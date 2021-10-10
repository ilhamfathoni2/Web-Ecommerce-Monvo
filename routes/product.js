const dbConnection = require("../connection/db");
const router = require("express").Router();
const uploadFile = require("../middleware/upload");


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
                res.redirect("/dashboard");
            });
          
            // release connection back to pool
            conn.release();
        });
})

module.exports = router;