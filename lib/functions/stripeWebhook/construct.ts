import { aws_iam } from 'aws-cdk-lib'
import {
	Code,
	Function,
	FunctionUrlAuthType,
	Runtime,
} from 'aws-cdk-lib/aws-lambda'
import { Construct } from 'constructs'
import path = require('path')
import { envNameContext } from '../../../cdk.context'

type CreateStripeWebhookProps = {
	appName: string
	env: envNameContext
	region: string
	userDBTableName: string
	userDBTableArn: string
	environment: {
		UserTableName: string
		STRIPE_SECRET: string
		STRIPE_WEBHOOK_SECRET: string
	}
}
export const createStripeWebhook = (
	scope: Construct,
	props: CreateStripeWebhookProps
) => {
	const stripeWebhookFunc = new Function(
		scope,
		`${props.appName}-${props.env}-stripe-webhook`,
		{
			functionName: `${props.appName}-${props.env}-stripe-webhook`,
			code: Code.fromAsset(path.join(__dirname, './')),
			handler: 'main.handler',
			runtime: Runtime.NODEJS_16_X,
			environment: {
				UserTableName: props.userDBTableName,
				STRIPE_SECRET: props.environment.STRIPE_SECRET,
				STRIPE_WEBHOOK_SECRET: props.environment.STRIPE_WEBHOOK_SECRET,
			},
		}
	)

	stripeWebhookFunc.addToRolePolicy(
		new aws_iam.PolicyStatement({
			actions: ['ssm:GetParameter'],
			resources: ['arn:aws:ssm:us-east-1:311853295989:*'],
		})
	)

	stripeWebhookFunc.addToRolePolicy(
		new aws_iam.PolicyStatement({
			actions: ['dynamodb:UpdateItem'],
			resources: [props.userDBTableArn],
		})
	)

	const stripeWebhookURL = stripeWebhookFunc.addFunctionUrl({
		authType: FunctionUrlAuthType.NONE,
	})

	return {
		stripeWebhookFunc,
		stripeWebhookURL,
	}
}
