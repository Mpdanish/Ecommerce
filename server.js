import express from 'express';
import path from 'path';
import session from 'express-session';
import userRouter from './server/routes/userRouter.js'
import adminRouter from './server/routes/adminRouter.js';
import connectDB from './server/database/connection.js';
import MongoStore from 'connect-mongo';
// import validator from './server/validator.js';
import "dotenv/config"
import flash from 'express-flash';

const app = express();

const PORT = process.env.PORT || 8080;

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        store: MongoStore.create({mongoUrl : process.env.MONGO_URI}),
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

const __dirname = path.resolve();
app.use(express.static(__dirname + "/assets"));
app.use(flash())
// load routers
app.use('/', userRouter)
app.use('/', adminRouter)
 
app.listen(PORT, () => 
    console.log(`Server is running on http://localhost:${PORT}`)
);