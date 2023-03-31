const AWS = require('aws-sdk')

const fetchSecret = async (key) => {
	console.log('the key', key)
	try {
		const result = await new AWS.SSM()
			.getParameter({
				Name: key,
				WithDecryption: true,
			})
			.promise()

		return result.Parameter.Value
	} catch (err) {
		console.log(err)
	}
}

exports.fetchSecret = fetchSecret
