import express from 'express';
import path from 'path';
import session from 'express-session';
import userRouter from './server/routes/userRouter.js';
import adminRouter from './server/routes/adminRouter.js';
import connectDB from './server/database/connection.js';
// import validator from './server/validator.js';
import "dotenv/config"


const app = express();


const PORT = process.env.PORT || 8080;
const __dirname = path.resolve();

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

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({extended: true}));

// set view engine
app.set('view engine', 'ejs');
// app.set('views' ,path.resolve(__dirname, "views/ejs"));

app.use(express.static(__dirname + "/assets"));

// load routers
app.use('/', userRouter)
app.use('/', adminRouter)
 

app.listen(PORT, () => 
    console.log(`Server is running on http://localhost:${PORT}`)
);