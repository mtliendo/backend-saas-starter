/* eslint-disable */
import { build } from 'esbuild'
import glob from 'glob'
const files = await glob('lib/api/graphql/functions/**/*.ts')

console.log(files)

await build({
	sourcemap: 'inline',
	sourcesContent: false,
	format: 'esm',
	target: 'esnext',
	platform: 'node',
	external: ['@aws-appsync/utils'],
	outdir: 'lib/api/graphql/functions',
	entryPoints: files,
	bundle: true,
})
