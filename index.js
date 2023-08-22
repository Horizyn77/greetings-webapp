import express from "express";
const app = express();
import { engine, create } from "express-handlebars";
import 'dotenv/config';
import Greetings from "./greetings-webapp.js"
import session from "express-session";
import flash from "express-flash";
import pgPromise from 'pg-promise';
const pgp = pgPromise({});

const connectionString = process.env.DATABASE_URL;

const db = pgp(connectionString)

const greetings = Greetings(db);

const PORT = process.env.PORT || 3000;

app.engine("handlebars", engine({
    layoutsDir: "./views/layouts"
}));

app.set("view engine", "handlebars");
app.set("views", "./views");
app.use(express.static("public"))

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(session({
    secret: 'secret key',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 60000
    }
}))
app.use(flash());


app.get("/", async (req, res) => {

    const numGreeted = await greetings.getNumGreeted()

    const greeting = greetings.getGreeting();

    res.render("index", {
        greeting,
        numGreeted,
        messages: req.flash()
    })
})
app.post("/", async (req, res) => {

    const name = req.body.greetedName;
    const radioBtnSelected = req.body.lang;

    const pattern = /[^A-Za-z ]/g

    const containNumsSpecials = pattern.test(name)

    req.flash("error", greetings.setErrMsg(name, radioBtnSelected, containNumsSpecials))

    if (!greetings.setErrMsg(name, radioBtnSelected, containNumsSpecials)) {
        await greetings.storeUserAndCount(name);
        greetings.greetUser(name, radioBtnSelected);
    }

    res.redirect("/")

})

app.get("/greeted", async (req, res) => {
    const countObj = await greetings.setUserAndCount();
    const checkObj = greetings.checkObj();

    res.render("greetedUsers", {
        countObj,
        checkObj
    })
})

app.get("/counter/:username", (req, res) => {
    const countObj = greetings.getCount();
    const user = req.params.username;
    let userCount = {};

    for (let key in countObj) {
        if (key == user) {
            userCount[key] = countObj[key];
        }
    }

    res.render("counter", {
        userCount
    })
})

app.post("/reset", async (req, res) => {
    
    await greetings.resetGreetedUsers();

    req.flash("reset", "All data has been reset")

    res.redirect("/")
})


app.listen(PORT, () => console.log(`Server started at Port: ${PORT}`));