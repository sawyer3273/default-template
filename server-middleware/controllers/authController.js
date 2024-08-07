
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const config = require('../config').load()
const {check, validationResult} = require('express-validator')
const md5 = require('md5')

module.exports = {
    validate: () => {
        return [
            check('name', 'Name is required').not().isEmpty(),
            check('email', 'Email is required').not().isEmpty(),
            check('password', 'State name is required').not().isEmpty(),
            check('phone', 'Phone is required').not().isEmpty()
        ]
    },
    login: async (req, res) => {    
        res.status(400).json({
            success: false,
            message: 'email or password is not correct'
        })
    }
    
}