import * as aws_iam from 'aws-cdk-lib/aws-iam'
import { Runtime } from 'aws-cdk-lib/aws-lambda'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import { Construct } from 'constructs'
import path = require('path')
import { envNameContext } from '../../../cdk.context'

// I wrote this on the train and havent tested this yet.
type CreateAddUserFuncProps = {
	saasDBARN: string
	appName: string
	env: envNameContext
	environmentVars: {
		saasDBTableName: string
	}
}
export const createRecipeIdeaFunc = (
	scope: Construct,
	props: CreateAddUserFuncProps
) => {
	const getRecipeIdea = new NodejsFunction(
		scope,
		`${props.appName}-${props.env}-getRecipeIdea`,
		{
			functionName: `${props.appName}-${props.env}-getRecipeIdea`,
			runtime: Runtime.NODEJS_16_X,
			handler: 'handler',
			entry: path.join(__dirname, `./main.ts`),
			environment: {
				SaaSTableName: props.environmentVars.saasDBTableName,
			},
		}
	)

	getRecipeIdea.addToRolePolicy(
		new aws_iam.PolicyStatement({
			actions: ['dynamodb:PutItem'],
			resources: [props.saasDBARN],
		})
	)
	return getRecipeIdea
}
