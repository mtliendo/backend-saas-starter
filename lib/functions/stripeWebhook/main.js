const Stripe = require('stripe')
const { cancelUserSubscription } = require('./helpers/cancelUserSubscription')
const { fetchSecret } = require('./helpers/fetchSecret')
const { updateUser } = require('./helpers/updateUser')
const { verifyWebhookSig } = require('./helpers/verifyWebhookSig')
const { createCustomerMapping } = require('./helpers/createCustomerMapping')

let STRIPE_SECRET
let STRIPE_WEBHOOK_SECRET

exports.handler = async (event) => {
	// Check if the Lambda has cached keys
	if (!STRIPE_SECRET || !STRIPE_WEBHOOK_SECRET) {
		STRIPE_SECRET = await fetchSecret(process.env.STRIPE_SECRET)
		STRIPE_WEBHOOK_SECRET = await fetchSecret(process.env.STRIPE_WEBHOOK_SECRET)
	}
	const stripe = Stripe(STRIPE_SECRET)

	let stripeEvent = verifyWebhookSig(
		STRIPE_SECRET,
		event,
		STRIPE_WEBHOOK_SECRET
	)

	switch (stripeEvent.type) {
		case 'checkout.session.completed':
			// clientReferenceId = <dbID>__<username>
			const clientReferenceId = stripeEvent.data.object.client_reference_id
			const userSub = clientReferenceId.split('__')[0]
			const subscriptionId = stripeEvent.data.object.subscription
			const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
				expand: ['items.data.price.product'],
			})
			const customerSubPlan =
				subscription.items.data[0].price.product.metadata.fieldName
			const stripeCustomerId = stripeEvent.data.object.customer

			//Associate a customer in Stripe with their User ID from our DB and vice-versa
			await createCustomerMapping(
				stripe,
				stripeEvent,
				userSub,
				stripeCustomerId,
				subscription,
				customerSubPlan
			)

			console.log('done provisioning new subscriber, congrats btw!')
			return 'completed'
		case 'customer.subscription.updated':
			// fetch the full subscription
			const subscriptionIdUpdate = stripeEvent.data.object.id
			const subscriptionUpdate = await stripe.subscriptions
				.retrieve(subscriptionIdUpdate, {
					expand: ['items.data.price.product', 'customer'],
				})
				.catch((e) => console.log('uh oh error', e))

			try {
				const data = {
					id: subscriptionUpdate.customer.metadata.userDBId,
					stripeCustomerId: stripeEvent.data.object.customer,
					subscriptionStatus: stripeEvent.data.object.status,
					subscriptionPlan:
						subscriptionUpdate.items.data[0].price.product.metadata.fieldName,
				}
				console.log('the data sent to update the user in the db', data)
				await updateUser(data)
			} catch (err) {
				console.log('error updating user to ddb')
				return { error: err }
			}

			return 'updated'
		case 'customer.subscription.deleted':
			//If a customer deletes their subscription, it'll keep going until the end of their billing cycle
			// Once the billing cycle ends, this webhook is fired. Now is when I update their status to cancelled
			const customerId = stripeEvent.data.object.customer
			const customer = await stripe.customers.retrieve(customerId)

			// https://stripe.com/docs/api/customers/retrieve?lang=node
			const userId = customer.metadata.userDBId // this value is first set in checkout.session.completed
			try {
				const data = {
					id: userId,
					subscriptionStatus: 'canceled',
				}

				await cancelUserSubscription(data)
			} catch (err) {
				console.log('error updating user in ddb for cancel', err)
				return { error: err }
			}
			return 'deleted'
		default:
			console.log(`Unhandled event type ${stripeEvent.type}`)
	}

	return 'webhook finished'
}
