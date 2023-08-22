import pgPromise from 'pg-promise';
const pgp = pgPromise({});

const connectionString = process.env.DATABASE_URL;

const db = pgp(connectionString)

export default function Greetings() {

    let greetingsCount = {};
    let greetingMsg = "";

    async function storeUserAndCount(user) {
        
        const existsQuery = "SELECT 1 FROM greetings WHERE greeted_user = $1";
        const result = await db.any(existsQuery, [user]);
        const rowExists = result.length > 0;

        const caseQuery = "SELECT greeted_user FROM greetings WHERE lower(greeted_user) = lower($1)";
        const caseResult = await db.any(caseQuery, [user])
        const caseExists = caseResult.length > 0;

        const insertQuery = `
            INSERT INTO greetings (greeted_user, times_greeted) 
            VALUES ($1, $2)
        `

        const updateQuery = `
            UPDATE greetings SET times_greeted = times_greeted + 1 WHERE greeted_user = $1;
        `
        if(!rowExists && !caseExists) {
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

    async function getNumGreeted() {

        const numOfRowsQuery = "SELECT COUNT(*) FROM greetings;";

        const result = await db.one(numOfRowsQuery)

        const numOfRows = parseInt(result.count, 10);
        
        return numOfRows;
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

    function setErrMsg(input, checked, nums) {
        if(input && checked && nums) {
           return "Numbers are not allowed";
        } else if (input && !checked && nums) {
            return "Numbers are not allowed";
        } else if(input && checked && !nums) {
            return;
        } else if (!input && !checked) {
            return "A name and language is required";
        } else if (input && !checked) {
            return "A language is required";
        } else if (!input && checked) {
            return "A name is required";
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

    async function resetGreetedUsers() {
        const deleteQuery = "DELETE FROM greetings";
        const reOrderIds = "SELECT setval('greetings_id_seq', 1, false)";

        await db.none(deleteQuery)
        await db.one(reOrderIds)

        greetingsCount = {};

    }

    return {
        storeUserAndCount,
        greetUser,
        getGreeting,
        getCount,
        checkObj,
        setUserAndCount,
        getNumGreeted,
        setErrMsg,
        resetGreetedUsers
    }
}