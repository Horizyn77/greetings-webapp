export default function Greetings() {

    const greetingsCount = {};
    let greetingMsg = ""; 

    function storeUserAndCount(user) {
        if (!greetingsCount[user]) {
            greetingsCount[user] = 1;
        } else {
            greetingsCount[user]++;
        }
    }

    function greetUser(user, radioBtn) {
        const engGreeting = "Hello";
        const araGreeting = "Marhaba";
        const urdGreeting = "Salaam";

            if(radioBtn === "eng") {
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
        checkObj
    }
}