import { util } from '@aws-appsync/utils'
export function request(ctx) {
	let { id, ...values } = ctx.args.input

	return {
		operation: 'PutItem',
		key: util.dynamodb.toMapValues({ id }),
		attributeValues: util.dynamodb.toMapValues({
			__typename: 'Recipe',
			updatedAt: util.time.nowISO8601(),
			...values,
		}),
		condition: {
			expression: 'contains(owner,:expectedOwner)',
			expressionValues: {
				':expectedOwner': JSON.stringify(
					util.dynamodb.toDynamoDB(ctx.identity.sub)
				),
			},
		},
	}
}

export function response(ctx) {
	return ctx.result
}
