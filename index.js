const express = require('express');
const multer = require('multer');
const path = require('path');
const cors=require('cors')
const app = express();
const UserRoute=require('./Routes/User.js')
const DriveRoute=require('./Routes/Drive.js')

app.use(cors())

app.use('/complaints', express.static(path.join(__dirname, 'complaints')));
app.use('/User',UserRoute)
app.use('/Drive',DriveRoute)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(path.join(__dirname, '../complaints/', 'sample.png'))
  console.log(`Server is running on http://localhost:${PORT}`);
});
