const express = require('express');
const router = express.Router();
const { ensureAuth, ensureGuest } = require('../middleware/auth');

const Diary = require('../models/Diary');

// @desc  login/landing Page
// @route GET /
router.get('/', ensureGuest, (req, res) => {
    res.render('login', {
        layout: 'login'
    });
})

// @desc  dashboard and also retrieving the diary
// @route GET /dashboard
router.get('/dashboard', ensureAuth, async (req, res) => {
    try {
        const diaries = await Diary.find({}).lean({ virtuals: true });  
        res.render('dashboard', {
            name: req.user.displayName,
            diaries,
        });
    } catch (err) {
        console.error(err);
        res.render('error/500');
    }
    
    
   
})



module.exports = router;