import { redirect } from '@/utils/navigation';
import { ROUTES } from '@/constants/routes';

export default function HomePage({ params: { locale } }: { params: { locale: string } }) {
  return redirect({ href: ROUTES.dashboard.home, locale });
} 