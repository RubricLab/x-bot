import localFont from 'next/font/local'
import BackgroundGrid from '~/components/BackgroundGrid'
import Nav from '~/components/Nav'
import env from '~/env.mjs'
import '~/styles/globals.css'

const neueBit = localFont({
	src: '../public/fonts/PPNeueBit-Bold.otf',
	variable: '--font-neue-bit'
})

export const metadata = {
	alternates: {
		canonical: '/',
		languages: {
			'en-US': '/en-US'
		}
	},
	metadataBase: new URL(env.NEXTAUTH_URL)
}

export default function RootLayout({children}: {children: React.ReactNode}) {
	return (
		<html lang='en'>
			<body
				className={`${neueBit.className} relative flex h-full min-h-screen w-full flex-col items-center`}>
				<BackgroundGrid className='fixed h-full w-full opacity-30 dark:opacity-40' />
				<Nav title={'x-bot'} />
				<div className='z-10 flex w-full max-w-3xl items-center justify-center'>
					{children}
				</div>
			</body>
		</html>
	)
}
