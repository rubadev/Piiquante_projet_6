
const mongoose= require('mongoose');
const password = process.env.DB_PASS
const DBuser = process.env.DB_USER
const uniqueValidateur= require("mongoose-unique-validator")

mongoose.connect(`mongodb+srv://${DBuser}:${password}@cluster0.k2biich.mongodb.net/?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


//////////////user
  const userSchema= new mongoose.Schema({
    email : { type: String, required: true ,unique: true },
    password : { type: String, required: true }
  })

  const User = mongoose.model('user',userSchema);

  userSchema.plugin(uniqueValidateur)


/////////////////////sauce
const sauceShema= mongoose.Schema({
    userId : String ,
    name : String ,
    manufacturer : String ,
    description : String,
    mainPepper : String ,
    imageUrl : String ,
    heat : Number,
    likes : Number ,
    dislikes : Number ,
    usersLiked : [String] ,
    usersDisliked : [String]
});

const Sauce = mongoose.model("sauce",sauceShema);





  module.exports = {mongoose,User,Sauce}