const http = require("http")
const express = require("express")
const path = require("path")
const session = require("express-session");
const flash = require("express-flash");

const app = express();
const hbs = require("hbs");


const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const adminRoute = require("./routes/admin");
const transactionRoute = require("./routes/transaction");
const paymentRoute = require("./routes/payment");


// import db connection
const dbConnection = require("./connection/db");

// app.use(express.static('express'))
app.use("/static", express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.use(express.urlencoded({ extended: false }));

// set views locations
app.set("views", path.join(__dirname, "views"))

// set view engine
app.set("view engine", "hbs")

// register views partials
hbs.registerPartials(path.join(__dirname, "views/partials"));

// user session
app.use(
    session({
      cookie: {
        maxAge: 4 * 60 * 60 * 1000,
        secure: false,
        httpOnly: true,
      },
      store: new session.MemoryStore(),
      saveUninitialized: true,
      resave: false,
      secret: "secretValue",
    })
);
// use flash for sending message
app.use(flash());
// setup flash message
app.use((req, res, next) => {
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
});

// root index
app.get('/', (req, res) => {
    const query = "SELECT * FROM tb_product";

    dbConnection.getConnection((err, conn) => {
        if (err) throw err;

        conn.query(query, (err, results) => {
            if (err) throw err;
            
            res.render('index', { 
                title: 'Store',
                isLogin: req.session.isLogin,
                product: results,
            });
        });
        conn.release();
    });
});

app.get('/detailproduct/:id', (req, res) => {
    let idProduct = req.params.id;
    const query = "SELECT * FROM tb_product WHERE id = ?";

    dbConnection.getConnection((err, conn) => {
        if (err) throw err;

        conn.query(query, [idProduct], (err, results) => {
            if (err) throw err;
            
            res.render('detailproduct', { 
                title: 'Detail',
                detail: results,
            });
        });
        conn.release();
    });
});

app.use("/", authRoute);
app.use("/", adminRoute);
app.use("/", productRoute);
app.use("/", transactionRoute);
app.use("/", paymentRoute);





const server = http.createServer(app)
const port = 4532
server.listen(port, () => {
    console.log(`listening at http://localhost:${port}`)
})