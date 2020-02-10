const db = require("./../../../db/db")
const {isUserExisting} = require("./../users");

const getUserFollowings = async (req, res, next) => {
    try {
        let {userId} = req.params;
        if(isUserExisting(userId)) {
            let followings = await db.any("SELECT * FROM followings INNER JOIN users ON followings.followed_id=users.id WHERE follower_id =$1", userId);
            res.status(200).json({
                followings,
                status: "Success",
                message: "All User Followings"
            })
        } else {
            throw {status: 404, error: "User does not exist"}
        }
    }catch(err){
        next(err)
    }   
}

const createUserFollowing = async (req, res, next) => {
    try {
        let {followedId} = req.body;
        let {userId} = req.params;

        if(isUserExisting(userId)) {
            let following = await db.one("INSERT INTO followings (follower_id, followed_id) VALUES ($1, $2) RETURNING *", [userId, followedId]);
            res.status(200).json({
                following,
                status: "Success",
                message: "Created New Follower"
            })
        } else {
            throw {status: 404, error: "User does not exist"}
        }
    }catch(err){
        next(err)
    }
}

const getUserFollowingCount = async (req, res, next) => {
    try {
        let {userId} = req.params;
        if(await isUserExisting(userId)) {
            let following = await db.any("SELECT COUNT(*) AS userFollowingCount FROM followings WHERE follower_id=$1", userId);
            if(following.length) {
                res.json({
                    following,
                    status: "success",
                    message: "retrieved following count"
                })
            } else {
                throw {status: 404, error: "User is not following anyone"}
            }
        } else {
            throw {status: 404, error: "User does not exist"}
        }

    } catch(err) {
        next(err)
    }
}

const getUserFollowerCount = async (req, res, next) => {
    try {
        let {userId} = req.params;
        if(await isUserExisting(userId)) {
            let follower = await db.any("SELECT COUNT(*) AS userFollowerCount FROM followings WHERE followed_id=$1", userId);
            if(follower.length) {
                res.json({
                    follower,
                    status: "success",
                    message: "retrieved follower count"
                })
            } else {
                throw {status: 404, error: "User has no followers"}
            }
        } else {
            throw {status: 404, error: "User does not exist"}
        }

    } catch(err) {
        next(err)
    }
}

module.exports = { getUserFollowings, createUserFollowing, getUserFollowingCount, getUserFollowerCount }