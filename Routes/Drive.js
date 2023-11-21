const express=require('express')
const cors=require('cors');
const router=express.Router();
const multer = require('multer');
const mongoose=require('mongoose')
const path = require('path');
const fs =require('fs')
const {GreenUser, Drive}=require('../mongodb');
router.use(express.json())
const sendPushNotification=require('./Notifications.js')
router.use(express.urlencoded({extended:false}))
router.use(cors())

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      fs.mkdirSync('Drives/', { recursive: true });
      cb(null, 'Drives/'); // The directory where uploaded files will be stored
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
  });
 
  const upload = multer({ storage: storage });
  router.use('./Drives',express.static('Drives'))

router.post('/Organize',upload.single('image'),async(req,res)=>{
                
        //const imgpath=`../complaints/${file.filename}`
        const{title,message,type,uid,longitude,latitude}=req.body;
        
        const img=req.file.filename;        
        const userid=new mongoose.Types.ObjectId(uid);
        
        const NewDrive = new Drive({organizer:userid,type:type,Details:message,title:title,location:{latitude:latitude,longitude:longitude},imagepath:img});
        await (await NewDrive.save({new:true})).populate('organizer','username').then(async(doc)=>{
          if(doc)
          {
            const radius=0.01
            const location=doc.location
            const tokens=await GreenUser.find({'homelocation.latitude':{$gte : location.latitude-radius,$lte:location.latitude+radius},'homelocation.longitude':{$gte : location.longitude-radius,$lte:location.longitude+radius}}).select('pushToken')
            tokens.map(async(token)=>{
              await sendPushNotification(token.pushToken,doc.title,`Organized by ${doc.organizer.username}`)
            })
            console.log(tokens);
          }
        })       
        return res.status(200).json({success:true});
      
})

router.post('/local',async(req,res)=>{
  let radius=0.01
  const {latitude,longitude}=req.body
  console.log(latitude,longitude)
  await Drive.find({'location.latitude':{$gte : latitude-radius,$lte:latitude+radius},'location.longitude':{$gte : longitude-radius,$lte:longitude+radius}}).populate('organizer','username').then((doc)=>{
    
  res.json(doc)
  })
})

module.exports=router;
