import { createAddUserFunc } from './functions/addUserPostConfirmation/construct'
import { CDKContext } from '../cdk.context'
import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { createSaasTable, createUserTable } from './databases/tables'
import { createSaasUserpool } from './cognito/auth'
import { createSaasPicsBucket } from './s3/saasPics'
import { createStripeWebhook } from './functions/stripeWebhook/construct'

export class BackendSaasStarterStack extends cdk.Stack {
	constructor(
		scope: Construct,
		id: string,
		props: cdk.StackProps,
		context: CDKContext
	) {
		super(scope, id, props)
		// our code will go here

		const userDB = createUserTable(this, {
			appName: context.appName,
			env: context.environment,
		})
		const saasDB = createSaasTable(this, {
			appName: context.appName,
			env: context.environment,
		})

		const addUserFunc = createAddUserFunc(this, {
			appName: context.appName,
			env: context.environment,
			environmentVars: {
				userDBTableName: userDB.tableName,
			},
			userDBARN: userDB.tableArn,
		})

		const stripeWebhook = createStripeWebhook(this, {
			appName: context.appName,
			env: context.environment,
			environment: {
				STRIPE_SECRET: `/saas/stripe-secret-${context.environment}`,
				STRIPE_WEBHOOK_SECRET: `/saas/stripe-webhook-secret-${context.environment}`,
				UserTableName: userDB.tableName,
			},
			region: context.region,
			userDBTableArn: userDB.tableArn,
			userDBTableName: userDB.tableName,
		})

		const cognitoAuth = createSaasUserpool(this, {
			appName: context.appName,
			env: context.environment,
			addUserPostConfirmation: addUserFunc,
		})

		const saasPicsBucket = createSaasPicsBucket(this, {
			appName: context.appName,
			env: context.environment,
			allowedOrigins: context.s3AllowedOrigins,
			authenticatedRole: cognitoAuth.identityPool.authenticatedRole,
		})
	}
}
