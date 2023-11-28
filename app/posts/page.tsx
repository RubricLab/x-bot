import scrape from '~/actions/scrape'
import db from '~/db'
import renderStatus from '~/utils/renderStatus'

export default async function Page() {
	const posts = await db.post.findMany({
		select: {
			id: true,
			status: true,
			url: true,
			likes: true,
			_count: {
				select: {
					likers: true
				}
			}
		},
		orderBy: {
			createdAt: 'asc'
		}
	})

	return (
		<div className='flex h-screen w-full flex-col items-center justify-center gap-10 p-5 sm:p-20'>
			<form
				action={scrape}
				className='flex gap-2'>
				<input
					type='text'
					name='url'
					placeholder='Tweet URL'
				/>
				<button type='submit'>Go</button>
			</form>

			<div className='flex flex-col items-start gap-4'>
				{posts.map(post => (
					<div
						key={post.id}
						className='flex w-full items-center gap-4'>
						<div className='text-xs'>{renderStatus(post.status)}</div>
						<div>
							<a
								href={post.url}
								target='_blank'>
								{post.id}
							</a>
						</div>
						<div className='flex-grow text-right'>
							{post._count.likers} / {post.likes}
						</div>
					</div>
				))}
			</div>
		</div>
	)
}
