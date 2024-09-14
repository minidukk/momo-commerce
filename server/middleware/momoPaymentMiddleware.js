const axios = require('axios');
const crypto = require('crypto');
const dotenv = require('dotenv');

dotenv.config()

const momoPaymentMiddleware = async (req, res, next) => {
    try {
        // Get amount from request body
        const { amount } = req.body;
        if (!amount || isNaN(amount)) {
            return res.status(400).json({ error: 'Invalid or missing amount' });
        }

        // MoMo parameters
        const accessKey = 'F8BBA842ECF85';
        const secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
        const orderInfo = 'pay with MoMo';
        const partnerCode = 'MOMO';
        const redirectUrl = 'http://localhost:5173/payment';
        const ipnUrl = `${process.env.NGROK}/api/momo/callback`;
        const requestType = 'payWithMethod';
        const orderId = partnerCode + new Date().getTime();
        const requestId = orderId;
        const extraData = '';
        const autoCapture = true;
        const lang = 'vi';

        // Create raw signature
        const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
        console.log("--------------------RAW SIGNATURE----------------");
        console.log(rawSignature);

        // Generate signature
        const signature = crypto.createHmac('sha256', secretKey)
            .update(rawSignature)
            .digest('hex');
        console.log("--------------------SIGNATURE----------------");
        console.log(signature);

        // Create request body
        const requestBody = JSON.stringify({
            partnerCode,
            partnerName: "Test",
            storeId: "MomoTestStore",
            requestId,
            amount,
            orderId,
            orderInfo,
            redirectUrl,
            ipnUrl,
            lang,
            requestType,
            autoCapture,
            extraData,
            orderGroupId: '',
            signature
        });

        // Axios options
        const options = {
            method: 'POST',
            url: 'https://test-payment.momo.vn/v2/gateway/api/create',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(requestBody),
            },
            data: requestBody
        };

        // Send request to MoMo
        const result = await axios(options);
        req.momoResponse = result.data; // Attach the result to the request object
        next();
    } catch (error) {
        console.error('Error processing MoMo payment:', error);
        res.status(500).json({
            statusCode: 500,
            message: 'Server error processing MoMo payment'
        });
    }
};

module.exports = momoPaymentMiddleware;
