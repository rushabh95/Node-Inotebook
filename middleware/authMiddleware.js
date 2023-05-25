const jwt = require('jsonwebtoken')
const User = require('../models/USer')


module.exports.authMiddleware = async (req,res,next)=>{
    try{
        const token = (req.headers.authorization).split(' ')[1]
        if(token){
            const decode = jwt.verify(token, '_1zMU5oFaJyuBIWg');
            if(decode){
                const user = await User.findById({_id:decode.id}).select('-password')
                user.password=null
                req.user = user
                next()
            }else{
            res.status(400).json({
                success:false,
                msg:"Invalid token"
            })
            }
        }else{
            res.status(400).json({
                success:false,
                msg: "Token not found"
            })
        }
        
    }catch(err){
        throw Error(err)
    }
}
