const db = require('../../db/db');

const isUserExisting = async (userId) => {
    let user = await db.any("SELECT * FROM users WHERE id=$1", userId);
    if(user.length) return true;
    return false;
}

const isUsernameExisting = async (username) => {
    let user = await db.any("SELECT * FROM users WHERE upper(username)=$1", username.toUpperCase());
    if(user.length) return true;
    else return false;
}

const findUsers = async (req, res, next) => {
    try {
        let {search} = req.query;
        let users = await db.any("SELECT * FROM users WHERE upper(full_name) LIKE '%" + search.toUpperCase() + "%'");
        if(users.length) {
            res.status(200).json({
                users,
                status: "success",
                message: "Retrieved searched users"
            })
        } else {
            throw {status: 404, error: "No users found"};
        }
    } catch(err) {
        console.log(err);
        next(err);
    }
}

const getUsers = async (req, res, next) => {
    try {
        if(req.query.search) {
            findUsers(req, res, next);
        } else {
            let users = await db.any("SELECT * FROM users");
            res.status(200).json({
                users, 
                status: "success",
                message: "All Users"
            })
        }
    } catch(err){
        next(err)
    }
}

const getUser = async (req, res, next) => {
    try {
        let {userId} = req.params
        if(await isUserExisting(userId)) {
            let user = await db.one("SELECT * FROM users WHERE id = $1", userId);
            res.status(200).json({
                user,
                status: "success",
                message: "Retrieved One User"
            })
        } else {
            throw {status: 404, error: "User does not exist"}
        }
        
    }catch(err){
        next(err)
    }
}

const createUser = async (req, res, next) => {
    try {
        if(await isUsernameExisting(req.body.username)) {
            throw {status: 409, error: "A user with that username exists already."};
        } else {
            let user = await db.one("INSERT INTO users (full_name, birth_date, city, state, username, password) VALUES (${full_name}, ${birth_date}, ${city}, ${state}, ${username}, ${password}) RETURNING *", req.body);
            res.status(200).json({
                user,
                status: "Success",
                message: "Created New User"
            })
        }
        
    } catch(err){
        next(err)
    }
}

const deleteUser = async (req, res, next) => {
    try {
        if(await isUserExisting(req.params.userId)) {
            let user = await db.one("DELETE FROM users WHERE id =$1 RETURNING *", req.params.userId);
            res.status(200).json({
                user,
                status: "Success",
                message: "Deleted User"
    
            })
        } else {
            throw {status: 404, error: "User does not exist"}
        }
        
    } catch(err){
        next(err)
    }
}

const updateUser = async (req, res, next) => {
    try {
        let {bet_wins, bet_losses} = req.body;
        let {userId} = req.params;
        if(await isUserExisting(userId)) {
            let updatedUser;
            if(bet_wins) {
                updatedUser = await db.one("UPDATE users SET bet_wins=bet_wins+1 WHERE id=$1 RETURNING *", [userId]);
            } else {
                updatedUser = await db.one("UPDATE users SET bet_losses=$1 WHERE id=$2 RETURNING *", [bet_losses, userId]);
            }
            res.json({
                status: "success",
                message: "update user",
                updatedUser
            })
        } else {
            throw {status: 404, error: "User does not exist"}
        }
    } catch (err) {
        next(err);
    }
}

module.exports = { getUsers, getUser, createUser, deleteUser, updateUser, isUserExisting }