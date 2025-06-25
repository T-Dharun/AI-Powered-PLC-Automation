const express =require('express');
const { uploadCode, getCode } = require('../controllers/uploadPlc');
const router=express.Router();

router.post("/upload",uploadCode);
router.get("/getcode",getCode)
module.exports=router;