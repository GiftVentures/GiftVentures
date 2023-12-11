require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors")
const express = require("express");
const bcrypt = require('bcrypt');
const User = require('./models/user');
const app = express();
const PORT = process.env.PORT || 3500;
const jwt = require("jsonwebtoken")

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

let refreshTokens = [];

// database connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("Successful database connection!"))
    .catch((error) => console.log(error.message));


// generating tokens
const generateAccessToken = (user) => {
    return jwt.sign(
        {id:user.id, username:user.username, isAdmin:user.isAdmin },
        process.env.SECRET_KEY,
        {expiresIn: "5s"})
}

const generateRefreshToken = (user) => {
    return jwt.sign(
        {id:user.id, username:user.username, isAdmin:user.isAdmin },
        process.env.REFRESH_SECRET_KEY)
}

// checkin if the user is signed in
const verify = (req,res,next)=>{
    const authHeader = req.headers.authorization;
    if (authHeader){
        const token = authHeader.split(" ")[1];
        
        jwt.verify(token, process.env.SECRET_KEY, (err,user) => {
            if(err){
                return res.status(403).json("Token is not valid");
            }
            req.user = user;
            next();
        });
    }else{
        res.status(401).json("You are not authenticated")
    }
}

//refreshing the token when it expires
app.post("/refresh", (req,res) =>{
    const userId = req.body.id
    const refreshToken = req.body.token
    if(!refreshToken) return res.status(401).json("You are not authenticated")
    if(!refreshTokens.includes(refreshToken)){
        return res.status(403).json("Refresh token is not valid");
    }
    jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY, (err, user) => {
        err && console.log(err);
        refreshTokens = refreshTokens.filter((token) => token !==refreshToken);
        const newAccessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken(user);
        refreshTokens.push(newRefreshToken);
        res.status(200).json({
            id: userId,
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        })

    })
})

app.delete("/users/:userId", verify, (req,res) =>{
    console.log(req.user.id);
    console.log(req.params.userId);
    if(req.user.id === req.params.userId || req.user.isAdmin){
        res.status(200).json("User has been deleted.")
    } else{
        res.status(403).json("You are not allowed to delete this user")
    }
})

app.post("/register", async (req, res) => {
    const { username, firstName, secondName, password, email, mobile, birthDate } = req.body;
    try {
        const checkUsername = await User.findOne({ username : username });
        const checkEmail = await User.findOne({ email: email });

        if (checkEmail) {
            return res.status(409).json({ error: "Ezzel az emaillel már létezik fiók!" });
        }

        if (checkUsername) {
            return res.status(409).json({ error: "Ez a felhasználónév már foglalt!" });
        }

        if (!username || !firstName || !secondName || !password || !email || !mobile || !birthDate ){
            return res.status(400).json({ error: "Minden mező kitöltése kötelező!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            username,
            firstName,
            secondName,
            password: hashedPassword,
            email: email.toLowerCase(),
            mobile,
            birthDate,
            isAdmin: false
        });

        await user.save();

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        refreshTokens.push(refreshToken);

        res.status(200).json({
            id: user._id,
            username: user.username,
            isAdmin: user.isAdmin,
            accessToken,
            refreshToken,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Szerverhiba történt!" });
    }
});

app.post("/login", async (req, res)=>{
    const {username, password} = req.body;
    try{
        const user = await User.findOne({username: username})
        if (user){
            const validPassword = await bcrypt.compare(password, user.password);
            if(validPassword){
                const accessToken = generateAccessToken(user)
                const refreshToken = generateRefreshToken(user)
                refreshTokens.push(refreshToken)
                
                res.status(200).json({
                    id: user._id,
                    accessToken,
                    refreshToken,
                })
            }
            else{
                res.status(404).json("Wrong password")
            }   
        } else{
            res.status(404).json("notfound")
        }
    } catch{
        res.json("Something went wrong")
    }
})

app.post("/logout", verify, (req,res)=>{
    const refreshToken = req.body.token;
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken)
    res.status(200).json("You logged out succesfully")
})


//SERVER LISTENING//
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});
