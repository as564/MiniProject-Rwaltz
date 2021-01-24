const express = require('express');
const router = express.Router();
const secondCategoryController = require('../controllers/secondCategory');

/*  Listing  */
router.get('/', secondCategoryController.listing);

/*  Details  */
router.get('/:secondCategoryId', secondCategoryController.getDetails);

/*  Create  */
router.post('/', secondCategoryController.store);

/*  Edit  */
router.put('/:secondCategoryId', secondCategoryController.update);

/*  Delete  */
router.delete('/:secondCategoryId', secondCategoryController.delete);


module.exports = router;