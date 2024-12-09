//import PrismaClient
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Import validationResult from express-validator
const { validationResult } = require("express-validator")
const { checkToken } = require('../utils/checkToken')
// const { connect } = require('../routes')

const findAvailable = async (req, res) => {
  const validateToken = checkToken(req.header('Authorization').split(' ')[1])
  const orderExisting = await prisma.order.findFirst({
    where: {
      date: req.body.date
    },
    select: {
      date: true,
      start: true,
      end: true
    }
  })
  let available = null
  if (req.body.date == orderExisting.date) {
    if (req.body.start <= orderExisting.start && req.body.end >= orderExisting.end) {
      available = false
    } else if (req.body.start >= orderExisting.start && req.body.end <= orderExisting.end) {
      available = false
    } else if (req.body.start >= orderExisting.start && req.body.end <= orderExisting.end) {
      available = false
    // } else if (req.body.start >= orderExisting.start && orderExisting.end <= req.body.end) {
    //   available = false
    // } 
    } else if (req.body.start <= orderExisting.start && req.body.end <= orderExisting.start) {
      available = true
    } else if (req.body.start >= orderExisting.start && req.body.end >= orderExisting.end) {
      available = true
    }
  } else {
    available = true
  }
  res.status(200).send({
    success: available,
    message: available  ? 'Waktu yang dipilih tersedia' : 'Waktu yang dipilih tidak tersedia'
})
}

const findOrders = async (req, res) => {
  try {
    const validateToken = checkToken(req.header('Authorization').split(' ')[1])
    //get all orders from database
    const orders = await prisma.order.findMany({
      select: {
        id: true,
        name: true,
        phone: true,
        date: true,
        start: true,
        end: true,
        amount: true,
        receipt: true,
        status: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        createdAt: "desc"
      }
    })
    res.status(200).send({
        success: true,
        message: "Get All Orders Successfully",
        data: orders
    })
  } catch (error) {
    res.status(500).send({
      success: false,
      message: `Internal server error ${error}`
    })
  }
}

const findOrdersByUserId = async (req, res) => {
  const { id } = req.params
  try {
    const validateToken = checkToken(req.header('Authorization').split(' ')[1])
    //get all orders from database
    const orders = await prisma.order.findMany({
      where: {
        memberId: id
      },
      select: {
        id: true,
        name: true,
        phone: true,
        date: true,
        start: true,
        end: true,
        amount: true,
        receipt: true,
        status: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        createdAt: "desc"
      }
    })
    res.status(200).send({
        success: true,
        message: "Get All Orders Successfully",
        data: orders
    })
  } catch (error) {
    res.status(500).send({
      success: false,
      message: `Internal server error ${error}`
    })
  }
}

const createOrder = async (req, res) => {
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

    try {
      const validateToken = checkToken(req.header('Authorization').split(' ')[1])
      //insert data
      const order = await prisma.order.create({
        data: {
          name: req.body.name,
          phone: req.body.phone,
          date: req.body.date,
          start: req.body.start,
          end: req.body.end,
          amount: parseInt(req.body.amount),
          receipt: req.body.receipt,
          status: req.body.status,
          member: {
            connect: {
              id: req.body.memberId
            }
          }
        }
      })
      res.status(201).send({
        success: true,
        message: "Order Created Successfully",
        data: order
      })

    } catch (error) {
      res.status(500).send({
        success: false,
        message: `Internal server error ${error}`,
      })
    }
}

const findOrderById = async (req, res) => {
  //get ID from params
  const { id } = req.params
  
  try {
    const validateToken = checkToken(req.header('Authorization').split(' ')[1])
    //get order by ID
    const order = await prisma.order.findUnique({
      where: {
        id: id
      },
      select: {
        id: true,
        name: true,
        phone: true,
        date: true,
        start: true,
        end: true,
        amount: true,
        receipt: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      }
    })

    //send response
    res.status(200).send({
      success: true,
      message: `Get Order By ID :${id}`,
      data: order
    })

  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Internal server error"
    })
  }
}

//function updateOrder
const updateOrder = async (req, res) => {
    //get ID from params
    const { id } = req.params
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

    try {
      //update order
      const order = await prisma.order.update({
        where: {
          id: id
        },
        data: {
          name: req.body.name,
          phone: req.body.phone,
          date: req.body.date,
          start: req.body.start,
          end: req.body.end,
          amount: parseInt(req.body.amount),
          receipt: req.body.receipt,
          status: req.body.status,
          updatedAt: new Date()
        }
      })
      res.status(200).send({
          success: true,
          message: 'Order Updated Successfully',
          data: order
      })

    } catch (error) {
      res.status(500).send({
        success: false,
        message: `Internal server error ${error}`
      })
    }
}

// upload receipt to Amazon S3 Bucket, next feature
const uploadReceipt = async (req, res) => {

}

//function deleteOrder
const deleteOrder = async (req, res) => {
  //get ID from params
  const { id } = req.params

  try {
    const validateToken = checkToken(req.header('Authorization').split(' ')[1])
    //delete order
    await prisma.order.delete({
      where: {
        id: id
      }
    })

    res.status(200).send({
      success: true,
      message: 'Order Deleted Successfully',
    })

  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Internal server error",
    })
  }

}

//export function
module.exports = {
  findAvailable,
  findOrders,
  findOrdersByUserId,
  createOrder,
  findOrderById,
  updateOrder,
  uploadReceipt,
  deleteOrder
}