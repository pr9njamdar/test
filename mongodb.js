const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://Pr9:pr9j1610@cluster0.inutoi5.mongodb.net/?retryWrites=true&w=majority");
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const userSchema = new mongoose.Schema({
    username: String,
    password: String,   
    email: String,
    points:Number,
    Complaints:[{
        complaint:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Complaints'
        }
    }],    
  });
  
  const Complaints = new mongoose.Schema({
    type:String,
    reporter:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Complaints'
    },
    Date:Date,
    location:String,
    Description:String,
    imagepath:String,
  });
  
  
  const Drives = new mongoose.Schema({
    organizer:{type: mongoose.Schema.Types.ObjectId,ref: 'User'},
    Details:String,
    location:String,
    praticipants:[{type: mongoose.Schema.Types.ObjectId,ref: 'User'}],
    imagepath:String,
  });
  
  const User = mongoose.model('User', userSchema);
  const Book = mongoose.model('Complaints', Complaints);
 
  const Fine = mongoose.model('Drives', Drives);
  
  module.exports = { User, Book, Fine };