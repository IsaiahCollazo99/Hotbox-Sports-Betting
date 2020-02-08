let userId = sessionStorage.getItem("userId");
if(!userId) userId = 1;
let upcomingGames = document.querySelector(".upcomingGames");
let gameSelect = document.querySelector("#betGame");
let teamSelect = document.querySelector("#betTeam");
let betAmount = document.querySelector("#betAmount");
let betForm = document.querySelector("#betForm");
let betFormResposne = document.querySelector("#betFormResponse");
let betFeed = document.querySelector("#betsFeed");
let games = {};

const fetchData = async (url, cb) => {
    try {
        let res = await axios.get(url);
        cb(res.data);
    } catch(err) {
        console.log(err)
    }
} // End of fetchData() function

const createUpcomingElement = (event) => {
    let option = document.createElement("option");
    let section = document.createElement("section");
    section.className = "upcomingSection";
    option.innerText = `${event.teams[0].name} VS. ${event.teams[1].name}`;
    option.value = event.event_id;
    let h3 = document.createElement("h3");
    h3.innerHTML = `${event.teams[0].name} <span style="color:#FDB927">VS.</span> ${event.teams[1].name}`;
    section.appendChild(h3);
    upcomingGames.appendChild(section);
    games[event.event_id] = event.teams;
    gameSelect.appendChild(option);
} // End of createUpcomingElement() function

const getUpcomingGames = (data) => {
    data.forEach(event => {
        createUpcomingElement(event);
    })

} // End of getUpcomingGames() function

const takeBet = async (e) => {
    let betId = e.target.parentNode.id;
    try {
        let res = await axios.patch(`http://localhost:3000/bets/${betId}`, {taker_id: userId});
        betFormResposne.innerHTML = "";
        let h1 = document.createElement("h1");
        h1.innerText = "Took the bet!";
        betFormResposne.appendChild(h1);
        if(await betWin()) {
            // Update the users win ratio and the betters loss ratio
        } else {
            // Update the users loss ratio and the betters loss ratio
        }
        await fetchData("http://localhost:3000/bets", populateBetsFeed);
    } catch(err) {
        console.log(err);
    }
} // End of takeBet() function

const betWin = async () => {
    if(Math.floor(Math.random() * 2)) return true;
    else return false
} // End of betWin() function

const populateBetsFeed = (data) => {
    let bets = data.bets;
    betFeed.innerHTML = "";
    for(let i = 0; i < bets.length; i++) {
        let bet = bets[i];
        if(userId === bet.better_id) continue;
        else {
            let game = games[bet.game_id];
            let team = game[0].team_id === bet.team_id ? game[0] : game[1];
            let betSection = document.createElement("section");
            betSection.className = "betSection";
            betSection.id = bet.id;
        
            let betInfo = document.createElement("p");
            betInfo.className = "bets";
            betInfo.innerHTML = `<span style="color:#FDB927">User:</span> ${bet.username} <span style="color:#FDB927">Game:</span> ${game[0].name} VS. ${game[1].name} <span style="color:#FDB927">Team:</span> ${team.name} <span style="color:#FDB927">Amount:</span> ${bet.bet_amount}`;
            
            let takerButton = document.createElement("button");
            takerButton.innerText = "Take Bet";
            takerButton.onclick = takeBet;

            betSection.appendChild(betInfo);
            betSection.appendChild(takerButton);
            betFeed.appendChild(betSection);
        }
    }
    
} // End of populateBetsFeed() function

let getData = async () => {
    await fetchData("http://localhost:3000/events", getUpcomingGames);
    await fetchData("http://localhost:3000/bets", populateBetsFeed);
} // End of getData() function

gameSelect.addEventListener("change", (e) => {
    teamSelect.innerHTML = "<option value='disabled' selected disabled>Select a Team</option>"
    let teams = games[e.target.value];
    teams.forEach(team => {
        let option = document.createElement("option");
        option.innerText = team.name;
        option.value = team.team_id;
        teamSelect.appendChild(option);
    })
})

betForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if(gameSelect.value === "disabled" || teamSelect.value === "disabled" || betAmount.value <= 0 || !betAmount.value) {
        betFormResposne.innerHTML = "";
        let h1 = document.createElement("h1");
        h1.style.color = "Red";
        h1.innerText = "Please fill out all information";
        betFormResposne.appendChild(h1);
    } else {
        try {
            let res = await axios.post("http://localhost:3000/bets", {game_id: gameSelect.value, team_id: teamSelect.value, better_id: userId, bet_amount: betAmount.value});
            betFormResposne.innerHTML = "";
            let h1 = document.createElement("h1");
            h1.innerText = "Created bet!";
            betFormResposne.appendChild(h1);
        } catch(err) {
            console.log(err);
        }
    }
})

getData();