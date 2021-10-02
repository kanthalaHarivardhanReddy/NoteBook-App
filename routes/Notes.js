const express=require('express');
const router = express.Router();
const fetchuser=require('../middleware/fetchuser');
const {body,validationResult}=require('express-validator');
const Notes=require('../models/Notes');


//route 1 : for fetching the notes of a user : GET '/notes/getnotes'
//login required
router.get('/getnotes',fetchuser,async (req,res)=>{
    const notes=await Notes.findOne({user:req.user.id});
    res.send(notes);
});


//route 2 : for adding a new note of a user : POST '/notes/addnote'
//login required
router.post('/addnote',fetchuser,[
    body('title','Enter a valid title').isLength({min:'3'}),
    body('description','Enter a Descreption').isLength({min:'5'})
],
async (req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    const {title,description,tag}=req.body;
    const note=new Notes({user:req.user.id,title:title,description:description,tag:tag});
    const result=await note.save();
    res.send(result);
});


//route 3 : for updatind the note of a user which is already present : PUT '/notes/updatenote'
//login required
router.put('/updatenote/:id',fetchuser,
async (req,res)=>{
    //checking if note has been changed or not
    try{
        const {title,description,tag}=req.body;
        let newNote={};
        if(title){newNote.title=title};
        if(description){newNote.description=description};
        if(tag){newNote.tag=tag};

        //finding the note by using params id
        let note=await Notes.findById(req.params.id);

        console.log(note);
        //checking is note present or not
        if(!note){
            return res.status(404).send({error:"not Found"});
        }
        //checking for the owner of the note
        if(note.user.toString()!==req.user.id){
            return res.status(404).send({error:"hinot found"});
        }

        note=await Notes.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true});
        res.send(note);
    }catch(err){
        res.status(500).send("Internal server problem");
    }
});



//route 4 : for deleting the note of a user which is already present : DELETE '/notes/deletenote'
//login required
router.delete('/deletenote/:id',fetchuser,
async (req,res)=>{
    try{
        //finding the note by using params id
        let note=await Notes.findById(req.params.id);

        //checking is note present or not
        if(!note){
            return res.status(404).send({error:"not Found"});
        }
        //checking for the owner of the note
        if(note.user.toString()!==req.user.id){
            return res.status(404).send({error:"not found"});
        }

        note=await Notes.findByIdAndDelete(req.params.id);
        res.json({msg:"your note has been deleted",note:note});
    }catch(err){
        res.status(500).send("Internal server problem");
    }
});



module.exports=router;