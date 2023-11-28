// tick every minute

import db from '~/db'
import drinkBeer from '~/utils/drinkBeer'
import randomNumber from '~/utils/randomNumber'
import refreshAuthToken from '~/utils/refreshAuthToken'

export const maxDuration = 600

export async function GET() {
	const users = await db.user.findMany({
		where: {
			enabled: true
		},
		select: {
			name: true,
			id: true,
			accounts: {
				where: {
					provider: 'twitter'
				},
				select: {
					id: true,
					providerAccountId: true,
					access_token: true,
					refresh_token: true,
					expires_at: true
				}
			}
		}
	})

	const user = users[randomNumber(0, users.length - 1)]

	if (!user) return Response.json({})

	const account = user.accounts[0]

	const builder = await db.builder.findFirst({
		where: {
			validated: true,
			followed: false
		}
	})

	if (!builder) return Response.json({})

	await drinkBeer(4)

	const accessToken = await refreshAuthToken({
		access_token: account.access_token,
		refresh_token: account.refresh_token,
		expires_at: account.expires_at,
		id: account.id
	})

	const followData = await fetch(
		`https://api.twitter.com/2/users/${account.providerAccountId}/following`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${accessToken}`
			},
			body: JSON.stringify({
				target_user_id: builder.id
			})
		}
	)

	const follow = (await followData.json()).data

	await db.builder.update({
		where: {
			id: builder.id
		},
		data: {
			followed: true,
			followedBy: {
				connect: {
					id: user.id
				}
			}
		}
	})

	return Response.json({username: builder.username, ...follow})
}
