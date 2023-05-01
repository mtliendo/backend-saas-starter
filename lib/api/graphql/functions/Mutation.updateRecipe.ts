import {
	AppSyncIdentityCognito,
	Context,
	DynamoDBPutItemRequest,
	util,
} from '@aws-appsync/utils'
import { Recipe, UpdateRecipeMutationVariables } from '../API'

export function request(
	ctx: Context<UpdateRecipeMutationVariables>
): DynamoDBPutItemRequest {
	const { id, ...values } = ctx.args.input
	const identity = ctx.identity as AppSyncIdentityCognito

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
					util.dynamodb.toDynamoDB(identity.sub)
				),
			},
		},
	}
}

export function response(ctx: Context) {
	return ctx.result as Recipe
}
