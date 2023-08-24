import assert from 'assert';
import GreetingsWebapp from '../greetings-webapp.js';
import pgPromise from 'pg-promise';
import 'dotenv/config'

const pgp = pgPromise({});

const connectionString = process.env.DATABASE_URL;

const db = pgp(connectionString)

const greetingsWebApp = GreetingsWebapp(db)

describe("Testing the greetings database", async function () {
    this.timeout(20000)
    
    beforeEach(async function () {
        //Clean all tables
        await db.none("DELETE FROM greetings")
    })

    it("should check that all data has been cleared", async function () {

        const result = await greetingsWebApp.getNumGreeted()

        assert.equal(result, 0)
    })

    it("should check that a user can be successfully added to the database", async function () {
        await greetingsWebApp.storeUserAndCount("Hidaayat");
        const result = await greetingsWebApp.setUserAndCount()

        const addedUser = { Hidaayat: 1 }

        assert.deepEqual(result, addedUser)

    })

    it("should check that the count can be successfully updated when the user is added twice", async function () {
        await greetingsWebApp.storeUserAndCount("Hidaayat");
        await greetingsWebApp.storeUserAndCount("Hidaayat");
        const result = await greetingsWebApp.setUserAndCount()

        const addedUser = { Hidaayat: 2 }

        assert.deepEqual(result, addedUser)
    })

    it("should check that a different user can be successfully added and updated in the database", async function () {
        await greetingsWebApp.storeUserAndCount("Hidaayat");
        await greetingsWebApp.storeUserAndCount("Ryan");
        await greetingsWebApp.storeUserAndCount("Ryan")
        const result = await greetingsWebApp.setUserAndCount();

        const addedUsers = { Hidaayat: 1, Ryan: 2}

        assert.deepEqual(result, addedUsers)
    })

    it("should check that the table can be cleared when the reset button is pressed", async function () {

        //Resetting greetingsCount object in factory function
        await greetingsWebApp.resetGreetedUsers();

        await greetingsWebApp.storeUserAndCount("Hidaayat");
        await greetingsWebApp.storeUserAndCount("Mark");
        const result = await greetingsWebApp.setUserAndCount();

        const addedUsers = { Hidaayat: 1, Mark: 1}

        //Checking if users have been added successfully
        assert.deepEqual(result, addedUsers)

        //Calling the reset function and deleting all data from the table

        await greetingsWebApp.resetGreetedUsers();

        const resetResult = await greetingsWebApp.setUserAndCount();

        //Checking if greetingsCount object is empty as a result of delete all data from the table

        assert.deepEqual(resetResult, {})

    })
    after(function () {
        db.$pool.end;
    });
})