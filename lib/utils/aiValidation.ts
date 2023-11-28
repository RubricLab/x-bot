import OpenAI from 'openai'
import {aiValidator} from '~/constants/validation'
import env from '~/env.mjs'

const openai = new OpenAI({apiKey: env.OPENAI_API_KEY})

export default async function aiValidation({
	tweets,
	description,
	url,
	validator
}: {
	tweets: string[]
	description: string
	url: string
	validator: string
}) {
	const validatedData = await openai.chat.completions.create({
		messages: [
			{
				role: 'system',
				content: `You are a validation bot that helps us validate whether a user meets the requirements based on their tweets and a provided validator. The requirements are as follows: ${aiValidator} \n\n IMPORTANT: Your final output should be "true" or "false" (case sensitive).`
			},
			{
				role: 'user',
				content: `tweets: ${JSON.stringify(
					tweets
				)}, description: ${description}, url: ${url}`
			},
			{role: 'system', content: 'Do you think this user meets the requirements?'}
		],
		model: 'gpt-4-1106-preview'
	})

	return validatedData
}
