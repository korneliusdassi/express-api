const express = require('express');
const router = express.Router();

//import database
const connection = require('../config/database.js');
//import express validator
const { body, validationResult } = require('express-validator');

//route view all data
router.get('/', function (req, res) {
  //query
  connection.query('SELECT * FROM posts ORDER BY id desc', function (err, rows) {
    if (err) {
      return res.status(500).json({
        status: false,
        message: 'Internal Server Error',
      });
    } else {
      return res.status(200).json({
        status: true,
        message: 'List Data Posts',
        data: rows,
        fileUrl: 'http://localhost:4000/' + req.file.path,
      });
    }
  });
});

//route store data
router.post(
  '/store',
  [
    //validasi
    body('title').notEmpty(),
    body('content').notEmpty(),
    body('image').notEmpty(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    console.log(req.file);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array(),
      });
    }
    //cek file upload
    if (!req.file) {
      return res.status(400).json({
        status: false,
        message: 'Tidak ada file image yang dipilih',
      });
    }

    //define formData
    let formData = {
      title: req.body.title,
      content: req.body.content,
      // image: req.file.path,
    };

    // insert query
    connection.query('INSERT INTO posts SET ?', formData, function (err, rows) {
      //if(err) throw err
      if (err) {
        return res.status(500).json({
          status: false,
          message: 'Internal Server Error',
        });
      } else {
        return res.status(201).json({
          status: true,
          message: 'Insert Data Successfully',
          data: rows[0],
          fileUrl: 'http://localhost:4000/' + req.file.path,
        });
      }
    });
  }
);

//route show data

router.get('/(:id)', function (req, res) {
  let id = req.params.id;

  connection.query(`SELECT * FROM posts WHERE id = ${id}`, function (err, rows) {
    if (err) {
      return res.status(500).json({
        status: false,
        message: 'Internal Server Error',
      });
    }

    // if post not found
    if (rows.length <= 0) {
      return res.status(404).json({
        status: false,
        message: 'Data Tidak Ditemukan!',
      });
    }
    // if post found
    else {
      return res.status(200).json({
        status: true,
        message: 'Detail Data Post',
        data: rows[0],
        fileUrl: 'http://localhost:4000/' + req.file.path,
      });
    }
  });
});

//route update data
router.put(
  '/update/:id',
  [
    //validation
    body('title').notEmpty(),
    body('content').notEmpty(),
  ],
  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array(),
      });
    }

    //id post
    let id = req.params.id;

    //data post
    let formData = {
      title: req.body.title,
      content: req.body.content,
    };

    // update query
    connection.query(`UPDATE posts SET ? WHERE id = ${id}`, formData, function (err, rows) {
      //if(err) throw err
      if (err) {
        return res.status(500).json({
          status: false,
          message: 'Internal Server Error',
        });
      } else {
        return res.status(200).json({
          status: true,
          message: 'Update Data Successfully!',
        });
      }
    });
  }
);

//delete data by id

router.delete('/delete/:id', function (req, res) {
  let id = req.params.id;
  connection.query(`DELETE FROM posts WHERE id = ${id}`, function (err, rows) {
    //if(err) throw err
    if (err) {
      return res.status(500).json({
        status: false,
        message: 'Internal Server Error',
      });
    } else {
      return res.status(200).json({
        status: true,
        message: 'Delete Data Successfully!',
      });
    }
  });
});

module.exports = router;
