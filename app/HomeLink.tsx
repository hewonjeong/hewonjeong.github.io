'use client'

import { brand } from './fonts'
import { usePathname } from 'next/navigation'
import Link from './Link'

export default function HomeLink() {
  const pathname = usePathname()
  const isActive = pathname === '/'

  return (
    <Link
      href="/"
      className={[
        brand.className,
        'inline-block text-2xl font-black',
        !isActive && 'hover:scale-[1.02]',
      ].join(' ')}
    >
      <span>Hewon Jeong</span>
    </Link>
  )
}
