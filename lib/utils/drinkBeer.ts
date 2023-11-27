import flipCoin from './flipCoin'
import randomNumber from './randomNumber'
import waitSeconds from './waitSeconds'

export default async function drinkBeer(numberOfBeers: number) {
	for (let i = 0; i < numberOfBeers; i++) {
		await waitSeconds(randomNumber(0, 10))
		if (flipCoin(0.2)) throw new Error('fuck im too drink')
		if (!flipCoin(0.5)) waitSeconds(randomNumber(0, 20))
	}
}
