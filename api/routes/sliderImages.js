const express = require('express');
const router = express.Router();
const sliderImagesController = require('../controllers/sliderImages');


/*  Listing  */
router.get('/', sliderImagesController.listing);

/*  Details  */
router.get('/:sliderImageId',sliderImagesController.getDetails);

/*  Create  */
router.post('/',sliderImagesController.store);

/*  Edit  */
router.put('/:sliderImageId',sliderImagesController.update);

/*  Delete  */
router.delete('/:sliderImageId',sliderImagesController.delete);



module.exports = router;