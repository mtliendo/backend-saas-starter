import {
	AppSyncIdentityCognito,
	Context,
	DynamoDBGetItemRequest,
	util,
} from '@aws-appsync/utils'
import { GetRecipeQueryVariables, Recipe } from '../API'

export function request(
	ctx: Context<GetRecipeQueryVariables>
): DynamoDBGetItemRequest {
	return {
		operation: 'GetItem',
		key: util.dynamodb.toMapValues({ id: ctx.args.id }),
	}
}

export function response(ctx: Context) {
	console.log(
		'the result of the getRecipe',
		JSON.stringify(ctx.result, null, 2)
	)
	const identity = ctx.identity as AppSyncIdentityCognito

	// Check if the recipe belongs to the user
	if (ctx.result.owner !== identity.sub) {
		util.unauthorized()
	}

	return ctx.result as Recipe
}
