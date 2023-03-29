import { util } from '@aws-appsync/utils'

export function request(ctx) {
	return {
		operation: 'GetItem',
		key: util.dynamodb.toMapValues({ id: ctx.args.id }),
	}
}

export function response(ctx) {
	console.log(
		'the result of the getRecipe',
		JSON.stringify(ctx.result, null, 2)
	)

	// Check if the recipe belongs to the user
	if (ctx.result.owner !== ctx.identity.sub) {
		util.unauthorized()
	}
	return ctx.result
}
