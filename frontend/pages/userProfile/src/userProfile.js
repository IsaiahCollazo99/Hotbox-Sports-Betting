let postForm = document.querySelector("#postForm");
let postInput= document.querySelector("#postInput")
let postFeed = document.querySelector(".usersPost");
let sectName = document.querySelector("#displayName");
let sectRecord = document.querySelector("#displayRecord");
let sectFollowers = document.querySelector("#displayFollowers");
let sectFollowed = document.querySelector("#displayFollowed");
let search = document.querySelector("#searchForm");
const userId = sessionStorage.getItem("userId"); 
if(!userId) userId = 1

const showUserInfo = async () => {
    try {
        await axios.get(`http://localhost:3000/users/${userId}`).then(res => {
            let userInfo = res.data.user
            sectName.innerText = userInfo["full_name"];
            sectRecord.innerText = userInfo["bet_history"];
            debugger            
        })
    } catch(err){
        console.log(err)
    }
}

const showUserPosts = async () => {
        try {
            await axios.get(`http://localhost:3000/users/${userId}/posts`).then(res => {
                let userPosts = res.data.post
                userPosts.forEach(post => {
                    let showPosts = document.createElement("p");
                    showPosts.innerText = userPosts[post]
                    debugger
                })       
            })
        }catch(err){
            console.log(err)
        }
}

const getUserFollowers = async () => {
    try {
        await axios.get(`http://localhost:3000/users/${userId}/followings/followerCount`).then(res => {
            debugger
            let userFollowers = res.data.follower[0]["userfollowercount"]
            sectFollowers.innerText = `${userFollowers}`
            debugger
        })
    } catch(err){
        console.log(err)
    }
}


const getUserFollowed = async () => {
    try {
        await axios.get(`http://localhost:3000/users/${userId}/followings/followingCount`).then(res => {
            debugger
            let userFollowed = res.data.following[0]["userfollowingcount"];
            sectFollowed.innerText = `${userFollowed}`;
            debugger
        })
    } catch(err){
        console.log(err)
    }
}

postForm.addEventListener('submit', (e) => {
    e.preventDefault
    try {
        await.post(``)
    }catch(err){
        console.log(err)
    }
})


getUserFollowed()
getUserFollowers()
showUserPosts()
showUserInfo()

search.addEventListener("submit", (e => {
    e.preventDefault();
    sessionStorage.setItem("userQuery", e.target.children[0].value);
    window.location.href = "./../searchResults/searchResults.html";
}))

