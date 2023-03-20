const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient()

async function cancelUserSubscription(itemData) {
	const params = {
		TableName: process.env.UserTableName,
		Key: { id: itemData.id },
		UpdateExpression: 'set subscriptionStatus = :val1',
		ExpressionAttributeValues: {
			':val1': itemData.subscriptionStatus,
		},
	}
	try {
		await docClient.update(params).promise()
	} catch (err) {
		return err
	}
}
exports.cancelUserSubscription = cancelUserSubscription
