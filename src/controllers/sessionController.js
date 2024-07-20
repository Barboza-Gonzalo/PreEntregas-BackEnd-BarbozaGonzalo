const userModel = require("../DAO/models/users.model.js");
const  {createHash}  = require("../utils.js");



async function registerUser (req,res){
    res.redirect('/login')
}


async function loginUser (req,res){
    if (!req.user) return res.status(400).send({ status: 'error', error: "Invalid credentials" })
    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email,
        role: req.user.role
    }
    res.redirect('/products')
}


async function failRegister (req,res){
    console.log("Failed Strategy")
    res.send({ error: "Failed" })
}
async function logoutUser (req,res){
    req.session.destroy((err) => {
        if (err) return res.status(500).send('Error al cerrar sesión');
        res.redirect('/login');
    })
}

async function failLogin (req,res){
    res.redirect('/login')
}






module.exports={
    registerUser,
    loginUser,
    logoutUser,
    failRegister,
    failLogin
}