const express = require('express')
const router = express.Router()
const Notes = require('../models/Notes')
const { body, validationResult } = require('express-validator')
const { authMiddleware } = require('../middleware/authMiddleware')
const {noteExist} = require('../middleware/noteMiddleware')

router.post('/addNotes',
// [
    // // body('title',"Please enter small title").isLength({max:25}),
    // body('description').isLength({max:500}),
    // body('tag').isLength({max:20})
// ],
authMiddleware,async(req,res)=>{
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({
                success: false,
                msg: errors.errors[0].msg,
                data: {}
            })
        } else {
        const {body, user:{id}} = req
        body.userId = id
        
        const note = new Notes(body)
        if(note){
            note.save()
            res.status(201).json({
                success: true,
                msg: "Note added successfully",
                data: note
            })
        }else{
            res.status(400).json({
                success: false,
                msg: "SomeThing went wrong",
                data: {}
            })   
        }
    }
    }catch(err){
        throw Error(err)
    }
})

router.get('/allNotes',authMiddleware,async (req,res)=>{
   try{
    const notes = await Notes.find({userId:req.user.id})
    if(notes.length>0){
        res.status(200).json({
            success:true,
            data: notes
        })
    }else{
        res.status(400).json({
            success: false,
            msg: "something went wrong"
        })
    }
   }catch(err){
    throw Error(err)
   }
})

router.get('/userNotes',authMiddleware,async (req,res)=>{
    try{
     const user = req.user
     const notes = await Notes.find({userId: user.id})
     if(notes){
         res.status(200).json({
             success:true,
             data: notes.length>0?notes:[]
         })
     }else{
         res.status(400).json({
             success: false,
             msg: "Something went wrong"
         })
     }
    }catch(err){
     throw Error(err)
    }
 })

router.put('/updateNote/:id',authMiddleware,noteExist,async(req,res)=>{
    try{
        const {note, user, body,params} = req;
        if(note.userId.toString()=== user.id){
            console.log(note.userId.toString(),user.id,"note.userId.toString()=== user.i")
           const newNote ={}
           if(body.title){
            newNote.title = body.title
           }

           if(body.description){
            newNote.description = body.description
           }

           if(body.tag){
            newNote.tag = body.tag
           }
           const result = await Notes.findByIdAndUpdate(params.id,{$set: newNote},{new: true})
            if(result){
                res.status(200).json({
                    success: true,
                    msg:"Notes update successfully",
                })
            }else{
                res.status(400).json({
                    success:false,
                    msg:"something went wrong"
                })
            }
        }else{
            res.status(400).json({
                success:false,
                msg:"Invalid user to update this note"
            })
        }
    }catch(err){
        throw Error(err)
    }
})

router.delete('/deleteNote/:id',authMiddleware,noteExist,async(req,res)=>{
    try{
        const {note,params,user} = req;
       
        if(note.userId.toString()=== user.id){
         
           const result = await Notes.findOneAndDelete({id:params.id})
            if(result){
                res.status(200).json({
                    success: true,
                    msg:"Notes deleted successfully",
                })
            }else{
                res.status(400).json({
                    success:false,
                    msg:"something went wrong"
                })
            }
        }else{
            res.status(400).json({
                success:false,
                msg:"Invalid user to delete this note"
            })
        }
    }catch(err){
        throw Error(err)
    }
})

module.exports = router;