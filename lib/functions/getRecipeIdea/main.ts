import { Configuration, OpenAIApi } from 'openai'
// This belongs to the getRecipeIdea function. This will
// use OpenAI to create a receipe idea. For structure,
// I should provide the fields that need to be accepted.
// The response should be formatted as json.
exports.handler = async (event: any) => {
	const configuration = new Configuration({
		apiKey: process.env.OPENAI_API_KEY,
	})
	const openai = new OpenAIApi(configuration)

	const response = await openai.createCompletion({
		model: 'text-davinci-003',
		prompt:
			'Create a recipe for dinner that includes eggs, cheese, and tomato sauce. The recipe should contain 3 servings. Your generated output should be as JSON with the following format:\n```js\n{\n\ttitle: String\n\tdescription: String\n\tservings: Int\n\tingredientsText: String\n\tstepsText: String\n}```\n\nWhere "title" is the title of the recipe. "description" is a paragraph long description of the recipe. "servings" is the amount of servings provided by the user. "ingredientsText" is an array of strings where each string is the ingredient and the amount. Finally, "stepsText" is an array of strings where each string is an instruction to prepare the recipe.\n\n\n{\n\ttitle: "Eggs, Cheese, and Tomato Sauce Bake",\n\tdescription: "This dish is a delicious and easy way to make a great dinner using eggs, cheese, and tomato sauce. It\'s perfect for a weeknight meal and can be ready in 30 minutes or less.",\n\tservings: 3,\n\tingredientsText: ["8 eggs", "1/2 cup of cheese, grated", "1 cup of tomato sauce"],\n\tstepsText: [\n\t\t"Preheat the oven to 350 degrees F.",\n\t\t"In a medium bowl, whisk together the eggs, cheese, and tomato sauce until combined.",\n\t\t"Pour the mixture into a greased 9x13 baking dish.",\n\t\t"Bake for 25-30 minutes or until the eggs are set.",\n\t\t"Serve warm."\n\t]\n}',
		temperature: 0.7,
		max_tokens: 438,
		top_p: 1,
		frequency_penalty: 0,
		presence_penalty: 0,
	})
}
