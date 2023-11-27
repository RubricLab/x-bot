import Link from 'next/link'
import twitterAuthUrl from '~/constants/twitterAuthUrl'

export default function Page() {
	return (
		<div className='flex h-screen w-full flex-col items-center justify-center gap-10 p-5 sm:p-20'>
			<Link href={twitterAuthUrl}>Sign in with Twitter</Link>
		</div>
	)
}
