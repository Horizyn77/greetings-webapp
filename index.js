import express from "express";
const app = express();
import { engine } from "express-handlebars";
import 'dotenv/config';
import Greetings from "./greetings-webapp.js"

const greetings = Greetings();

const PORT = process.env.PORT || 3000;

app.engine("handlebars", engine({
    layoutsDir: "./views/layouts"
}));

app.set("view engine", "handlebars");
app.set("views", "./views");
app.use(express.static("public"))

app.use(express.json());
app.use(express.urlencoded({extended: false}));


app.get("/", (req, res) => {
    res.render("index");
})
app.post("/", (req, res) => {

    const name = req.body.greetedName;
    const radioBtnSelected = req.body.lang;

    greetings.storeUserAndCount(name);
    greetings.greetUser(name, radioBtnSelected);
    
    const greeting = greetings.getGreeting();

    res.render("index", {
        greeting
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