export const formatDate = (date: Date) => {
  const now = new Date()
  const currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const postDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const timeDifference = currentDate.getTime() - postDate.getTime()
  const daysAgo = Math.floor(timeDifference / (1000 * 3600 * 24))

  const dateOptions: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  }

  if (daysAgo === 0) {
    return `${date.toLocaleDateString("en-US", dateOptions)} (Today)`
  }

  const dayLabel = daysAgo === 1 ? "day" : "days"
  return `${date.toLocaleDateString(
    "en-US",
    dateOptions
  )} (${daysAgo} ${dayLabel} ago)`
}
