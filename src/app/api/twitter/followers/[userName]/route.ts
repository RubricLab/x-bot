export const dynamic = 'force-dynamic'

export async function GET(
	{url}: Request,
	{params}: {params: {userName: string}}
) {
	const userName = params.userName

	const {searchParams} = new URL(url)

	const authToken = searchParams.get('authToken')

	console.log({authToken})

	const userData = await fetch(
		`https://api.twitter.com/2/users/by/username/${userName}`,
		{
			headers: {
				Authorization: `Bearer ${authToken}`
			}
		}
	)

	const {
		data: {id}
	} = await userData.json()

	console.log({id})

	const data = await fetch(`https://api.twitter.com/2/users/${id}/following`, {
		headers: {
			Authorization: `Bearer ${authToken}`
		}
	})
	const followers = await data.json()
	return Response.json({followers})
}
