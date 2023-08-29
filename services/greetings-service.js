export default function GreetingsService(db) {

    async function add(user) {
        const insertQuery = `
            INSERT INTO greetings (greeted_user, times_greeted) 
            VALUES ($1, $2)
        `
        await db.none(insertQuery, [user, 1])
    }

    async function update(user) {
        const updateQuery = `
            UPDATE greetings SET times_greeted = times_greeted + 1 WHERE greeted_user = $1;
        `
        await db.none(updateQuery, [user])
    }

    async function rowExists(user) {
        const existsQuery = "SELECT 1 FROM greetings WHERE greeted_user = $1";
        const result = await db.any(existsQuery, [user]);

        return result.length > 0;
    }

    async function caseExists(user) {
        const caseQuery = "SELECT greeted_user FROM greetings WHERE lower(greeted_user) = lower($1)";
        const result = await db.any(caseQuery, [user]);

        return result.length > 0;
    }

    async function deleteAll() {
        const deleteQuery = "DELETE FROM greetings";
        const reOrderIds = "SELECT setval('greetings_id_seq', 1, false)";

        await db.none(deleteQuery)
        await db.one(reOrderIds)
    }

    async function getCount() {
        const countQuery = "SELECT COUNT(*) FROM greetings;";

        const result = await db.one(countQuery)

        return parseInt(result.count, 10);
    }

    async function getUsersAndCount() {
        const selectQuery = `
            SELECT greeted_user, times_greeted FROM greetings;
        `
        const result = await db.any(selectQuery)

        const mappedResult = result.reduce((initialObj, currentObj) => {
            return Object.assign(initialObj, { [currentObj.greeted_user]: currentObj.times_greeted })
        }, {})

        return mappedResult;
    }

    return {
        add,
        update,
        rowExists,
        caseExists,
        deleteAll,
        getCount,
        getUsersAndCount
    }
}