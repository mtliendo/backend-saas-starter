import {
	AppSyncIdentityCognito,
	Context,
	DynamoDBPutItemRequest,
	util,
} from '@aws-appsync/utils'
import { UpdateUserMutationVariables, User } from '../API'

export function request(
	ctx: Context<UpdateUserMutationVariables>
): DynamoDBPutItemRequest {
	let { id, ...values } = ctx.args.input
	//before we update the user, we need to make sure that the user is the owner of the user that they are trying to update
	const identity = ctx.identity as AppSyncIdentityCognito

	if (id !== identity.sub) {
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

export function response(ctx: Context) {
	return ctx.result as User
}
