import express from "express";
const app = express();
import { engine, create } from "express-handlebars";
import 'dotenv/config';
import Greetings from "./greetings-webapp.js"
import session from "express-session";
import flash from "express-flash";

const greetings = Greetings();

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

    let numGreeted = await greetings.getNumGreeted();

    res.render("index", {
        numGreeted
    });
})
app.post("/", async (req, res) => {

    const name = req.body.greetedName;
    const radioBtnSelected = req.body.lang;

    const pattern = /\d/;

    const containNums = pattern.test(name)

    req.flash("error", greetings.setErrMsg(name, radioBtnSelected, containNums))

    const hbs = create({

        helpers: {
            clearErrMsg() {
                setTimeout(() => {
                    req.flash("error", "");
                }, 1000)
            }
        }
    })

    if (!greetings.setErrMsg(name, radioBtnSelected, containNums)) {
        greetings.storeUserAndCount(name);
        greetings.greetUser(name, radioBtnSelected);
    }

    const greeting = greetings.getGreeting();

    let numGreeted = await greetings.getNumGreeted()

    res.render("index", {
        greeting,
        numGreeted,
        messages: req.flash()
    })

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


app.listen(PORT, () => console.log(`Server started at Port: ${PORT}`));