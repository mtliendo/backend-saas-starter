import { createAddUserFunc } from './functions/addUserPostConfirmation/construct'
import { CDKContext } from '../cdk.context'
import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { createSaasTable, createUserTable } from './databases/tables'
import { createSaasAuth } from './cognito/auth'
import { createSaasPicsBucket } from './s3/saasPics'
import { createStripeWebhook } from './functions/stripeWebhook/construct'
import { createSaaSAPI } from './api/appsync'
import { CfnOutput } from 'aws-cdk-lib'

export class BackendSaasStarterStack extends cdk.Stack {
	constructor(
		scope: Construct,
		id: string,
		props: cdk.StackProps,
		context: CDKContext
	) {
		super(scope, id, props)

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
				STRIPE_SECRET: `stripe-secret-${context.environment}`,
				STRIPE_WEBHOOK_SECRET: `stripe-webhook-secret-${context.environment}`,
				UserTableName: userDB.tableName,
			},
			region: context.region,
			userDBTableArn: userDB.tableArn,
			userDBTableName: userDB.tableName,
		})

		const cognitoAuth = createSaasAuth(this, {
			appName: context.appName,
			env: context.environment,
			addUserPostConfirmation: addUserFunc,
		})

		const saasAPI = createSaaSAPI(this, {
			appName: context.appName,
			env: context.environment,
			saasDB,
			userDB,
			userpool: cognitoAuth.userPool,
			unauthenticatedRole: cognitoAuth.identityPool.unauthenticatedRole,
		})

		const saasPicsBucket = createSaasPicsBucket(this, {
			appName: context.appName,
			env: context.environment,
			allowedOrigins: context.s3AllowedOrigins,
			authenticatedRole: cognitoAuth.identityPool.authenticatedRole,
		})

		new CfnOutput(this, 'saasPicsBucketName', {
			value: saasPicsBucket.fileStorageBucket.bucketName,
		})

		new CfnOutput(this, 'cloudfrontURL', {
			value: saasPicsBucket.fileStorageBucketCFDistribution.domainName,
		})

		new CfnOutput(this, 'stripeWebhookURL', {
			value: stripeWebhook.stripeWebhookURL.url,
		})

		new CfnOutput(this, 'cognitoUserPoolId', {
			value: cognitoAuth.userPool.userPoolId,
		})
		new CfnOutput(this, 'idenititypoolId', {
			value: cognitoAuth.identityPool.identityPoolId,
		})

		new CfnOutput(this, 'cognitoUserPoolClientId', {
			value: cognitoAuth.userPoolClient.userPoolClientId,
		})

		new CfnOutput(this, 'region', {
			value: context.region,
		})

		new CfnOutput(this, 'AppSyncURL', {
			value: saasAPI.graphqlUrl,
		})
	}
}
