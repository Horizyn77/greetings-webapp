import express from "express";
const app = express();
import { engine } from "express-handlebars";
import pkg from 'pg';
const { Pool } = pkg;
import 'dotenv/config';
import Greetings from "./greetings-webapp.js"

const greetings = Greetings();

const PORT = process.env.PORT || 3000;

const connectionString = "postgres://greetings_postgres_user:aMUnTV4ibJXwDBbvNpV66NDAmiLaPWQJ@dpg-cjd0onbbq8nc73fhveh0-a.oregon-postgres.render.com/greetings_postgres?ssl=true"

app.engine("handlebars", engine({
    layoutsDir: "./views/layouts"
}));

app.set("view engine", "handlebars");
app.set("views", "./views");
app.use(express.static("public"))

app.use(express.json());
app.use(express.urlencoded({extended: false}));

const db = new pkg.Pool({connectionString});

const createTableQuery = `
    CREATE TABLE IF NOT EXISTS greetings (
        id SERIAL PRIMARY KEY,
        greeted_user VARCHAR(255) NOT NULL,
        times_greeted INT NOT NULL
    )
`

db.query(createTableQuery, (err, res) => {
    if (err) {
        console.error('Error creating table:', err);
      } else {
        console.log('Table created successfully');
      }

      db.end(); 
})

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

app.get("/greeted", (req, res) => {
    const countObj = greetings.getCount();
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