import db from '~/db'
import env from '~/env.mjs'

export default async function refreshAuthToken({
	id,
	access_token,
	refresh_token,
	expires_at
}: {
	id: string
	access_token: string
	refresh_token: string
	expires_at: number
}) {
	console.log(
		'TOKEN',
		expires_at < new Date().getTime() / 1000 ? 'EXPIRED' : 'VALID'
	)

	if (expires_at < new Date().getTime() / 1000) {
		const refreshedData = await fetch('https://api.twitter.com/2/oauth2/token', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				Authorization: `Basic ${Buffer.from(
					`${env.TWITTER_CLIENT_ID}:${env.TWITTER_CLIENT_SECRET}`
				).toString('base64')}`
			},
			body: `grant_type=refresh_token&refresh_token=${refresh_token}`
		})

		const refreshed = await refreshedData.json()

		console.log('REFRESHED TOKEN')

		await db.account.update({
			where: {
				id
			},
			data: {
				access_token: refreshed.access_token,
				expires_at:
					((new Date().getTime() / 1000) | 0) + refreshed.expires_in * 1000,
				refresh_token: refreshed.refresh_token
			}
		})

		return refreshed.access_token
	}
	return access_token
}
