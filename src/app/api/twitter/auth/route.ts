import {env} from '~/env.mjs'

const BasicAuthToken = Buffer.from(
	`${env.TWITTER_CLIENT_ID}:${env.TWITTER_CLIENT_SECRET}`,
	'utf8'
).toString('base64')

const twitterOauthTokenParams = {
	client_id: process.env.TWITTER_CLIENT_ID!,
	//👇🏻 according to the code_challenge provided on the client
	code_verifier: '8KxxO-RPl0bLSxX5AWwgdiFbMnry_VOKzFeIlVA7NoA',
	redirect_uri: env.TWITTER_REDIRECT_URI,
	grant_type: 'authorization_code'
}

export async function GET({url}: Request) {
	const params = new URLSearchParams(url)
	const code = params.get('code')

	console.log('code', code)

	const formatData = new URLSearchParams({
		...twitterOauthTokenParams,
		code
	})

	const data = await fetch('https://api.twitter.com/2/oauth2/token', {
		method: 'POST',
		body: formatData.toString(),
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			Authorization: `Basic ${BasicAuthToken}`
		}
	})
	const authToken = await data.json()

	return Response.json(authToken)
}
