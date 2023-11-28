import activate from '~/actions/activate'
import {getServerAuthSession} from '~/auth'

export default async function Activate() {
	const session = await getServerAuthSession()

	return (
		session && (
			<form action={activate}>
				<input
					type='hidden'
					name='enabled'
					value={session.user.enabled ? 'false' : 'true'}
				/>
				<button type='submit'>{session.user.enabled ? 'Disable' : 'Enable'}</button>
			</form>
		)
	)
}
