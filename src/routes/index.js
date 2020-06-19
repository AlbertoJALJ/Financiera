import {Cliente} from "../models/Cliente"

const express = require('express');
const router = express.Router();
import authenticate from '../controllers/AuthController'
import {isAdmin, isUser} from '../libs/auth'
router.get('/', isAdmin, async (req,res) => {
  res.render('index')
})
router.get('/check', (req,res,next) => {
  if (req.user) {
    if (req.user.isAdmin) res.redirect('/')
    else res.redirect('/client/')
  }
})
router.get('/logout', authenticate.logOut)
router.get('/login', authenticate.login)
router.post('/login', authenticate.doLogin);
router.post('/register', isAdmin, authenticate.doRegister)


module.exports = router;
