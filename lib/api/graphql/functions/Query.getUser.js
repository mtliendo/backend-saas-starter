import { util } from '@aws-appsync/utils'

export function request(ctx) {
	// Get the id of the user from Cognito
	return {
		operation: 'GetItem',
		key: util.dynamodb.toMapValues({ id: ctx.identity.sub }),
	}
}

export function response(ctx) {
	return ctx.result
}
