import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AUTEK',
  description: 'AUTEK | ONLINE SHOP',
  generator: 'https://t.me/kadirovs_blogg',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
