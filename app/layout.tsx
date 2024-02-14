import Link from './Link'
import HomeLink from './HomeLink'
import { serif } from './fonts'
import './global.css'
import Image from 'next/image'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={serif.className}>
      <body className="mx-auto max-w-2xl bg-[--bg] px-5 py-12 text-[--text]">
        <header className="mb-14 flex flex-row place-content-between">
          <HomeLink />
          <span className="relative top-[4px] italic">
            by{' '}
            <Link href="https://danabra.mov" target="_blank">
              <Image
                alt="Dan Abramov"
                src="https://github.com/gaearon.png"
                className="relative -top-1 mx-1 inline h-8 w-8 rounded-full"
                width="400"
                height="400"
              />
            </Link>
          </span>
        </header>
        <main>{children}</main>
      </body>
    </html>
  )
}
