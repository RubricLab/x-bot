// tick every minute

import db from '~/db'

export const maxDuration = 600

export async function GET() {
	const users = await db.user.findMany({
		where: {
			enabled: true
		},
		select: {
			name: true,
			accounts: {
				where: {
					provider: 'twitter'
				},
				select: {
					access_token: true
				}
			}
		}
	})

	console.log('users', users)

	return Response.json(users)
}
