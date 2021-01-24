const express = require('express');
const router = express.Router();
const emailTemplateController = require('../controllers/emailTemplate');

/*  Listing  */
router.get('/', emailTemplateController.listing );

/*  Details  */
router.get('/:emailTemplateId', emailTemplateController.getDetails );

/*  Create  */
router.post('/', emailTemplateController.store );

/*  Edit  */
router.put('/:emailTemplateId',emailTemplateController.update);

/*  Delete  */
router.delete('/:emailTemplateId', emailTemplateController.delete );


module.exports = router;