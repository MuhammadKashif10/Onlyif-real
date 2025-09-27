// routes/paymentRoutes.js
const express = require('express');
const Stripe = require('stripe');
const Purchase = require('../models/Purchase');
const Property = require('../models/Property');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create checkout session
router.post('/checkout/:propertyId', authMiddleware, async (req, res) => {
  console.log(process.env.STRIPE_WEBHOOK_SECRET,`++++++`)

  try {
    const { propertyId } = req.params;
    console.log("🚀 ~ propertyId:", propertyId)
    console.log("🚀 ~ user:",  req.user._id)
    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
// Prevent duplicate purchase for same property
// let existing = await Purchase.findOne({ user: req.user._id, property: propertyId });
// console.log("🚀 ~ existing:", existing)

// if (existing) {
//   if (existing.status === 'paid') {
//     return res.json({ alreadyPaid: true });
//   }
//   if (existing.status === 'pending') {
//     // User already has a pending session → return that session instead of creating a new one
//     return res.json({ url: `https://checkout.stripe.com/pay/${existing.paymentIntentId}` });
//   }
// }

    // Prevent duplicate purchase
    let existing = await Purchase.findOne({ user: req.user._id, property: propertyId, status: 'paid' });
    if (existing) {
      return res.json({ alreadyPaid: true });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
  {
    price_data: {
      currency: 'aud', // Australian Dollars
      unit_amount: 4900, // 49 AUD (amount in cents)
      product_data: {
        name: `Access property: ${property.title}`
      }
    },
    quantity: 1
  }
],

      // line_items: [
      //   {
      //     price_data: {
      //       currency: 'usd',
      //       unit_amount: 4900, // $49
      //       product_data: {
      //         name: `Access property: ${property.title}`
      //       }
      //     },
      //     quantity: 1
      //   }
      // ],
      success_url: `${process.env.FRONTEND_URL}/property/${propertyId}`,
      cancel_url: `${process.env.FRONTEND_URL}/property/${propertyId}?canceled=true`,
      metadata: {
        userId: req.user._id.toString(),
        propertyId: propertyId
      }
    });
// Save or update pending purchase
await Purchase.findOneAndUpdate(
  { user: req.user._id, property: propertyId },
  {
    user: req.user._id,
    property: propertyId,
    paymentIntentId: session.id,
    amount: 4900,
    status: 'paid'
  },
  { upsert: true, new: true }
);



    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating checkout session' });
  }
});
router.get('/purchases/:propertyId', authMiddleware, async (req, res) => {
  try {
    const { propertyId } = req.params;

    // Find ALL purchases for this property
    const purchases = await Purchase.find({
      property: propertyId,
      status: 'paid', // only return paid buyers (optional)
    })
    .populate('user', 'name email'); // populate user info

    if (!purchases || purchases.length === 0) {
      return res.status(404).json({ message: 'No purchases found for this property' });
    }



    res.json(purchases);
  } catch (err) {
    console.error('Error fetching purchases:', err);
    res.status(500).json({ message: 'Server error fetching purchase details' });
  }
});

module.exports = router;