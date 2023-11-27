export default function renderValid(valid: boolean) {
	switch (valid) {
		case true:
			return '🟢'
		case false:
			return '🔴'
		default:
			return '🟡'
	}
}
