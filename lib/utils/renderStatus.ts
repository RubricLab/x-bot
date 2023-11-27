import {Status} from '@prisma/client'

export default function renderStatus(status: Status) {
	switch (status) {
		case Status.QUEUED:
			return '🔵'
		case Status.PROCESSING:
			return '🟡'
		case Status.COMPLETE:
			return '🟢'
		case Status.ERROR:
			return '🔴'
		default:
			return ''
	}
}
