import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);
dayjs.extend(advancedFormat);

export function formatDate(date) {
	return dayjs(date).format("dddd Do MMM, YYYY [at] HH:mm:ss");
}

export function formatRelativeTime(date) {
	return dayjs(date).fromNow();
}
