import db from '~/db'
import env from '~/env.mjs'

import {RejectReason} from '@prisma/client'
import {
	aiValidator,
	enforceVerification,
	maxDaysSinceLastPost,
	maxFollowers,
	minFollowers,
	minFollowing,
	minLikes,
	minPosts
} from '~/constants/validation'
import aiValidation from '~/utils/aiValidation'

export const maxDuration = 60

export async function GET() {
	const builder = await db.builder.findFirst({
		where: {
			validated: null,
			followed: false
		},
		orderBy: [{createdAt: 'asc'}]
	})

	if (!builder) return Response.json({})

	const userData = await fetch(
		`https://api.twitter.com/2/users/${builder.id}?user.fields=public_metrics,verified,description,url`,
		{
			headers: {
				Authorization: `Bearer ${env.TWITTER_BEARER_TOKEN}`
			}
		}
	)

	const user = (await userData.json()).data

	async function validate() {
		if (user.public_metrics.followers_count < minFollowers)
			return RejectReason.MIN_FOLLOWERS
		else if (user.public_metrics.followers_count > maxFollowers)
			return RejectReason.MAX_FOLLOWERS
		else if (user.public_metrics.following_count < minFollowing)
			return RejectReason.MIN_FOLLOWING
		else if (user.public_metrics.tweet_count < minPosts)
			return RejectReason.MIN_POSTS
		else if (user.public_metrics.like_count < minLikes)
			return RejectReason.MIN_LIKES
		else if (enforceVerification && !user.verified)
			return RejectReason.NOT_VERIFIED
		else {
			const mostRecentTweetsData = await fetch(
				`https://api.twitter.com/2/users/${user.id}/tweets?max_results=5&exclude=retweets,replies&tweet.fields=created_at`,
				{
					headers: {
						Authorization: `Bearer ${env.TWITTER_BEARER_TOKEN}`
					}
				}
			)
			const mostRecentTweets = (await mostRecentTweetsData.json()).data
			if (
				!(
					new Date(mostRecentTweets?.[0].created_at).getTime() >
					Date.now() - 1000 * 60 * 60 * 24 * maxDaysSinceLastPost
				)
			)
				return RejectReason.MAX_DAYS_SINCE_LAST_POST
			else {
				const validation = (
					await aiValidation({
						tweets: mostRecentTweets.map(tweet => tweet.text),
						description: user.description,
						url: user.url,
						validator: aiValidator
					})
				).choices[0].message.content
				const parsedValidation = validation.toLowerCase().trim() === 'true'
				if (!parsedValidation) return RejectReason.AI_DISCRETIONARY
				else return null
			}
		}
	}

	const rejectReason = await validate()

	if (rejectReason)
		await db.builder.update({
			where: {
				id: builder.id
			},
			data: {
				validated: false,
				rejectReason
			}
		})
	else
		await db.builder.update({
			where: {
				id: builder.id
			},
			data: {
				validated: true
			}
		})

	console.log(`VALIDATE: ${user.name} ${rejectReason ? 'REJECTED' : 'VALID'}`)

	return Response.json({validated: !rejectReason, rejectReason})
}
