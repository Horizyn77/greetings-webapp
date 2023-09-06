
export default function Greetings() {

    let greetingMsg = "";

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
           return "Numbers or special characters are not allowed";
        } else if (input && !checked && nums) {
            return "Numbers or special characters are not allowed";
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

    function clearGreeting() {
        greetingMsg = "";
    }

    return {
        greetUser,
        getGreeting,
        setErrMsg,
        clearGreeting
    }
}