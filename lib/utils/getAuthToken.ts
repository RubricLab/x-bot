import {getServerAuthSession} from '~/auth'
import db from '~/db'

export default async function getAuthToken() {
	const session = await getServerAuthSession()
	return (
		await db.account.findFirst({
			where: {
				userId: session?.user.id,
				provider: 'twitter'
			},
			select: {
				access_token: true
			}
		})
	).access_token
}
