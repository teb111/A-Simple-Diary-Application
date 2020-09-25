const express = require('express');
const router = express.Router();
const formidable = require('formidable');
const { ensureAuth } = require('../middleware/auth');
const imageMimeTypes = ['image/jpeg', 'image/png']
const Diary = require('../models/Diary'); 


//Desc show add page
//@route /diary/add

router.get('/add', ensureAuth, (req, res) => {
    res.render('diary/add');
});

// @desc add a diary
//@route /diary
router.post('/', ensureAuth, async (req, res) => {
 const form = new formidable.IncomingForm();
 try{
 form.parse(req, async function(err, fields, files) {
  if (err) {

    // Check for and handle any errors here.

    console.error(err.message);
    return;
  }

  console.log({title: fields.title, body: fields.body, image: JSON.parse(fields.image).name});

  const diary = new Diary({
      title: fields.title,
      body: fields.body,
  })
  saveCover(diary, fields.image);
  await diary.save();
 // cloudinary.uploader.upload("2.jpg", function(error, result) {console.log(result, error)});
  res.redirect('/dashboard');
});
    
     } catch (err) {
         console.error(err);
         res.render('error/500');
     }
     
  // console.log(req.body.title, req.body.body, req.body.image);

});

// @desc Get edit diary page
//@route /diary/edit/:id
router.get('/edit/:id', ensureAuth, async (req, res) => {
   try {
       const diary = await Diary.findOne({_id: req.params.id}).lean({ virtuals: true });

       if(!diary) return res.render('error/404');
       
       res.render('diary/edit', { diary, });
       
   } catch (err) {
     console.error(err);
     res.render('error/500');
   }
})

// @desc edit diary
// @route diary/id

router.put('/:id', ensureAuth, async (req, res) => {
  try {
    let diary = await Diary.findById({ _id: req.params.id }).lean();
    
    if(!diary) return res.render('error/404');

    diary = await Diary.findOneAndUpdate({ _id: req.params.id}, req.body,
   {
      new: true,
      runValidators: true,
    });

    res.redirect('/dashboard');

  } catch (err) {
    console.error(err);
    res.render('error/500');
    
  }
});

// @desc show single diary
// route /diary/id

router.get('/:id', ensureAuth, async (req, res) => {
  try {
    const diary = await Diary.findOne({_id: req.params.id}).lean({ virtuals: true });

    if(!diary) return res.render('error/404');
  
    res.render('diary/show', {
      diary,
    })
  } catch (err) {
    console.error(err);
  res.render('error/500');
  }
 
})

// @desc delete diary
// @route /delete/id

router.delete('/delete/:id', ensureAuth, async (req, res) => {
  try {
    const diary = await Diary.findOneAndDelete({_id: req.params.id}).lean();

    if(!diary) return res.render('error/404');

    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.render('error/500');
  }
})


function saveCover(book, imageEncoded) {
   if (imageEncoded == null) return // check if the imageEncoded os valid
   const image = JSON.parse(imageEncoded);
   if(image != null && imageMimeTypes.includes(image.type)) // check the image if it is a valid type and not equal to null
   {
     book.img = new Buffer.from(image.data, 'base64');
     book.imgType = image.type
   }
}


module.exports = router;