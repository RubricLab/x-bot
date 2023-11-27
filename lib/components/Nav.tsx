import Link from 'next/link'
import {getServerAuthSession} from '~/auth'

export default async function Nav({title}: {title: string}) {
	const session = await getServerAuthSession()
	return (
		<div className='fixed top-0 z-20 flex w-full items-baseline justify-between p-5'>
			<div className='flex items-baseline gap-4'>
				<Link
					className='text-xl font-bold'
					href='/'>
					{title}
				</Link>
				<Link href='/posts'>posts</Link>
				<Link href='/builders'>builders</Link>
			</div>

			<div className='flex gap-4'>
				<p>{session.user.name}</p>
				<Link href={session ? '/api/auth/signout' : '/api/auth/signin'}>
					{session ? 'sign out' : 'sign in'}
				</Link>
			</div>
		</div>
	)
}
