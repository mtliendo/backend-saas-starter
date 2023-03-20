const Stripe = require('stripe')

const verifyWebhookSig = (STRIPE_SECRET, event, STRIPE_WEBHOOK_SECRET) => {
	const stripe = Stripe(STRIPE_SECRET)
	const sig = event.headers['stripe-signature']

	try {
		const stripeEvent = stripe.webhooks.constructEvent(
			event.body,
			sig,
			STRIPE_WEBHOOK_SECRET
		)
		return stripeEvent
	} catch (err) {
		console.log('uh oh', err)
		return { 'problem occurred': err }
	}
}

exports.verifyWebhookSig = verifyWebhookSig
