
const express= require('express')

const multer =require("../middleware/multer_config");
const {verification} =require("../middleware/verfiy")
const {createSauces,getSauces,getOneSauce,deleteSauce,updateSauce,likeSauce}=require("../controllers/sauces")
const router= express.Router();

///////*sauces*////////
router.get("/",verification,getSauces)
router.post("/",verification,multer,createSauces)   
router.get ("/:id",verification,getOneSauce)
router.put("/:id",verification,multer,updateSauce)
router.delete("/:id",verification,deleteSauce)
router.post("/:id/like",verification,likeSauce)

module.exports = router 