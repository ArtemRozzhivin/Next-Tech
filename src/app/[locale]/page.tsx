import { getTranslations } from 'next-intl/server'

export default async function Home({ params: { lng } }: { params: { lng: any } }) {
  const t = await getTranslations("common");
  return (
    <main className="px-10">
      Hello Next-Tech, {t('features')}
    </main>
  )
}
