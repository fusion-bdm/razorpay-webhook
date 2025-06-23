const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const PUSHLAP_API_KEY = process.env.PUSHLAP_API_KEY;

app.post('/razorpay-webhook', async (req, res) => {
  try {
    const payment = req.body.payload.payment.entity;
    const ref_id = payment.notes?.ref_id || 'unknown';

    await axios.post('https://api.pushlap.com/conversions', {
      ref_id: ref_id,
      amount: payment.amount / 100,
      order_id: payment.id,
      currency: "INR",
      customer_email: payment.email || "not_provided"
    }, {
      headers: {
        Authorization: `Bearer ${PUSHLAP_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    console.log(" Conversion sent for ref_id:", ref_id);
    res.sendStatus(200);
  } catch (error) {
    console.error(" Error:", error.response?.data || error.message);
    res.sendStatus(500);
  }
});

app.get("/", (req, res) => res.send("Webhook is running."));

app.listen(3000, () => console.log("Server running on port 3000"));
