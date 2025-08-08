import { redirect } from 'next/navigation';
import { defaultLocale } from '@/constants/local';

export default function RootPage() {
  // Redirect to the default locale (English)
  redirect(`/${defaultLocale}`);
}
