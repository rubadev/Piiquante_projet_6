const {Sauce}= require('../mongs');
const {verification} = require('../middleware/verfiy')
const fs = require('fs');


function createSauces (req,res){
    
    const sauceObjet = JSON.parse(req.body.sauce)
   
    delete sauceObjet._id;
    
    const newsauce = new Sauce({
        ...sauceObjet,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes : 0,
        dislikes : 0
    })
    console.log("sauce ",newsauce)
    newsauce.save()
        .then(() => res.status(201).json({ message: 'sauce enregistré !'}))
        .catch(error => res.status(409).json({ error }))
}

function getSauces(req,res){
    
    Sauce.find()
        .then(sauce => res.status(201).json(sauce))
        .catch(error => res.status(409).json({ error }))
}

function getOneSauce(req,res){
    
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
     .catch(error => res.status(404).json({ error }));
}

function deleteSauce(req,res){
    console.log("delete sauce")
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
            Sauce.deleteOne({_id: req.params.id})
                .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                .catch(error => res.status(401).json({ error }));
        });
    })
    .catch(error => res.status(404).json({ error }));
}
function verfiySauceExist(sauce,res){
    if(sauce == null){
       return res.status(404).send({message:"sauce not found in database"})
    }
    res.status(200).json({message: 'succes ! '})
}


function updateSauce(req,res){
    console.log("update sauce")
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
            
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
            Sauce.updateOne({ _id: req.params.id }, 
                { ...sauceObject, _id: req.params.id,
                    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`})
            .then(() => res.status(200).json({ message: 'Sauce modifié !'}))
            .catch(error => res.status(400).json({ error })); 
        });
    })
    .catch(error => res.status(404).json({ error }));
  
}


function likeSauce(req,res){
    const {like , userId} = req.body

    if (![0,-1,1].includes(like)) return res.status(401).send({message:"invalid like"})
        
        Sauce.findOne({ _id: req.params.id })
             .then(sauce=> updateVote(sauce,like,userId,res))
             .then(rep => rep.save())
             .then(res.status(200).json({message: 'bien voté !'}))
             .catch(error => res.status(404).json({ error }));
    
}

function updateVote(sauce,like,userId,res){
    if (like === 1 || like ===-1) return incrementVote(sauce,userId,like)
   return resetVote(sauce,userId,res)

}

function resetVote (sauce,userId,res){
    const {usersLiked,usersDisliked}=sauce
if([usersLiked,usersDisliked].every(arr=>arr.includes(userId)))
return new Error("user voted in both way")

if(![usersLiked,usersDisliked].some(arr=>arr.includes(userId)))
return new Error("user not voted ")

if(usersLiked.includes(userId)){
    --sauce.likes
    sauce.usersLiked = sauce.usersLiked.filter(id=> id !== userId)
}else{
    --sauce.dislikes
    sauce.usersDisliked = sauce.usersDisliked.filter(id=> id !== userId)
}
return sauce
}

function incrementVote(sauce,userId,like){
    const {usersLiked,usersDisliked}=sauce
    const voteArray = like === 1 ? usersLiked : usersDisliked

    if(voteArray.includes(userId)) return
    voteArray.push(userId)
    
     like === 1 ? ++sauce.likes : ++sauce.dislikes
return sauce
}





module.exports={createSauces,getSauces,getOneSauce,deleteSauce,updateSauce,likeSauce}