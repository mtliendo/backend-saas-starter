const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient()

async function updateUser(itemData) {
	const params = {
		TableName: process.env.UserTableName,
		Key: { id: itemData.id },
		UpdateExpression:
			'set stripeCustomerId = :val1, subscriptionStatus = :val2, subscriptionPlan = :val3',
		ExpressionAttributeValues: {
			':val1': itemData.stripeCustomerId,
			':val2': itemData.subscriptionStatus,
			':val3': itemData.subscriptionPlan,
		},
	}

	try {
		await docClient.update(params).promise()
	} catch (err) {
		console.log('the err from ddb', err)
		return err
	}
}
exports.updateUser = updateUser
