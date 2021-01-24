const express = require('express');
const router = express.Router();
const firstCategoryController = require('../controllers/firstCategory');

/*  Listing  */
router.get('/', firstCategoryController.listing );

/*  Details  */
router.get('/:firstcategoryId', firstCategoryController.getDetails );

/*  Create  */
router.post('/', firstCategoryController.store );

/*  Edit  */
router.put('/:firstcategoryId',firstCategoryController.update);

/*  Delete  */
router.delete('/:firstcategoryId',firstCategoryController.delete);


module.exports = router;