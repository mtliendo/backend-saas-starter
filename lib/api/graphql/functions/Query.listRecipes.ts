import {
	AppSyncIdentityCognito,
	Context,
	DynamoDBQueryRequest,
	util,
} from '@aws-appsync/utils'
import { Recipe } from '../API'

export function request(ctx: Context): DynamoDBQueryRequest {
	const identity = ctx.identity as AppSyncIdentityCognito

	return {
		operation: 'Query',
		query: {
			expression: '#t = :typename and #o = :owner',
			expressionNames: { '#t': '__typename', '#o': 'owner' },
			expressionValues: util.dynamodb.toMapValues({
				':typename': 'Recipe',
				':owner': identity.sub,
			}),
		},
		index: 'recipe-by-owner',
	}
}

export function response(ctx: Context) {
	const response = ctx.result.items

	return response as [Recipe]
}
