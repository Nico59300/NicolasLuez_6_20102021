const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');

const sauceCtrl = require('../controllers/sauceController');
const multer = require('../middlewares/multer-config');


router.post('/', auth, multer, sauceCtrl.postSauce);
router.put('/:id', auth ,multer ,sauceCtrl.updateSauce);
router.delete('/:id', auth , sauceCtrl.deleteSauce)
router.post('/:id/like', auth , sauceCtrl.likeSauce);
router.get('/', auth,  sauceCtrl.getAllSauces);
router.get('/:id', auth , sauceCtrl.getOneSAuce);

module.exports = router;