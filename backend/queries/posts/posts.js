const db = require("./../../db/db");

const newDate = () => new Date().toString()

const isPostExisting = async (id) => {
    try {
        let post = await db.any("SELECT * FROM posts WHERE id=$1", id);
        if(post.length) return true;
        else return false;
    } catch (err) {
        console.log(err);
    }
} // End of isPostExisting() function

const successReq = (res, data, message) => {
    res.status(200).json({
        status: "success",
        message: message,
        data,
        timestamp: newDate()
    })
} // End of successReq() function

const getAllPosts = async (req, res, next) => {
    try {
        let posts = await db.any("SELECT * FROM posts INNER JOIN users ON posts.poster_id=users.id");
        successReq(res, posts, "Retrieved all posts");
    } catch(error) {
        next(error);
    }
} // End of getAllPosts() function

const getPostById = async (req, res, next) => {
    try {
        let {postId} = req.params;
        if(isPostExisting(postId)) {
            let post = await db.one("SELECT * FROM posts WHERE id=$1", postId);
            successReq(res, post, `Retrieved post at id ${postId}`);
        } else {
            throw {status: 404, error: "Post doesn't exist"}
        }
    } catch(error) {
        next(error);
    }
} // End of getPostById() function

const deletePost = async (req, res, next) => {
    try {
        let {postId} = req.params;
        if(isPostExisting(postId)) {
            let post = await db.one("DELETE FROM posts WHERE id=$1 RETURNING *", postId);
            successReq(res, post, `Deleted post at id ${postId}`);
        } else {
            throw {status: 404, error: "Post doesn't exist"}
        }
    } catch(error) {
        next(error);
    }
} // End of deletePost() function

const editPost = async (req, res, next) => {
    try {
        let {body} = req.body;
        let {postId} = req.params;
        if(isPostExisting(postId)) {
            let post = await db.one("UPDATE posts SET body=$1, creation_date=$2 WHERE id=$3 RETURNING *", [body, newDate(), postId]);
            successReq(res, post, "Updated post");
        } else {
            throw {status: 404, error: "Post doesn't exist"}
        }
    } catch(error) {
        next(error);
    }
} // End of editPost() function

const createPost = async (req, res, next) => {
    try {
        let {poster_id, body} = req.body;
        let post = await db.one("INSERT INTO posts (poster_id, body, creation_date) VALUES($1, $2, $3) RETURNING *", [poster_id, body, newDate()]);
        successReq(res, post, "Created post");
    } catch (error) {
        next(error);
    }
} // End of createPost() function

module.exports = {getAllPosts, getPostById, deletePost, editPost, createPost, isPostExisting, newDate, successReq}
