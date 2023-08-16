import pgPromise from 'pg-promise';
const pgp = pgPromise({});

const connectionString = process.env.DATABASE_URL;

const db = pgp(connectionString)

export default function Greetings() {

    const greetingsCount = {};
    let greetingMsg = "";

    async function storeUserAndCount(user) {
        
        const existsQuery = "SELECT 1 FROM greetings WHERE greeted_user = $1 LIMIT 1";
        const result = await db.any(existsQuery, [user]);

        const rowExists = result.length > 0;
    
        const insertQuery = `
            INSERT INTO greetings (greeted_user, times_greeted) 
            VALUES ($1, $2)
        `

        const updateQuery = `
            UPDATE greetings SET times_greeted = times_greeted + 1 WHERE greeted_user = $1;
        `
        if(!rowExists) {
           await db.none(insertQuery, [user, 1])
        } else {
            await db.none(updateQuery, [user])
        }
    }

    async function setUserAndCount() {

        const selectQuery = `
            SELECT greeted_user, times_greeted FROM greetings;
        `

        const result = await db.any(selectQuery)

        const greetingsCountArr = result.map(item => Object.values(item));

        greetingsCountArr.forEach(item => greetingsCount[item[0]] = item[1]);

        return greetingsCount;

    }

    function greetUser(user, radioBtn) {
        const engGreeting = "Hello";
        const araGreeting = "Marhaba";
        const urdGreeting = "Salaam";

        if (radioBtn === "eng") {
            greetingMsg = `${engGreeting}, ${user}`;
        } else if (radioBtn === "ara") {
            greetingMsg = `${araGreeting}, ${user}`;
        } else if (radioBtn === "urd") {
            greetingMsg = `${urdGreeting}, ${user}`;
        }
    }

    function getGreeting() {
        return greetingMsg;
    }

    function getCount() {
        return greetingsCount;
    }

    function checkObj() {
        return Object.keys(greetingsCount).length > 0;
    }

    return {
        storeUserAndCount,
        greetUser,
        getGreeting,
        getCount,
        checkObj,
        setUserAndCount
    }
}