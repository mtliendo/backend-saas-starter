import {
	AppSyncIdentityCognito,
	Context,
	DynamoDBDeleteItemRequest,
	util,
} from '@aws-appsync/utils'
import { DeleteRecipeMutationVariables, Recipe } from '../API'

export function request(
	ctx: Context<DeleteRecipeMutationVariables>
): DynamoDBDeleteItemRequest {
	const identity = ctx.identity as AppSyncIdentityCognito
	return {
		operation: 'DeleteItem',
		key: util.dynamodb.toMapValues({ id: ctx.args.id }),
		// Before we delete the recipe, we need to make sure that the user is the owner of the recipe that they are trying to delete
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
