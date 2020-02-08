// import axios from "axios"
let userId = sessionStorage.getItem("userId");
if(!userId) {userId = 1}
let postsArr = []

// const getFollowing = async () => {
//     try {
//         let res = await axios.get(`http://localhost:3000/users/${userId}/followings/followingCount`) 
//         let following = res.data.following[0]
//         return following.userfollowingcount;
         
//     } catch(error) {
//         console.log(error)
//     }
// }
// getFollowing()
// const getFollowers = async () => {
//     try {
//         let res = await axios.get(`http://localhost:3000/users/${userId}/followings/followerCount`) 
//         // debugger
//         let followers = res.data.follower[0];
//         return followers.userfollowercount; 
//     } catch(error) {
//         console.log(error)
//     }
// }
// getFollowers()
const getUser = async () => {
    try {
        let res = await axios.get(`http://localhost:3000/users/${userId}/posts`) 
        
    } catch(error) {
        console.log(error)
    }
}
const getPosts = async () => {
    try {
        let res = await axios.get(`http://localhost:3000/users/${userId}/posts`) 
        let posts = res.data.post;
        // debugger
        posts.filter(post => {
            console.log(post);
            postsArr.push({posterId: post.id, body: post.body, timestamp: post.creation_date})
        })
    } catch(error) {
        console.log(error)
    }
}

const populateNewsFeed = async () => {
    let newsFeed = document.querySelector(".newsFeed")
    let form = document.createElement("form")
        
    postsArr.forEach(post => {
        // let newsFeed = document.querySelector(".newsFeed")
        let p1 = document.createElement("p")
        let p2 = document.createElement("p")
        let section1 = document.createElement("section")
        let section2 = document.createElement("section")
        
        let input = document.createElement("input")
        let button = document.createElement("button")
        
        button.id = "commentButton"
        form.id = "commentForm"
        section1.id = post.id
        section1.className = "nfPosts"
        
        p1.innerText = post.body
        button.innerText = "Comment"
        
        newsFeed.appendChild(section1)
        section1.appendChild(p1)
        
        section1.appendChild(form)
        form.appendChild(input)
        form.appendChild(button)
        
        section1.appendChild(section2)
        
    })
    form.addEventListener("submit", (e) => {
        e.preventDefault()
        let addComment = e.target.children[0].value
        let p = document.createElement("p")
        p.innerText = addComment
        
        
        debugger
    })
    
}
const setupPage = async () => {
    await getPosts()
    await populateNewsFeed()
}
setupPage()





// let p1 = document.createElement("p1")
// let p2 = document.createElement("p2")

// p1.innerText = await getFollowers() //gets Users Followers and appends 
// followers.appendChild(p1)
// debugger
// // let p = document.createElement("p")
// p2.innerText = await getFollowing();
// following.appendChild(p2)