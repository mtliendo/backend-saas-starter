import {
	AppSyncIdentityCognito,
	Context,
	DynamoDBGetItemRequest,
	util,
} from '@aws-appsync/utils'
import { GetUserQueryVariables, User } from '../API'

export function request(
	ctx: Context<GetUserQueryVariables>
): DynamoDBGetItemRequest {
	// Get the id of the user from Cognito
	const identity = ctx.identity as AppSyncIdentityCognito

	return {
		operation: 'GetItem',
		key: util.dynamodb.toMapValues({ id: identity.sub }),
	}
}

export function response(ctx: Context) {
	console.log('the result of the getUser', JSON.stringify(ctx.result, null, 2))
	// Check if the recipe belongs to the user
	const identity = ctx.identity as AppSyncIdentityCognito

	if (ctx.result.owner !== identity.sub) {
		util.unauthorized()
	}
	return ctx.result as User
}
