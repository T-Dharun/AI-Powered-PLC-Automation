const express =require('express');
const { register, login } = require('../controllers/registerController');
const auth=require('../middleware/auth');
const router=express.Router();

router.post("/register",register);
router.post("/login",login);
router.get("/profile", auth, (req, res) => {
    res.status(200).send(`Welcome ${req.user.username}`);
  });
module.exports=router;