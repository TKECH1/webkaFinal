import express from "express";
import * as dotenv from "dotenv";
import * as path from "path";
import {fileURLToPath} from "url";
import portfolioRouter from "./routes/portfolio-router.js";
import authRouter from "./routes/auth-router.js";
import methodOverride from "method-override"
import connectToMongo from "./config/mongodb.js"
import bodyParser from "body-parser";
import passport from "passport";
import session from "express-session";

dotenv.config({path: `.env.${process.env.NODE_ENV}`})
connectToMongo()

const app = express()


const PORT = process.env.APPLICATION_PORT
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const oneDay = 1000 * 60 * 60 * 24;
app.use(session({
    secret: "t4jgat_secret",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: oneDay },
}));


app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.set("views", "./views")
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'))

app.use(methodOverride("_method"))
app.use(express.urlencoded({extended: true})) // parse urlencoded request bodies

app.use(express.json())
app.use(express.urlencoded( {extended: true} ))

app.use("/", portfolioRouter)
app.use("/auth", authRouter)

app.use(bodyParser.json());
app.use(passport.initialize());


// If using passport...
app.use(passport.initialize());
app.use(passport.session());

app.listen(PORT, () => {console.log(`server is running on ${PORT}`)})