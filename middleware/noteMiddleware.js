const Notes = require('../models/Notes')

module.exports.noteExist = async(req,res,next)=>{
    try{
        const {params:{id}} = req;
        const findNote = await Notes.findOne({_id: id})
        if(findNote){
            req.note = findNote
            next()
        }else{
           res.status(400).json({
            success: false,
            msg: "Note not found"
           })
        }
    }catch(err){
        next(err)
    }
}