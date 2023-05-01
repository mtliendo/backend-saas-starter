import { CreateRecipeMutationVariables, Recipe } from './../API'

import {
	util,
	DynamoDBPutItemRequest,
	Context,
	AppSyncIdentityCognito,
} from '@aws-appsync/utils'

export function request(
	ctx: Context<CreateRecipeMutationVariables>
): DynamoDBPutItemRequest {
	let values = ctx.args.input
	let id = util.autoId()

	//* no auth check needed due to
	//* @aws_cognito_user_pools on schema 😎

	return {
		operation: 'PutItem',
		key: util.dynamodb.toMapValues({ id }),
		attributeValues: util.dynamodb.toMapValues({
			__typename: 'Recipe',
			owner: (ctx.identity as AppSyncIdentityCognito).sub,
			createdAt: util.time.nowISO8601(),
			updatedAt: util.time.nowISO8601(),
			...values,
		}),
	}
}

export function response(ctx: Context) {
	return ctx.result as Recipe
}
