const express = require('express');
const router = express.Router();
const Products = require('../models/Product');
const Order = require('../models/Order');

router.get('/', async (req, res) => {
    try {
        res.json(await Order.find());
    } catch(error) {
        res.json({message: error});
    }
});

router.post('/', async (req, res) => {
    try {
        const productIds = req.body.cartData.map((data) => data.productId)
        const productsInDb = await Products.find({ _id: { $in: productIds } })

        productsInDb.forEach(p => {
            const cartDataEntry = req.body.cartData.find((data) => data.productId === p._id.toString())
            const foundStockIdx = p.stock.findIndex((s) => s.size === cartDataEntry.size)

            p.stock[foundStockIdx].quantity -= 1

            p.markModified('stock')
            p.save()
        })

        res.json(await new Order(req.body).save())
    } catch (error) {
        console.log('error', error)
        res.json({message: error})
    }
});


module.exports = router
