const express = require('express')
const router = express.Router()

const userServices = require('../services/userRender')
const userController = require('../controller/userController')
const userauth = require('../middleware/authMiddleware')


router.get('/',(req, res) => {
    res.send('Home');
})


router.get('/login',userServices.login)
router.get('/logout',userServices.logout)
router.get('/register',userServices.register)



//API



router.post('/api/registeruser',userController.newuser)
router.post('/api/login',userController.isUser)
router.post('/verifyotp',userController.otp)




module.exports = router