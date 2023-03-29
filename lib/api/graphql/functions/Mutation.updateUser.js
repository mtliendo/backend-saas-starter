import { util } from '@aws-appsync/utils'
export function request(ctx) {
	let { id, ...values } = ctx.args.input
	//before we update the user, we need to make sure that the user is the owner of the user that they are trying to update

	if (id !== ctx.identity.sub) {
		util.unauthorized()
	}
	return {
		operation: 'PutItem',
		key: util.dynamodb.toMapValues({ id }),
		attributeValues: util.dynamodb.toMapValues({
			__typename: 'User',
			updatedAt: util.time.nowISO8601(),
			...values,
		}),
	}
}

export function response(ctx) {
	return ctx.result
}
