let login = document.querySelector("#login");
let signUp = document.querySelector("#signUp");
let logInForm = document.querySelector("#logInForm");
let signUpForm = document.querySelector("#signUpForm");
let logo = document.querySelector("#logo");
let loginH1 = document.querySelector("#loginH1")
let signUpH1 = document.querySelector("#signUpH1")
let main = document.querySelector("main");
let buttons = document.querySelector("#buttons")

const showLogin = () => {
    loginH1.innerText = "Welcome Back";
    loginH1.style.color = "rgba(6,25,31,1)";
    buttons.style.display = "none";
    signUp.style.display = "none";
    login.style.display = "inline";
}

const showSignUp = () => {
    signUpH1.innerText = "Be part of the action !";
    buttons.style.display = "none";
    login.style.display = "none";
    signUp.style.display = "inline";
}

logInForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    let loginUser = document.querySelector("#loginUser").value;
    let loginPass = document.querySelector("#loginPass").value;
    if(!loginUser || !loginPass) {
        loginH1.innerText = "Please fill out all the information";
        loginH1.style.color = "#940E06";
    } else {
        fetchData(`http://localhost:3000/users/logins?username=${loginUser}&password=${loginPass}`, checkLogin);
    }
})

signUpForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    let signUpFirst = document.querySelector("#signUpFirst").value;
    let signUpLast = document.querySelector("#signUpLast").value;
    let signUpBirth = document.querySelector("#signUpBirth").value;
    let signUpCity = document.querySelector("#signUpCity").value;
    let signUpState = document.querySelector("#signUpState").value;
    let signUpUser = document.querySelector("#signUpUser").value;
    let signUpPass = document.querySelector("#signUpPass").value;
    if(!signUpFirst || !signUpLast || !signUpBirth || !signUpUser || !signUpCity || signUpState === "disabled" || !signUpPass) {
        signUpH1.innerText = "Please fill out all the information";
        signUpH1.style.color = "#940E06";
    } else if(isUserUnder18(signUpBirth)){
        signUpH1.innerText = "Sorry, you're too young to sign up.";
        signUpH1.style.color = "#940E06";
    } else {
        try {
            let user = {
                full_name: signUpFirst + " " + signUpLast, 
                birth_date: signUpBirth,
                city: signUpCity,
                state: signUpState,
                username: signUpUser,
                password: signUpPass 
            }
            let res = await axios.post(`http://localhost:3000/users`, user);
            sessionStorage.setItem("userId", JSON.stringify(res.data.user.id));
            window.location.href = "./../../index.html";
        } catch(err) {

        }
    }
}) // End of DOMContentLoaded

const isUserUnder18 = (date) => {
    let currentDate = new Date();
    let userBirth = new Date(date);
    return (currentDate.getTime() - userBirth.getTime()) < 568025136000;
} // End of isUserUnder18() function

const checkLogin = (data) => {
    sessionStorage.setItem("userId", JSON.stringify(data.user[0].id));
    window.location.href = "./../../index.html";
} // End of checkLogin() function

const errorHandling = (err) => {
    if(login.style.display !== "none") {
        loginH1.innerText = err.error;
        loginH1.style.color = "#940E06"
    } else if(signUp.style.display !== "none") {
        signInh1.innerText = err.error;
        signInh1.style.color = "#940E06"
    }
} // End of errorHandling() function

const fetchData = async (url, callback) => {
    try {
        let res = await axios.get(url);
        callback(res.data);
    } catch(err) {
        if(err.response) errorHandling(err.response.data)
        else console.log(err);
    }
} // End of fetchData() function
