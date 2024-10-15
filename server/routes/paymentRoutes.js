const express = require('express');
const router = express.Router();
const momoPaymentMiddleware = require('../middleware/momoPaymentMiddleware');
const crypto = require('crypto')
const axios = require('axios');
const Order = require('../models/orderModel');

router.post('/', momoPaymentMiddleware, async (req, res) => {
    try {
        const { orderId, amount } = req.momoResponse;

        if (!orderId || !amount) {
            return res.status(400).json({ success: false, message: 'Invalid response from MoMo' });
        }
        const order = new Order({
            orderId: orderId,
            userId: req.body.userId,
            fullName: req.body.fullName, 
            address: req.body.address, 
            purchasedProducts: req.body.purchasedProducts || [], 
            totalPrice: amount, 
            paymentStatus: 'pending', 
            shippingStatus: 'pending', 
            createdAt: new Date(), 
        });

        await order.save();
        res.status(200).json(req.momoResponse);
    } catch (error) {
        console.error('Error creating order:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
    
});

router.post('/callback', (req, res) => {
    console.log("callback:: ");
    console.log(req.body);
    res.status(200).json(req.body);
});

router.post('/check-status-transaction', async (req, res) => {
    try {
        const { orderId } = req.body;

        if (!orderId) {
            return res.status(400).json({ success: false, message: 'Order ID is required' });
        }

        const accessKey = 'F8BBA842ECF85';
        const secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
        const partnerCode = 'MOMO';

        const rawSignature = `accessKey=${accessKey}&orderId=${orderId}&partnerCode=${partnerCode}&requestId=${orderId}`;

        const signature = crypto
            .createHmac('sha256', secretKey)
            .update(rawSignature)
            .digest('hex');

        const requestBody = {
            partnerCode: partnerCode,
            requestId: orderId,
            orderId: orderId,
            signature: signature,
            lang: 'vi',
        };

        const options = {
            method: 'POST',
            url: 'https://test-payment.momo.vn/v2/gateway/api/query',
            headers: {
                'Content-Type': 'application/json',
            },
            data: requestBody,
        };

        const result = await axios(options);

        return res.status(200).json(result.data);
    } catch (error) {
        console.error('Error checking transaction status:', error.message);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

module.exports = router;

