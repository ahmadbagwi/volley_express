//import PrismaClient
const { PrismaClient } = require('@prisma/client')
const { getPrismaClient } = require('@prisma/client/runtime/library')
const prisma = new PrismaClient()
const jwt = require("jsonwebtoken")
const { validationResult } = require("express-validator")
const { checkToken } = require('../utils/checkToken')

const findUsers = async (req, res) => {
  try {
    const validateToken = checkToken(req.header('Authorization').split(' ')[1])
    //get all orders from database
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        createdAt: true
      },
      orderBy: {
        createdAt: "desc"
      }
    })
    res.status(200).send({
        success: true,
        message: "Get All Users Successfully",
        data: users
    })
  } catch (error) {
    res.status(500).send({
      success: false,
      message: `Internal server error ${error}`
    })
  }
}

const createUser = async (req, res) => {
  // Periksa hasil validasi
  const errors = validationResult(req)
  
  if (!errors.isEmpty()) {
    // Jika ada error, kembalikan error ke pengguna
    return res.status(422).json({
      success: false,
      message: "Validation error",
      errors: errors.array(),
    })
  }
  
  let existingUser = await findUserByEmail(req.body.email)
  
  try {
    //insert data
    if (!existingUser) {
      const user = await prisma.user.create({
        data: {
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          phone: req.body.phone,
          address: req.body.address,
          country: req.body.country
        },
      })
      res.status(201).send({
        success: true,
        message: "User Created Successfully",
        data: user,
      })
    } else {
      res.status(500).send({
        success: true,
        message: "User Exist",
        data: user,
      })
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: `Internal server error ${error}`,
    })
  }
}

const loginUser = async (req, res) => {
  // Periksa hasil validasi
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    // Jika ada error, kembalikan error ke pengguna
    return res.status(422).json({
      success: false,
      message: "Validation error",
      errors: errors.array()
    })
  } 

  let existingUser = await findUserByEmail(req.body.email)
  
  if (!existingUser || existingUser.password != req.body.password) {
    res.status(500).send({
      success: false,
      message: "email or password didn't match",
      data: existingUser
    })
  }

  let token

  try {
    //Creating jwt token
    token = jwt.sign({
      userId: existingUser.id,
      email: existingUser.email
      },
      "secretkeyappearshere",
      { expiresIn: "24h" }
    )
    res.status(200).json({
      success: true,
      message: 'Succes login',
      data: {
        userId: existingUser.id,
        email: existingUser.email,
        token: token
      },
    })
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Internal server error"
    })
  }
}

//function findUserByEmail
const findUserByEmail = async (email) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
      select: {
        id: true,
        email: true,
        password: true
      }
    })
    return user
  } catch (error) {
    return error
  }
}

//export function
module.exports = {
  findUsers,
  createUser,
  loginUser,
  findUserByEmail
}