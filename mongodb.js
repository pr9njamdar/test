const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://Pr9:pr9j1610@cluster0.inutoi5.mongodb.net/?retryWrites=true&w=majority");
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const userSchema = new mongoose.Schema({
    username: String,
    pushToken:String,
    password: String,   
    email: String,
    points:Number,
    homelocation:{
      lattitude:Number,
      longitute:Number,
    },
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
    location:{
      lattitude:Number,
      longitude:Number,
    },
    Description:String,
    imagepath:String,
  });
  
  
  const Drives = new mongoose.Schema({
    type:String,
    organizer:{type: mongoose.Schema.Types.ObjectId,ref: 'User'},
    Details:String,
    title:String,
    location:{
      latitude:Number,
      longitude:Number,
    },
    
    imagepath:String,
  });
  
  const GreenUser = mongoose.model('User', userSchema);
  const Complaint = mongoose.model('Complaints', Complaints);
 
  const Drive = mongoose.model('Drives', Drives);
  
  module.exports = { GreenUser, Complaint, Drive };