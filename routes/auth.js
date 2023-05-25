const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/USer.js')
const { body, validationResult } = require('express-validator')
const { userExist } = require('../middleware/userMiddleware.js')
const { authMiddleware } = require('../middleware/authMiddleware.js')

const jwtSecret = '_1zMU5oFaJyuBIWg'

router.post('/createUser', [
    // body('name', 'Enter a valid name').isLength({ min: 3 }),
    // body('email', 'Enter a valid email').isEmail().isLength({ max: 100 }),
    // body('password').isLength({ min: 5 }),
], userExist, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({
            success: false,
            msg: errors.errors[0].msg,
            data: {}
        })
    } else {
        const { body } = req;
        const genSalt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(body.password, genSalt)
        body.password = hash
        const user = new User(body)
        const result = await user.save()
        if (result) {
            res.status(201).json({
                success: true,
                data: { id: result.id, name: result.name, email: result.email },
                msg: "User Created successfully",
            })
        } else {
            res.status(400).json({
                success: false,
                data: {},
                msg: "something went wrong",
            })
        }

    }
})

router.post('/login',
//  [
    // body('email', 'Enter a valid email').isEmail(),
    // body('password','Password can not be blank').isLength({ min: 5 }),],
    async (req, res) => {
        console.log(req.body.email ,"req.body.email ")
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({
                success: false,
                msg: errors.errors[0].msg,
                data: {}
            })
        } else {
            const findUser = await User.findOne({ email: req.body.email })
            console.log(findUser,"finduser")
            if (findUser) {
                const comparePass = await bcrypt.compare(req.body.password, findUser.password)

                if (comparePass === true) {
                    const data = {
                        id: findUser.id,
                        email: findUser.email
                    }
                    const token = await jwt.sign(data,jwtSecret)
                    if (token) {
                        res.status(200).json({
                            success: true,
                            msg: "Login successful",
                            data: { token }
                        })
                    } else {
                        res.status(400).json({
                            success: false,
                            msg: "Login unsuccessful",
                            data: {}
                        })
                    }
                } else {
                    res.status(400).json({
                        success: false,
                        msg: "Password does not match",
                        data: {}
                    })
                }
            } else {
                res.status(400).json({
                    success: false,
                    msg: "User email not found",
                    data: {}
                })
            }
        }

    })

router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const user = req.user
        const findUser = await User.findOne({ id: user.id })
        if (findUser) {
            res.status(200).json({
                success: true,
                data: findUser
            })
        } else {
            res.status(400).json({
                success: false,
                msg: "Something went wrong"
            })
        }
    } catch (err) {
        throw Error(err)
    }
})

module.exports = router;