const express=require('express')
const cors=require('cors');
const router=express.Router();
const multer = require('multer');
const mongoose=require('mongoose')
const path = require('path');
const sendPushNotification=require('./Notifications.js')
const {GreenUser, Complaint}=require('../mongodb');
const fs =require('fs')
router.use(express.json())
router.use(express.urlencoded({extended:false}))
router.use(cors())

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
     
      fs.mkdirSync('complaints/', { recursive: true }); // The directory where uploaded files will be stored
      cb(null, 'complaints/');
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
  });
 
  const upload = multer({ storage: storage });
  

router.post('/Register', async (req,res)=>{
    const {name,password,email,pushToken}=req.body;
    const user = new GreenUser({username:name,password:password,email:email,pushToken:pushToken})
    await user.save().then((doc)=>{
        console.log('User Saved');
        res.json({doc:doc})
    })
})
router.post('/send-notification', async (req, res) => {
  const { pushToken, title, body } = req.body;

  if (!pushToken || !title || !body) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  // Call the sendPushNotification function
  await sendPushNotification(pushToken, title, body);

  res.json({ success: true });
});
router.post('/RegisterComplaint',upload.single('image'),async(req,res)=>{
        const { file } = req;
        if (!file) {
          return res.status(400).json({success:false,message:'no image was uploaded'});
        }  
      
        const{Description,type,latitude,longitude,uid}=req.body;
        console.log(file)
        const img=file.filename;       
        const userid=new mongoose.Types.ObjectId(uid);
        
        const complaint=new Complaint({type:type,reporter:userid,location:{latitude:latitude,longitude:longitude},Description:Description,imagepath:img})
        await complaint.save().then(async(doc)=>{
          const id=doc.id;
          await GreenUser.findByIdAndUpdate(uid,{$push:{Complaints:{complaint:id}}});
        })
        return res.status(200).json({success:true,message:'complaint was registered'});
      
})

router.post('/Login',async (req,res)=>{
    
    const {email,password}=req.body    
    GreenUser.findOne({email:email}).then((doc)=>{
        if(doc)
        {
            if(doc.password===password) res.json({success:true ,userid:doc.id}).status(200);
            else res.json({message:'Password incorrect',success:false}).status(401);
        }
        else
        {
            res.json({message:'Creds incorrect',success:false}).status(401);
        }
    })   
})



module.exports=router;
