import { Montserrat, Noto_Sans } from 'next/font/google'

export const brand = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '700', '900'],
  style: ['normal'],
})

export const sans = Noto_Sans({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '700'],
  style: ['normal', 'italic'],
})
