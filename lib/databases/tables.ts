import { Construct } from 'constructs'
import * as awsDynamodb from 'aws-cdk-lib/aws-dynamodb'
import { RemovalPolicy } from 'aws-cdk-lib'
import { envNameContext } from '../../cdk.context'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import { Function } from 'aws-cdk-lib/aws-lambda'

type BaseTableProps = {
	appName: string
	env: envNameContext
}

type createSaasTableProps = BaseTableProps & {}
export function createSaasTable(
	scope: Construct,
	props: createSaasTableProps
): awsDynamodb.Table {
	const saasTable = new awsDynamodb.Table(scope, 'SaasTable', {
		tableName: `${props.appName}-${props.env}-SaasTable`,
		removalPolicy:
			props.env === 'develop' ? RemovalPolicy.DESTROY : RemovalPolicy.RETAIN,
		billingMode: awsDynamodb.BillingMode.PAY_PER_REQUEST,
		partitionKey: { name: 'id', type: awsDynamodb.AttributeType.STRING },
	})

	return saasTable
}

type CreateUserTableProps = BaseTableProps & {}
export function createUserTable(
	scope: Construct,
	props: CreateUserTableProps
): awsDynamodb.Table {
	const userTable = new awsDynamodb.Table(scope, 'UserTable', {
		tableName: `${props.appName}-${props.env}-UserTable`,
		removalPolicy:
			props.env === 'develop' ? RemovalPolicy.DESTROY : RemovalPolicy.RETAIN,
		billingMode: awsDynamodb.BillingMode.PAY_PER_REQUEST,
		partitionKey: { name: 'id', type: awsDynamodb.AttributeType.STRING },
	})

	return userTable
}
