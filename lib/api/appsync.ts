import { envNameContext } from './../../cdk.context.d'
import { Construct } from 'constructs'
import * as awsAppsync from 'aws-cdk-lib/aws-appsync'
import * as path from 'path'
import { UserPool } from 'aws-cdk-lib/aws-cognito'
import { Table } from 'aws-cdk-lib/aws-dynamodb'
import { IRole } from 'aws-cdk-lib/aws-iam'

type AppSyncAPIProps = {
	appName: string
	env: envNameContext
	unauthenticatedRole: IRole
	userpool: UserPool
	saasDB: Table
	userDB: Table
}

export function createSaaSAPI(scope: Construct, props: AppSyncAPIProps) {
	const api = new awsAppsync.GraphqlApi(scope, 'RecipeAPI', {
		name: `${props.appName}-${props.env}-RecipeAPI`,
		schema: awsAppsync.SchemaFile.fromAsset(
			path.join(__dirname, './graphql/schema.graphql')
		),
		authorizationConfig: {
			defaultAuthorization: {
				authorizationType: awsAppsync.AuthorizationType.USER_POOL,
				userPoolConfig: {
					userPool: props.userpool,
				},
			},
			additionalAuthorizationModes: [
				{ authorizationType: awsAppsync.AuthorizationType.IAM },
			],
		},
		logConfig: {
			fieldLogLevel: awsAppsync.FieldLogLevel.ALL,
		},
	})

	api.grantQuery(props.unauthenticatedRole, 'getRecipe', 'listRecipes')

	const RecipeDataSource = api.addDynamoDbDataSource(
		`${props.appName}-${props.env}-RecipeDataSource`,
		props.saasDB
	)
	const UserDataSource = api.addDynamoDbDataSource(
		`${props.appName}-${props.env}-UserDataSource`,
		props.userDB
	)

	const createRecipeFunction = new awsAppsync.AppsyncFunction(
		scope,
		'createRecipeFunction',
		{
			name: 'createRecipeFunction',
			api,
			dataSource: RecipeDataSource,
			runtime: awsAppsync.FunctionRuntime.JS_1_0_0,
			code: awsAppsync.Code.fromAsset(
				path.join(__dirname, 'graphql/functions/Mutation.createRecipe.js')
			),
		}
	)
	const getUserFunction = new awsAppsync.AppsyncFunction(
		scope,
		'getUserFunction',
		{
			name: 'getUserFunction',
			api,
			dataSource: UserDataSource,
			runtime: awsAppsync.FunctionRuntime.JS_1_0_0,
			code: awsAppsync.Code.fromAsset(
				path.join(__dirname, 'graphql/functions/Query.getUser.js')
			),
		}
	)

	const getRecipeFunction = new awsAppsync.AppsyncFunction(
		scope,
		'getRecipeFunction',
		{
			name: 'getRecipeFunction',
			api,
			dataSource: RecipeDataSource,
			runtime: awsAppsync.FunctionRuntime.JS_1_0_0,
			code: awsAppsync.Code.fromAsset(
				path.join(__dirname, 'graphql/functions/Query.getRecipe.js')
			),
		}
	)

	const updateRecipeFunction = new awsAppsync.AppsyncFunction(
		scope,
		'updateRecipeFunction',
		{
			name: 'updateRecipeFunction',
			api,
			dataSource: RecipeDataSource,
			runtime: awsAppsync.FunctionRuntime.JS_1_0_0,
			code: awsAppsync.Code.fromAsset(
				path.join(__dirname, 'graphql/functions/Mutation.updateRecipe.js')
			),
		}
	)

	const deleteRecipeFunction = new awsAppsync.AppsyncFunction(
		scope,
		'deleteRecipeFunction',
		{
			name: 'deleteRecipeFunction',
			api,
			dataSource: RecipeDataSource,
			runtime: awsAppsync.FunctionRuntime.JS_1_0_0,
			code: awsAppsync.Code.fromAsset(
				path.join(__dirname, 'graphql/functions/Mutation.deleteRecipe.js')
			),
		}
	)

	const listRecipesFunction = new awsAppsync.AppsyncFunction(
		scope,
		'listRecipesFunction',
		{
			name: 'listRecipesFunction',
			api,
			dataSource: RecipeDataSource,
			runtime: awsAppsync.FunctionRuntime.JS_1_0_0,
			code: awsAppsync.Code.fromAsset(
				path.join(__dirname, 'graphql/functions/Query.listRecipes.js')
			),
		}
	)

	const updateUserFunction = new awsAppsync.AppsyncFunction(
		scope,
		'updateUserFunction',
		{
			name: 'updateUserFunction',
			api,
			dataSource: RecipeDataSource,
			runtime: awsAppsync.FunctionRuntime.JS_1_0_0,
			code: awsAppsync.Code.fromAsset(
				path.join(__dirname, 'graphql/functions/Mutation.updateUser.js')
			),
		}
	)

	new awsAppsync.Resolver(scope, 'updateUserPipelineResolver', {
		api,
		typeName: 'Mutation',
		fieldName: 'updateUser',
		code: awsAppsync.Code.fromAsset(
			path.join(__dirname, 'graphql/functions/passThrough.js')
		),
		runtime: awsAppsync.FunctionRuntime.JS_1_0_0,
		pipelineConfig: [updateUserFunction],
	})
	new awsAppsync.Resolver(scope, 'createRecipePipelineResolver', {
		api,
		typeName: 'Mutation',
		fieldName: 'createRecipe',
		code: awsAppsync.Code.fromAsset(
			path.join(__dirname, 'graphql/functions/passThrough.js')
		),
		runtime: awsAppsync.FunctionRuntime.JS_1_0_0,
		pipelineConfig: [createRecipeFunction],
	})

	new awsAppsync.Resolver(scope, 'getUserPipelineResolver', {
		api,
		typeName: 'Query',
		fieldName: 'getUser',
		code: awsAppsync.Code.fromAsset(
			path.join(__dirname, 'graphql/functions/passThrough.js')
		),
		runtime: awsAppsync.FunctionRuntime.JS_1_0_0,
		pipelineConfig: [getUserFunction],
	})

	new awsAppsync.Resolver(scope, 'getRecipePipelineResolver', {
		api,
		typeName: 'Query',
		fieldName: 'getRecipe',
		code: awsAppsync.Code.fromAsset(
			path.join(__dirname, 'graphql/functions/passThrough.js')
		),
		runtime: awsAppsync.FunctionRuntime.JS_1_0_0,
		pipelineConfig: [getRecipeFunction],
	})

	new awsAppsync.Resolver(scope, 'updateRecipePipelineResolver', {
		api,
		typeName: 'Mutation',
		fieldName: 'updateRecipe',
		code: awsAppsync.Code.fromAsset(
			path.join(__dirname, 'graphql/functions/passThrough.js')
		),
		runtime: awsAppsync.FunctionRuntime.JS_1_0_0,
		pipelineConfig: [updateRecipeFunction],
	})

	new awsAppsync.Resolver(scope, 'deleteRecipePipelineResolver', {
		api,
		typeName: 'Mutation',
		fieldName: 'deleteRecipe',
		code: awsAppsync.Code.fromAsset(
			path.join(__dirname, 'graphql/functions/passThrough.js')
		),
		runtime: awsAppsync.FunctionRuntime.JS_1_0_0,
		pipelineConfig: [deleteRecipeFunction],
	})

	new awsAppsync.Resolver(scope, 'listRecipesPipelineResolver', {
		api,
		typeName: 'Query',
		fieldName: 'listRecipes',
		code: awsAppsync.Code.fromAsset(
			path.join(__dirname, 'graphql/functions/passThrough.js')
		),
		runtime: awsAppsync.FunctionRuntime.JS_1_0_0,
		pipelineConfig: [listRecipesFunction],
	})

	return api
}
