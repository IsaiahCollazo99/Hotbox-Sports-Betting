let userId = sessionStorage.getItem("userId");
let search = document.querySelector("#searchForm");
if(!userId) userId = 1;
let posts = {};

const fetchData = async (url, cb) => {
    try {
        let res = await axios.get(url);
        cb(res.data);
    } catch(err) {
        console.log(err);
    }
} // End of fetchData() function

const getFollowing = (data) => {

} // End of getFollowing() function

const addComment = (e) => {
    e.preventDefault()
    let addComment = e.target.children[0].value;
    let p = document.createElement("p");
    p.innerText = addComment
} // End of addComment() function

const setupPage = async () => {
    await fetchData("http://localhost:3000/users/" + userId + "/followings", getFollowing);
    await populateNewsFeed()
} // End of setupPage() function

setupPage()

search.addEventListener("submit", (e => {
    e.preventDefault();
    sessionStorage.setItem("userQuery", e.target.children[0].value);
    window.location.href = "./pages/searchResults/searchResults.html";
})) // End of search event listener