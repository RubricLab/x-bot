// tick every minute

import {Status} from '@prisma/client'
import db from '~/db'
import env from '~/env.mjs'
import drinkBeer from '~/utils/drinkBeer'

export const maxDuration = 600

export async function GET() {
	const post = await db.post.findFirst({
		where: {
			status: {
				in: [Status.PROCESSING, Status.QUEUED]
			}
		},
		select: {
			id: true,
			pageToken: true
		}
	})

	if (!post) return Response.json({})

	await drinkBeer(2)

	const likersData = await fetch(
		`https://api.twitter.com/2/tweets/${post.id}/liking_users${
			post.pageToken ? `?pagination_token=${post.pageToken}` : ''
		}`,
		{
			headers: {
				Authorization: `Bearer ${env.TWITTER_BEARER_TOKEN}`
			}
		}
	)

	const likers = await likersData.json()

	if (likers.meta.result_count > 0)
		await db.$transaction(
			likers.data.map((liker: {id: string; name: string; username: string}) =>
				db.builder.upsert({
					where: {
						id: liker.id
					},
					create: {
						id: liker.id,
						likes: {
							connect: {
								id: post.id
							}
						},
						name: liker.name,
						username: liker.username
					},
					update: {
						likes: {
							connect: {
								id: post.id
							}
						}
					}
				})
			)
		)

	if (likers.meta.next_token)
		await db.post.update({
			where: {
				id: post.id
			},
			data: {
				pageToken: likers.meta.next_token,
				status: Status.PROCESSING
			}
		})
	else
		await db.post.update({
			where: {
				id: post.id
			},
			data: {
				status: Status.COMPLETE
			}
		})

	return Response.json(likers)
}
