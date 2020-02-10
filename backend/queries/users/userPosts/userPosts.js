const db = require("./../../../db/db")
const {isUserExisting} = require("./../users");

const getUserPost = async (req, res, next) => {
    try {
        if(await isUserExisting(req.params.userId)) {
            let posts = await db.any("SELECT * FROM posts WHERE poster_id = $1", req.params.userId);
            if(posts.length) {
                res.status(200).json({
                    posts,
                    status: "Success",
                    message: "All Users Posts"
                })
            } else {
                throw {status: 404, error: "No posts found"};
            }
            
        } else {
            throw {status: 404, error: "User does not exist"}
        }
        
    } catch(err){
        next(err)
    }

}

module.exports = { getUserPost } 