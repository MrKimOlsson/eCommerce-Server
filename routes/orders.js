const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

router.post('/', async (req, res) => {
    try {
        res.json(await new Order(req.body).save());
    } catch(error) {
        res.json({message: error});
    }
});


module.exports = router;