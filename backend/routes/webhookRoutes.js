const express = require('express');
const Stripe = require('stripe');
const Purchase = require('../models/Purchase');

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post('/', async (req, res) => {
  const sig = req.headers['stripe-signature'];
console.log(req.body,"+++++++++++++++")
console.log(process.env.STRIPE_WEBHOOK_SECRET)
  try {
    // req.body is a Buffer here 👇
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;

      const userId = session.metadata.userId;
      const propertyId = session.metadata.propertyId;

      await Purchase.findOneAndUpdate(
        { user: userId, property: propertyId },
        {
          status: 'paid',
          checkoutSessionId: session.id,
          paymentIntentId: session.payment_intent
        },
        { new: true }
      );

      console.log(`✅ Purchase marked as paid for user ${userId}, property ${propertyId}`);
    }

    res.json({ received: true });
  } catch (err) {
    console.error('❌ Webhook error:', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

module.exports = router;

// // routes/webhookRoutes.js
// const express = require('express');
// const Stripe = require('stripe');
// const Purchase = require('../models/Purchase');

// const router = express.Router();
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// router.post('/', express.raw({ type: 'application/json' }), async (req, res) => {
//   const sig = req.headers['stripe-signature'];
// console.log(req.body,"+++++++++++++++")
//   try {
//     const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);

//     if (event.type === 'checkout.session.completed') {
//       const session = event.data.object;

//       const userId = session.metadata.userId;
//       console.log("🚀 ~ userId:", userId)
//       const propertyId = session.metadata.propertyId;
//       console.log("🚀 ~ propertyId:", propertyId)

//       await Purchase.findOneAndUpdate(
//         { user: userId, property: propertyId },
//         {
//           status: 'paid',
//           paymentIntentId: session.payment_intent, // store real payment intent ID
//         },
//         { new: true }
//       );

//       console.log(`✅ Purchase marked as paid for user ${userId}, property ${propertyId}`);
//     }

//     res.send();
//   } catch (err) {
//     console.error('❌ Webhook error:', err.message);
//     res.status(400).send(`Webhook Error: ${err.message}`);
//   }
// });

// module.exports = router;

// // routes/webhookRoutes.js
// const express = require('express');
// const Stripe = require('stripe');
// const Purchase = require('../models/Purchase');

// const router = express.Router();
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// router.post('/stripe-webhook', express.raw({ type: 'application/json' }), async (req, res) => {
//   const sig = req.headers['stripe-signature'];

//   try {
//     const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);

//     if (event.type === 'checkout.session.completed') {
//       const session = event.data.object;

//       await Purchase.findOneAndUpdate(
//         { paymentIntentId: session.id },
//         { status: 'paid' },
//         { new: true }
//       );
//     }

//     res.send();
//   } catch (err) {
//     console.error(err);
//     res.status(400).send(`Webhook Error: ${err.message}`);
//   }
// });

// module.exports = router;