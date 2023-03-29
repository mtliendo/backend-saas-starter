import { util } from '@aws-appsync/utils'

export function request(ctx) {
	return {
		operation: 'DeleteItem',
		key: util.dynamodb.toMapValues({ id: ctx.args.id }),
		// Before we delete the recipe, we need to make sure that the user is the owner of the recipe that they are trying to delete
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
