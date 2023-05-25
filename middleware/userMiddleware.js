const User = require('../models/USer.js')

module.exports.userExist=async (req,res,next)=>{
    try{
        const {body}= req;
        const result = await User.find({email:body.email})
        if(result.length>0){
            res.status(400).json({
                success:false,
                msg:"User Email Already Exist",
                data:{}
            })
        }else{
            next()
        }
    }catch(err){
        next(err)
    }
}