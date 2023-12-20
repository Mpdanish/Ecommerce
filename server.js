const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const session = require('express-session');
const router = require('./server/routes/userRouter'); 

const connectDB = require('./server/database/connection')

const app = express();

dotenv.config({path:'config.env'})
const PORT = process.env.PORT || 8080;

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: true,
        saveUninitialized: true
    })
);

//clear cache
app.use((req, res, next) => {
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); 
    res.setHeader("Pragma", "no-cache"); 
    res.setHeader("Expires", "0");
    next()
});

// mongodb connection
connectDB(); 

app.use(express.json());
app.use(express.urlencoded({extended: true}));

// set view engine
app.set('view engine', 'ejs');
// app.set('views' ,path.resolve(__dirname, "views/ejs"));

// load assets
app.use('/css',express.static(path.resolve(__dirname, 'assets/css')));
app.use('/images',express.static(path.resolve(__dirname, 'assets/images')));
app.use('/js',express.static(path.resolve(__dirname, 'assets/js')));
app.use('/fonts',express.static(path.resolve(__dirname, 'assets/fonts')));

// load routers
app.use('/', require('./server/routes/userRouter'))
app.use('/', require('./server/routes/adminRouter'))
 

app.listen(PORT, () => 
    console.log(`Server is running on http://localhost:${PORT}`)
);