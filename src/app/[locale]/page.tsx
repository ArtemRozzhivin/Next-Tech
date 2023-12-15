import { useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations();
  return (
    <main className="px-10">
      Hello Next-Tech, {t('common.features')}
    </main>
  )
}
