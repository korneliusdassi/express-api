const express = require('express');
const app = express();
const port = 4000;
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use('img', express.static(path.join(__dirname, 'img')));

//import library CORS
const cors = require('cors');

//use cors
app.use(cors());

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/img');
  },
  fileName: (req, file, cb) => {
    cb(null, Date.now().getTime() + extname(file.originalname));
    // cb(null, Date.now().getTime() + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'));

//import router posts
const postsRouter = require('./routes/posts.js');

//set prefix URL-nya adalah /api/posts, dan parameter kedua berupa file router yang telah di import sebelumnya.
app.use('/api/posts', postsRouter);

app.listen(port, () => {
  console.log(`app running at http://localhost:${port}`);
});
