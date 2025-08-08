import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/constants/local';
import Providers from '@/services/providers';
import { AppLayout } from '@/components/core/AppLayout';
import { Slide, ToastContainer } from 'react-toastify';
import { Cairo } from 'next/font/google';

const cairo = Cairo({ subsets: ['latin'] });

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  // Ensure that the incoming `locale` is valid
  if (!locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale} dir="ltr">
      <head>
        <meta charSet="UTF-8" />
      </head>
      <body className={cairo.className}>
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <AppLayout>{children}</AppLayout>
          </Providers>
          <ToastContainer position="top-center" autoClose={3000} transition={Slide} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
} 