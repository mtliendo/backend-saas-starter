#!/usr/bin/env node
import { initStack } from './init-stack'
import 'source-map-support/register'
import { BackendSaasStarterStack } from '../lib/backend-saas-starter-stack'

const { app, stackNameWithEnv, stackProps, context } = initStack()

const saasStack = new BackendSaasStarterStack(
	app,
	stackNameWithEnv,
	stackProps,
	context
)
