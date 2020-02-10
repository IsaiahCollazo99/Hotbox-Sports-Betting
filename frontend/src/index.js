let userId = sessionStorage.getItem("userId");
let search = document.querySelector("#searchForm");
if(!userId) userId = 1;
let posts = {};
let userFollowing = {};

let newsFeed = document.querySelector("#newsFeed");

const fetchData = async (url, cb) => {
    try {
        let res = await axios.get(url);
        await cb(res.data);
    } catch(err) {
        console.log(err);
    }
} // End of fetchData() function

const getUser = async (data) => {
    userFollowing[data.user.id] = data.user
    await fetchData(`http://localhost:3000/users/${userId}/posts`, getUserPosts);
} // End of getUser() function

const getFollowing = async (data) => {
    let following = data.followings;

    following.forEach(async (user) => {
        userFollowing[user.id] = user;
        await fetchData(`http://localhost:3000/users/${user.id}/posts`, getUserPosts);
    })

    
} // End of getFollowing() function

const getUserPosts = async (data) => {
    let userPosts = data.posts;
    userPosts.forEach(post => {
        posts[post.id] = post;
    })
} // End of getUserPosts() function

const populateNewsFeed = async () => {
    for(let key in posts) {
        let post = posts[key];
        let poster = userFollowing[post.poster_id];

        let postSection = document.createElement("section");
        postSection.className = "postSection";

        let postUser = document.createElement("h4");
        postUser.innerText = poster.full_name;
        postUser.className = "poster";
        postSection.appendChild(postUser);

        if(Number(userId) === poster.id) {
            let postButtons = document.createElement("section");
            postButtons.className = "postButtons";

            let editButton = document.createElement("button");
            editButton.innerText = "edit";
            editButton.onclick = editPost;

            let deleteButton = document.createElement("button");
            deleteButton.innerText = "delete";
            deleteButton.onclick = deletePost;

            postButtons.appendChild(editButton);
            postButtons.appendChild(deleteButton)

            postSection.appendChild(postButtons);
        }

        let postTimestamp = document.createElement("p");
        postTimestamp.innerText = post.creation_date;
        postTimestamp.className = "postTimestamp";
        postSection.appendChild(postTimestamp);

        let postBody = document.createElement("p");
        postBody.innerText = post.body;
        postBody.classname = "postBody";
        postSection.appendChild(postBody);

        let commentsButton = document.createElement("button");
        commentsButton.innerText = "Comments";
        commentsButton.onclick = showComments;
        postSection.appendChild(commentsButton);

        let likesButton = document.createElement("button");
        likesButton.innerText = "Likes";
        likesButton.onclick = showLikes;
        postSection.appendChild(likesButton);

        newsFeed.appendChild(postSection);
    }
} // End of populateNewsFeed() function

const editPost = (e) => {

} // End of editPost() function

const deletePost = (e) => {

} // End of deletePost() function

const showComments = (e) => {

} // End of showComments() function

const showLikes = (e) => {

} // End of showLikes() function

const addComment = (e) => {
    e.preventDefault()
    let addComment = e.target.children[0].value;
    let p = document.createElement("p");
    p.innerText = addComment
} // End of addComment() function

const setupPage = async () => {
    await fetchData("http://localhost:3000/users/" + userId, getUser);
    await fetchData("http://localhost:3000/users/" + userId + "/followings", getFollowing);
    await populateNewsFeed()
} // End of setupPage() function

setupPage()

search.addEventListener("submit", (e => {
    e.preventDefault();
    sessionStorage.setItem("userQuery", e.target.children[0].value);
    window.location.href = "./pages/searchResults/searchResults.html";
})) // End of search event listener