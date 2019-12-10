const express = require('express');
const path = require('path');
const publicDir = path.join(__dirname, '../../public');
const {authenticate} = require('../middleware/auth');
const router = new express.Router();

router.get('/', authenticate, (req, res) => {
    res.sendFile(path.join(publicDir, "home.html"));
});

router.get('/login', (req, res) => {
    res.sendFile(path.join(publicDir, "login.html"));
});

router.get('/prediksi', authenticate, (req,res) => {
    res.sendFile(path.join(publicDir, "predict.html"));
});

module.exports = router;