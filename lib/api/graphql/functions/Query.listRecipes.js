// This can't be a scan, it has to be a GSI of __typename::userId
import { util } from '@aws-appsync/utils'

export function request(ctx) {
	return {
		operation: 'Query',
		query: {
			// "Give me all the recipes where the __typename is Recipe and the id is the id of the user"
			expression: '#t = :typename and #i = :id',
			expressionNames: { '#t': '__typename', '#i': 'id' },
			expressionValues: util.dynamodb.toMapValues({
				':typename': 'Recipe',
				':id': ctx.identity.sub,
			}),
		},
		index: 'typename-id-index',
	}
}

export function response(ctx) {
	const response = ctx.result.items

	return response
}
