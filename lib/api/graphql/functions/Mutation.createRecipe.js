import { util } from '@aws-appsync/utils'
export function request(ctx) {
	let values = ctx.args.input
	let id = util.autoId()

	// no auth needed for this mutation since they have to be signed in to create a recipe

	return {
		operation: 'PutItem',
		key: util.dynamodb.toMapValues({ id }),
		attributeValues: util.dynamodb.toMapValues({
			__typename: 'Recipe',
			owner: ctx.identity.sub, // used for authorization
			createdAt: util.time.nowISO8601(),
			updatedAt: util.time.nowISO8601(),
			...values,
		}),
	}
}

export function response(ctx) {
	return ctx.result
}
