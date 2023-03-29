import { util } from '@aws-appsync/utils'

export function request(ctx) {
	// Get the id of the user from Cognito
	return {
		operation: 'GetItem',
		key: util.dynamodb.toMapValues({ id: ctx.identity.sub }),
	}
}

export function response(ctx) {
	console.log('the result of the getUser', JSON.stringify(ctx.result, null, 2))
	// Check if the recipe belongs to the user

	if (ctx.result.owner !== ctx.identity.sub) {
		util.unauthorized()
	}
	return ctx.result
}
