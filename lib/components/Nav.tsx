import Link from 'next/link'
import {getServerAuthSession} from '~/auth'
import db from '~/db'

export default async function Nav({title}: {title: string}) {
	const session = await getServerAuthSession()
	const followedStat =
		session &&
		(await db.user.findUnique({
			where: {
				id: session.user.id
			},
			select: {
				_count: {
					select: {
						following: true
					}
				}
			}
		}))
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
				<p>{followedStat?._count.following}</p>
				<p>{session?.user.name}</p>
				<Link href={session ? '/api/auth/signout' : '/api/auth/signin'}>
					{session ? 'sign out' : 'sign in'}
				</Link>
			</div>
		</div>
	)
}
