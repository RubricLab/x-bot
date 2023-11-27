import {env} from '~/env.mjs'

const rootUrl = 'https://twitter.com/i/oauth2/authorize'
const options = {
	redirect_uri: env.TWITTER_REDIRECT_URI,
	client_id: env.TWITTER_CLIENT_ID,
	state: 'state',
	response_type: 'code',
	code_challenge: 'y_SfRG4BmOES02uqWeIkIgLQAlTBggyf_G7uKT51ku8',
	code_challenge_method: 'S256',
	//👇🏻 required scope for authentication and posting tweets
	scope: [
		'users.read',
		'tweet.read',
		'tweet.write',
		'bookmark.read',
		'bookmark.write',
		'like.read',
		'like.write',
		'follows.write',
		'follows.read',
		'offline.access',
		'tweet.moderate.write',
		'block.write',
		'block.read',
		'mute.write',
		'mute.read',
		'space.read',
		'list.read',
		'list.write'
	].join(' ')
}
const qs = new URLSearchParams(options).toString()

const twitterAuthUrl = `${rootUrl}?${qs}`

export default twitterAuthUrl
