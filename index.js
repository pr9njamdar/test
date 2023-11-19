const express = require('express');
const multer = require('multer');
const path = require('path');
const cors=require('cors')
const app = express();
const UserRoute=require('./Routes/User.js')
const DriveRoute=require('./Routes/Drive.js')

app.use(cors())
console.log(__dirname)
app.use(express.static(__dirname));
app.use('/User',UserRoute)
app.use('/Drive',DriveRoute)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
