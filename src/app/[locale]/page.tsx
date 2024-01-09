import CardList from '@src/components/ProductsList';
import Input from '@src/ui/Input';
import { useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations();
  console.log(process.env.FIREBASE_API_KEY);
  return (
    <main className='px-10'>
      <CardList />
    </main>
  );
}
