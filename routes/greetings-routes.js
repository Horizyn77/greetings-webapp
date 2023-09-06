export default function GreetingsRoutes(greetingsService, greetings) {

    async function showHome(req, res) {
        const numGreeted = await greetingsService.getCount();

        const greeting = greetings.getGreeting();

        await greetingsService.getUsersAndCount();

        res.render("index", {
            greeting,
            numGreeted,
            messages: req.flash()
        })
    }

    async function addGreeting(req, res) {
        const name = req.body.greetedName;
        const radioBtnSelected = req.body.lang;

        const pattern = /[^A-Za-z ]/g

        const containNumsSpecials = pattern.test(name)

        req.flash("error", greetings.setErrMsg(name, radioBtnSelected, containNumsSpecials))

        if (!greetings.setErrMsg(name, radioBtnSelected, containNumsSpecials)) {

            if (!await greetingsService.rowExists(name) && !await greetingsService.caseExists(name)) {
                await greetingsService.add(name);
            } else {
                await greetingsService.update(name);
            }
            greetings.greetUser(name, radioBtnSelected);
        }

        res.redirect("/")
    }

    async function showGreetedUsers(req, res) {
        const getUsersAndCount = await greetingsService.getUsersAndCount();
        const checkUsersAndCount = Object.keys(getUsersAndCount).length > 0;

        res.render("greetedUsers", {
            getUsersAndCount,
            checkUsersAndCount
        })
    }

    async function showCounter(req, res) {
        const getUsersAndCount = await greetingsService.getUsersAndCount()
        const user = req.params.username;
        let userCount = {};

        for (let key in getUsersAndCount) {
            if (key == user) {
                userCount[key] = getUsersAndCount[key];
            }
        }

        res.render("counter", {
            userCount
        })
    }

    async function deleteAllData(req, res) {
        await greetingsService.deleteAll();

        req.flash("reset", "All data has been reset")

        greetings.clearGreeting();

        res.redirect("/")
    }

    return {
        showHome,
        addGreeting,
        showGreetedUsers,
        showCounter,
        deleteAllData
    }
}