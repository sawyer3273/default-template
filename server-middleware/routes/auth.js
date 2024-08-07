const express = require('express')
const router = express.Router()
const { afterSignupAuth } = require('../middleware/signupAuth')
const auth = require('../controllers/authController')

// ======= ROUTE FOR /API/AUTH/ ============

router.post('/login', auth.login)
router.get('/login', auth.login)


module.exports = router