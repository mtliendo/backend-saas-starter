import { CDKContext } from '../cdk.context'
import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { createSaasTable, createUserTable } from './databases/tables'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import path = require('path')
import { Runtime } from 'aws-cdk-lib/aws-lambda'
import { createSaasUserpool } from './cognito/auth'
import { createSaasPicsBucket } from './s3/saasPics'

export class BackendSaasStarterStack extends cdk.Stack {
	constructor(
		scope: Construct,
		id: string,
		props: cdk.StackProps,
		context: CDKContext
	) {
		super(scope, id, props)
		// our code will go here
		const addUserFunc = new NodejsFunction(this, 'addUserFunc', {
			functionName: `${context.appName}-${context.environment}-addUserFunc`,
			runtime: Runtime.NODEJS_16_X,
			handler: 'handler',
			entry: path.join(__dirname, `./functions/addUser/main.ts`),
		})

		const cognitoAuth = createSaasUserpool(this, {
			appName: context.appName,
			env: context.environment,
			addUserPostConfirmation: addUserFunc,
		})

		const saasDB = createSaasTable(this, {
			appName: context.appName,
			env: context.environment,
		})

		const userDB = createUserTable(this, {
			appName: context.appName,
			env: context.environment,
			addUserFunc,
		})

		const saasPicsBucket = createSaasPicsBucket(this, {
			appName: context.appName,
			env: context.environment,
			allowedOrigins: context.s3AllowedOrigins,
			authenticatedRole: cognitoAuth.identityPool.authenticatedRole,
		})
	}
}
