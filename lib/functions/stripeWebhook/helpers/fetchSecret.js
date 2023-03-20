const AWS = require('aws-sdk')

const fetchSecret = async (key) => {
	try {
		const { Parameters } = await new AWS.SSM()
			.getParameters({
				Names: [key].map((secretName) => process.env[secretName]),
				WithDecryption: true,
			})
			.promise()

		return Parameters[0].Value
	} catch (e) {
		console.log('uh-oh', e)
	}
}
exports.fetchSecret = fetchSecret
