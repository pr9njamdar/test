const express=require('express')
const cors=require('cors');
const router=express.Router();
const multer = require('multer');
const mongoose=require('mongoose')
const path = require('path');
router.use(express.json())
router.use(express.urlencoded({extended:false}))
router.use(cors())

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './complaints'); // The directory where uploaded files will be stored
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
  });
 
  const upload = multer({ storage: storage });
  router.use('./complaints',express.static('complaints'))

router.post('/Register', async (req,res)=>{
    const {name,password,email,role}=req.body;
    const user = new User({username:name,password:password,email:email,role:role})
    await user.save().then((doc)=>{
        console.log('User Saved');
        res.send(doc);
    })
})

router.post('/RegisterComplaint',upload.single('image'),async(req,res)=>{
    try {
        const { file } = req;
        if (!file) {

          return res.status(400).send({ success: false, message: 'No file uploaded.' });
        }  
        console.log(file)
        const imageUrl = `http://localhost:${3000}/complaints/${file.filename}`;    
        console.log(imageUrl);
        return res.status(200).send({ success: true, message: 'File uploaded successfully.'});
      } catch (error) {
        console.error(error);
        return res.status(500).send({ success: false, message: 'Server error.' });
      }
})

router.post('/Login',async (req,res)=>{
    const {password,email}=req.body;
    User.findOne({email:email}).then((doc)=>{
        if(doc)
        {
            if(doc.password===password) res.send(doc.id).status(200);
            else res.send('Password incorrect').status(401);
        }
        else
        {
            res.send('Creds incorrect').status(401);
        }
    })   
})

module.exports=router;
