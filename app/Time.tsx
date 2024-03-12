type Props = {
  value: string | number | Date
  className?: string
}

export default function Time({ value, className }: Props) {
  const date = new Date(value)
  return (
    <time
      dateTime={formatDateTime(date)}
      className={`text-[13px] text-gray-400 dark:text-gray-500 font-mono flex ${className}`}
    >
      {date.toLocaleDateString('en', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })}
    </time>
  )
}

function formatDateTime(date: Date) {
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')

  return `${year}-${month}-${day}`
}
