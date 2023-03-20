const { updateUser } = require('./updateUser')

async function createCustomerMapping(
	stripe,
	stripeEvent,
	userSub,
	stripeCustomerId,
	subscription,
	customerSubPlan
) {
	//Associate a customer in Stripe with their User ID from our DB.
	try {
		await stripe.customers.update(stripeEvent.data.object.customer, {
			metadata: { userDBId: userSub },
		})
	} catch (e) {
		console.log('error adding metadata to customer', e)
	}

	// The opposite as above. Update a User in our DB with their Stripe Customer ID
	try {
		const data = {
			id: userSub,
			stripeCustomerId,
			subscriptionStatus: subscription.status,
			subscriptionPlan: customerSubPlan,
		}
		await updateUser(data)
		console.log('successfully created item')
	} catch (err) {
		console.log('error updating user to ddb')
		return { error: err }
	}
}

exports.createCustomerMapping = createCustomerMapping
