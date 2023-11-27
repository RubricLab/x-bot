import Activate from '~/components/Activate'

export default async function Page() {
	return (
		<div className='flex h-screen w-full flex-col items-center justify-center gap-10 p-5 sm:p-20'>
			<Activate />
		</div>
	)
}
