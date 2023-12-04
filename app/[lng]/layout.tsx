import type { Metadata } from 'next'
import Footer from '@components/Footer'
import Header from '@components/Header'
import { Inter } from 'next/font/google'
import { dir } from 'i18next'
import { languages } from '../i18n/settings'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NextTech',
  description: 'Generated by create next app',
}

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }))
}

export default function RootLayout({
  children,
  params: {
    lng,
  }
}: {
  children: React.ReactNode, params: { lng: any }
}) {
  return (
    <html lang={lng} dir={dir(lng)}>
      <body className={inter.className}>
        <Header />
        {children}
        <Footer />
        </body>
    </html>
  )
}
