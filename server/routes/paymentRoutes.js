const express = require('express');
const router = express.Router();
const momoPaymentMiddleware = require('../middleware/momoPaymentMiddleware');
const crypto = require('crypto')
const axios = require('axios');

// Route for initiating MoMo payment
router.post('/', momoPaymentMiddleware, (req, res) => {
    res.status(200).json(req.momoResponse);
});

// Route for handling callbacks from MoMo
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

        // Create the raw signature string
        const rawSignature = `accessKey=${accessKey}&orderId=${orderId}&partnerCode=${partnerCode}&requestId=${orderId}`;

        // Create the HMAC signature
        const signature = crypto
            .createHmac('sha256', secretKey)
            .update(rawSignature)
            .digest('hex');

        // Request body for MoMo API
        const requestBody = {
            partnerCode: partnerCode,
            requestId: orderId,
            orderId: orderId,
            signature: signature,
            lang: 'vi',
        };

        // Axios request options
        const options = {
            method: 'POST',
            url: 'https://test-payment.momo.vn/v2/gateway/api/query',
            headers: {
                'Content-Type': 'application/json',
            },
            data: requestBody,
        };

        // Make the request to MoMo API
        const result = await axios(options);

        // Respond with the result
        return res.status(200).json(result.data);
    } catch (error) {
        console.error('Error checking transaction status:', error.message);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

module.exports = router;

