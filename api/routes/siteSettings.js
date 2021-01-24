const express = require('express');
const router = express.Router();
const siteSettingsController = require('../controllers/siteSettings');


/*  Edit  */
//router.put('/:roleId',roleController.update);
/*  Listing  */
router.get('/', siteSettingsController.listing );

router.post('/', siteSettingsController.store );



router.put('/:siteSettingId', siteSettingsController.update);

module.exports = router;