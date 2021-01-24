const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

/*  Listing  */
router.get('/', userController.listing );

/*  Details  */
router.get('/:userId', userController.getDetails );

/*  Create  */
router.post('/', userController.store );

/*  Edit  */
router.put('/:userId',userController.update);

/*  Delete  */
router.delete('/:userId',userController.delete);


module.exports = router;