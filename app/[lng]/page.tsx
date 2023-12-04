import Footer from '@components/Footer'
import Header from '@components/Header'
import Dropdown from '../../ui/Dropdown'
import Image from 'next/image'
import Link from 'next/link'

export default function Home({ params: { lng } }: { params: { lng: any } }) {
  return (
    <main className="px-10">
      Hello Next-Tech
    </main>
  )
}
