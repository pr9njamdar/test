const express = require('express');
const multer = require('multer');
const path = require('path');
const cors=require('cors')
const app = express();
const port = 3000;
const UserRoute=require('./Routes/User.js')
app.use(cors())

app.use('/User',UserRoute)

// Set up Multer storage
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/'); // The directory where uploaded files will be stored
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//   },
// });

// const upload = multer({ storage: storage });
// Serve uploaded files
//app.use('/uploads', express.static('uploads'));
// Handle POST request for image upload
// app.post('/upload', upload.single('image'), (req, res) => {
//   try {
//     const { file } = req;
//     if (!file) {
//       return res.status(400).send({ success: false, message: 'No file uploaded.' });
//     }

//     // Access the file information via file object
//     const imageUrl = `http://localhost:${port}/uploads/${file.filename}`;

//     return res.status(200).send({ success: true, message: 'File uploaded successfully.', imageUrl });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).send({ success: false, message: 'Server error.' });
//   }
// });

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
