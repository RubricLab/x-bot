import db from '~/db'
import env from '~/env.mjs'
import renderValid from '~/utils/renderValid'

export default async function Page() {
	const builders = await db.builder.findMany({
		select: {
			id: true,
			name: true,
			username: true,
			validated: true,
			rejectReason: true,
			followedBy: {
				select: {
					name: true
				}
			}
		},
		where:
			env.NODE_ENV === 'development'
				? {
						OR: [{validated: true}, {validated: null}, {validated: false}]
				  }
				: {
						OR: [{validated: true}, {validated: null}]
				  },
		orderBy: [{validated: 'asc'}, {createdAt: 'asc'}, {name: 'asc'}]
	})

	return (
		<div className='flex h-screen w-full flex-col items-center justify-center gap-10 p-5 sm:p-20'>
			<div className='h flex max-h-screen w-full flex-col items-start gap-4 overflow-scroll'>
				{builders.map(builder => (
					<div
						key={builder.id}
						className='flex w-full justify-between gap-4'>
						<div className='flex items-center gap-4'>
							<div className='text-xs'>{renderValid(builder.validated)}</div>
							<div>
								<a
									href={`https://twitter.com/${builder.username}`}
									target='_blank'>
									{builder.name}
								</a>
							</div>
						</div>
						<div className='flex items-center gap-4'>
							<p>
								{builder.rejectReason || builder.followedBy.map(f => f.name).join(', ')}
							</p>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}
