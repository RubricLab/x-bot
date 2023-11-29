import {PrismaAdapter} from '@next-auth/prisma-adapter'
import {
	getServerSession,
	type DefaultSession,
	type NextAuthOptions
} from 'next-auth'
import TwitterProvider from 'next-auth/providers/twitter'

import db from '~/db'
import env from '~/env.mjs'

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module 'next-auth' {
	interface Session extends DefaultSession {
		user: {
			id: string
			enabled: boolean
			// ...other properties
			// role: UserRole;
		} & DefaultSession['user']
	}

	interface User {
		enabled: boolean
		// ...other properties
		// role: UserRole;
	}
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
	callbacks: {
		session: ({session, user}) => ({
			...session,
			user: {
				...session.user,
				id: user.id,
				enabled: user.enabled
			}
		}),
		signIn: async ({user, account}) => {
			console.log(user, account)
			await db.account.upsert({
				where: {
					provider_providerAccountId: {
						provider: account.provider,
						providerAccountId: account.providerAccountId
					}
				},
				update: {
					access_token: account.access_token,
					refresh_token: account.refresh_token,
					expires_at: account.expires_at,
					scope: account.scope
				},
				create: {
					type: account.type,
					access_token: account.access_token,
					refresh_token: account.refresh_token,
					expires_at: account.expires_at,
					provider: account.provider,
					providerAccountId: account.providerAccountId,
					token_type: account.token_type,
					scope: account.scope,
					user: {
						connectOrCreate: {
							where: {
								id: user.id
							},
							create: {
								name: user.name,
								email: user.email,
								image: user.image,
								enabled: true
							}
						}
					}
				}
			})

			return true
		}
	},
	adapter: PrismaAdapter(db),
	providers: [
		TwitterProvider({
			clientId: env.TWITTER_CLIENT_ID,
			clientSecret: env.TWITTER_CLIENT_SECRET,
			version: '2.0',
			authorization: {
				url: 'https://twitter.com/i/oauth2/authorize',
				params: {
					scope: [
						'users.read',
						'tweet.read',
						'follows.write',
						'offline.access'
					].join(' ')
				}
			}
		})
		/**
		 * ...add more providers here.
		 *
		 * Most other providers require a bit more work than the Discord provider. For example, the
		 * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
		 * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
		 *
		 * @see https://next-auth.js.org/providers/github
		 */
	]
}

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions)
