'use server'

import {redirect} from 'next/navigation'
import db from '~/db'
import env from '~/env.mjs'

export default async function scrape(formData: FormData) {
	const url = formData.get('url') as string
	const id = (formData.get('url') as string).split('/').pop()

	const tweetData = await fetch(
		`https://api.twitter.com/2/tweets/${id}?tweet.fields=public_metrics`,
		{
			headers: {
				Authorization: `Bearer ${env.TWITTER_BEARER_TOKEN}`
			}
		}
	)

	const tweet = await tweetData.json()

	await db.post.create({
		data: {
			id,
			url,
			likes: tweet.data.public_metrics.like_count
		}
	})

	redirect('/posts')
}
