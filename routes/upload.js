"use strict";
const express = require('express');
const router = express.Router();
const { upload } = require('../controllers/upload');
router.post('/upload', upload);
module.exports = router;
