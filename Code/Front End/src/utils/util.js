import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

function createdAt() {
  return dayjs().format("YYYY-MM-DDTHH:mm:ss");
}

function timeAgo(dateString) {
  // Add 3 hours to the input date before calculating relative time
  const adjusted = dayjs(dateString).add(3, "hour");
  return adjusted.fromNow();
}

export { createdAt, timeAgo };
