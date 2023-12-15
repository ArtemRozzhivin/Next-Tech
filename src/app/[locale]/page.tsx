import { useTranslations } from 'next-intl';

export default function Home({ params: { lng } }: { params: { lng: any } }) {
  const t =  useTranslations("common");
  return (
    <main className="px-10">
      Hello Next-Tech, {t('features')}
    </main>
  )
}
