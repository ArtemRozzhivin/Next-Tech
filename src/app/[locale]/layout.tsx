import type { Metadata } from 'next';
import Footer from '@src/components/Footer';
import Header from '@src/components/Header';
import { Inter } from 'next/font/google';
import { notFound } from 'next/navigation';
import './globals.css';
import { NextIntlClientProvider, useMessages } from 'next-intl';
import StoreProvider from './StoreProvider';
import { ToastContainer, toast } from 'react-toastify';
import cx from 'clsx';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NextTech',
  description: 'Generated by create next app',
};

const locales = ['uk', 'en'];

export default function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: any };
}) {
  const messages = useMessages();

  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound();

  return (
    <html lang={locale}>
      <body className={cx(inter.className, 'bg-white h-screen')}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <StoreProvider>
            <ToastContainer />
            <div className='h-full flex flex-col'>
              <div className='mb-20'>
                <div className='w-full fixed left-0 top-0 z-50'>
                  <Header />
                </div>
              </div>
              <div className='flex-1'>{children}</div>
              <Footer />
            </div>
          </StoreProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
