import express from "express";
import { engine } from "express-handlebars";
import 'dotenv/config';

import Greetings from "./greetings-webapp.js"
import GreetingsRoutes from "./routes/greetings-routes.js"
import GreetingsService from "./services/greetings-service.js";

import session from "express-session";
import flash from "express-flash";
import pgPromise from 'pg-promise';

const app = express();
const pgp = pgPromise({});

const connectionString = process.env.DATABASE_URL;

const db = pgp(connectionString)

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

const greetings = Greetings();
const greetingsService = GreetingsService(db)
const greetingsRoutes = GreetingsRoutes(greetingsService, greetings)

app.get("/", greetingsRoutes.showHome)

app.post("/", greetingsRoutes.addGreeting)

app.get("/greeted", greetingsRoutes.showGreetedUsers)

app.get("/counter/:username", greetingsRoutes.showCounter)

app.post("/reset", greetingsRoutes.deleteAllData)

app.listen(PORT, () => console.log(`Server started at Port: ${PORT}`));