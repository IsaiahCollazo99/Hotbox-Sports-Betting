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

const getPosts = async () => {
    try {
        let res = await axios.get(`http://localhost:3000/users/${userId}/posts`) 
        let posts = res.data.post;
        posts.filter(post => {
            postsArr.push({posterId: post.id, body: post.body, timestamp: post.creation_date})
        })
    } catch(error) {
        console.log(error)
    }
} // End of getPosts() function

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

    form.addEventListener("submit", addComment);
} // End of populateNewsFeed() function

const addComment = (e) => {
    e.preventDefault()
    let addComment = e.target.children[0].value;
    let p = document.createElement("p");
    p.innerText = addComment
} // End of addComment() function

const setupPage = async () => {
    await getPosts()
    await populateNewsFeed()
} // End of setupPage() function

setupPage()

search.addEventListener("submit", (e => {
    e.preventDefault();
    sessionStorage.setItem("userQuery", e.target.children[0].value);
    window.location.href = "./pages/searchResults/searchResults.html";
})) // End of search event listener