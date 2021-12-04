const express = require('express');
const router = express.Router();
const sauceCtrl = require('../controllers/sauceController');
const multer = require('../middlewares/multer-config');


router.post('/',multer, sauceCtrl.postSauce);
router.put('/:id',multer ,sauceCtrl.updateSauce);
router.delete('/:id', sauceCtrl.deleteSauce)
router.post('/:id/like', sauceCtrl.likeSauce);
router.get('/', sauceCtrl.getAllSauces);
router.get('/:id', sauceCtrl.getOneSAuce);

module.exports = router;