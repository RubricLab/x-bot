import db from '~/db'
import renderValid from '~/utils/renderValid'

export default async function Page() {
	const builders = await db.builder.findMany({
		select: {
			id: true,
			name: true,
			username: true,
			validated: true
		}
	})

	return (
		<div className='flex h-screen w-full flex-col items-center justify-center gap-10 p-5 sm:p-20'>
			<div className='flex flex-col items-start gap-4'>
				{builders.map(builder => (
					<div
						key={builder.id}
						className='flex w-full items-center gap-4'>
						<div className='text-xs'>{renderValid(builder.validated)}</div>
						<div>
							<a
								href={`https://twitter.com/${builder.username}`}
								target='_blank'>
								{builder.name}
							</a>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}
