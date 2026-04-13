const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const db = require('../db');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/create-session', auth, async (req, res) => {
  const { type } = req.body; // 'one-time' or 'monthly'
  const priceId = type === 'one-time' ? process.env.ONE_TIME_PRICE_ID : process.env.MONTHLY_PRICE_ID;
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card', 'ideal'],
    line_items: [{
      price: priceId,
      quantity: 1,
    }],
    mode: type === 'one-time' ? 'payment' : 'subscription',
    success_url: `${process.env.CLIENT_URL}/dashboard?success=true`,
    cancel_url: `${process.env.CLIENT_URL}/payment`,
    client_reference_id: req.user.id,
  });
  res.json({ url: session.url });
});

// Webhook to handle payment success
router.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.client_reference_id;
    const mode = session.mode;
    if (mode === 'payment') {
      db.run('UPDATE users SET subscription_status = ? WHERE id = ?', ['premium', userId]);
    } else if (mode === 'subscription') {
      const endDate = new Date(session.current_period_end * 1000).toISOString().split('T')[0];
      db.run('UPDATE users SET subscription_status = ?, subscription_end_date = ? WHERE id = ?', ['premium', endDate, userId]);
    }
  }
  res.json({ received: true });
});

module.exports = router;