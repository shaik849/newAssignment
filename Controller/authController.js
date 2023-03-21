const data = require('../Model/apiModel')
const jwt = require("jsonwebtoken")

function createToken(id){
    return jwt.sign({id}, process.env.SECRET_KEY)
}

function handleError(err) {
    let errors = {email : '',password : '',firstname : '',lastname : '',company : '',role: ''}
    if(err.code === 11000){
        errors.email = "Email is already registered"
        return errors;
     }
     if(err.message.includes("user validation failed")){
        Object.values(err.errors).forEach(({properties}) =>{
            errors[properties.path] = properties.message
        })
    }
    return errors;
}

const signup = async (req, res) =>{
    try{
        const getMyData = new data(req.body)
        await getMyData.save()
        return res.status(201).json({
           message : "data sent successfully",
         })
    }catch(err){
        let errors = handleError(err)
        return res.status(500).json({"error" : errors})
    }
}

const login = async (req, res) =>{
    try{
        const {email, password} = req.body;
    const user = await data.loggedin(email, password)
    const result = await data.findOne({email: user.email })
   return res.status(200).json({
        token : createToken(result._id)
    })
}
    catch(err){
       return res.status(400).json({error : "check email or password"+ err })
    }
}

const profile = async (req, res) => {
    try{
        const result = await data.findOne({email: req.body.email})
      return res.status(200).json({user : {
            firstname : result.firstname,
            lastname : result.lastname,
            email : result.email,
            company : result.companyname,
            role : result.role,    
        }})
    }catch(err){
     return res.status(400).json({error : "check the authentication"+ err })
    }
}

module.exports = {
    signup,
    login,
    profile
}