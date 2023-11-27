'use server'

import {redirect} from 'next/navigation'
import {getServerAuthSession} from '~/auth'
import db from '~/db'

export default async function activate(formData: FormData) {
	const session = await getServerAuthSession()
	await db.user.update({
		where: {
			id: session.user.id
		},
		data: {
			enabled: formData.get('enabled') === 'true'
		}
	})
	redirect('/')
}
