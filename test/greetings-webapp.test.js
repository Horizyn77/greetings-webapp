import assert from 'assert';
import GreetingsService from '../services/greetings-service.js';
import pgPromise from 'pg-promise';
import 'dotenv/config'

const pgp = pgPromise({});

const connectionString = process.env.DATABASE_URL;

const db = pgp(connectionString)

const greetingsService = GreetingsService(db)

describe("Testing the greetings database", async function () {
    this.timeout(20000)
    
    beforeEach(async function () {
        //Clean all tables
        await db.none("DELETE FROM greetings")
    })

    it("should check that all data has been cleared", async function () {

        const result = await greetingsService.getCount();

        assert.equal(result, 0)
    })

    it("should check that a user can be successfully added to the database", async function () {
        await greetingsService.add("Hidaayat");
        const result = await greetingsService.getUsersAndCount();

        const addedUser = { Hidaayat: 1 }

        assert.deepEqual(result, addedUser)

    })

    it("should check that the count can be successfully updated when the user is added twice", async function () {
        await greetingsService.add("Hidaayat");
        await greetingsService.update("Hidaayat");
        const result = await greetingsService.getUsersAndCount()

        const addedUser = { Hidaayat: 2 }

        assert.deepEqual(result, addedUser)
    })

    it("should check that a different user can be successfully added and updated in the database", async function () {
        await greetingsService.add("Hidaayat");
        await greetingsService.add("Ryan");
        await greetingsService.update("Ryan")
        const result = await greetingsService.getUsersAndCount();

        const addedUsers = { Hidaayat: 1, Ryan: 2}

        assert.deepEqual(result, addedUsers)
    })

    it("should check that the table can be cleared when the reset button is pressed", async function () {
        //Adding data to the database

        await greetingsService.add("Hidaayat");
        await greetingsService.add("Mark");
        const result = await greetingsService.getUsersAndCount();

        const addedUsers = { Hidaayat: 1, Mark: 1}

        //Checking if users have been added successfully
        assert.deepEqual(result, addedUsers)

        //Calling the reset function and deleting all data from the table

        await greetingsService.deleteAll();

        const resetResult = await greetingsService.getUsersAndCount();

        //Checking if no data is returned as a result of deleting all data from the table

        assert.deepEqual(resetResult, {})

    })
    after(function () {
        db.$pool.end;
    });
})