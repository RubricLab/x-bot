import {createEnv} from '@t3-oss/env-nextjs'
import z from 'zod'

export default createEnv({
	/**
	 * Specify your client-side environment variables schema here. This way you can ensure the app
	 * isn't built with invalid env vars. To expose them to the client, prefix them with
	 * `NEXT_PUBLIC_`.
	 */
	client: {
		// NEXT_PUBLIC_CLIENTVAR: z.string().min(1),
	},

	/**
	 * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
	 * middlewares) or client-side so we need to destruct manually.
	 */
	runtimeEnv: {
		OPENAI_API_KEY: process.env.OPENAI_API_KEY,
		DATABASE_URL: process.env.DATABASE_URL,
		NODE_ENV: process.env.NODE_ENV,
		NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
		NEXTAUTH_URL: process.env.NEXTAUTH_URL,
		TWITTER_CLIENT_ID: process.env.TWITTER_CLIENT_ID,
		TWITTER_CLIENT_SECRET: process.env.TWITTER_CLIENT_SECRET,
		TWITTER_BEARER_TOKEN: process.env.TWITTER_BEARER_TOKEN,
		TWITTER_API_KEY: process.env.TWITTER_API_KEY,
		TWITTER_API_KEY_SECRET: process.env.TWITTER_API_KEY_SECRET
	},

	/**
	 * Specify your server-side environment variables schema here. This way you can ensure the app
	 * isn't built with invalid env vars.
	 */
	server: {
		OPENAI_API_KEY: z.string().min(1),
		DATABASE_URL: z.string().min(1),
		NODE_ENV: z.string(),
		NEXTAUTH_SECRET:
			process.env.NODE_ENV === 'production' ? z.string() : z.string().optional(),
		NEXTAUTH_URL: z.string().url(),
		TWITTER_CLIENT_ID: z.string().min(1),
		TWITTER_CLIENT_SECRET: z.string().min(1),
		TWITTER_BEARER_TOKEN: z.string().min(1),
		TWITTER_API_KEY: z.string().min(1),
		TWITTER_API_KEY_SECRET: z.string().min(1)
	}
})
