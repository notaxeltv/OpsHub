'use client';

import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api, setAuthSession } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PreferencesBar } from '@/components/preferences-bar';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  organizationName: z.string().min(2),
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const t = useTranslations('auth');
  const tc = useTranslations('common');
  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    try {
      const res = await api.register(data);
      setAuthSession({
        accessToken: res.accessToken,
        refreshToken: res.refreshToken,
        organizationId: res.organization.id,
      });
      router.push('/dashboard');
    } catch (e) {
      setError('root', { message: e instanceof Error ? e.message : t('registerFailed') });
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/20 p-4">
      <div className="mb-4 w-full max-w-md">
        <PreferencesBar />
      </div>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t('registerTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="firstName">{t('firstName')}</Label>
                <Input id="firstName" {...register('firstName')} />
              </div>
              <div>
                <Label htmlFor="lastName">{t('lastName')}</Label>
                <Input id="lastName" {...register('lastName')} />
              </div>
            </div>
            <div>
              <Label htmlFor="organizationName">{t('companyName')}</Label>
              <Input id="organizationName" {...register('organizationName')} />
            </div>
            <div>
              <Label htmlFor="email">{tc('email')}</Label>
              <Input id="email" type="email" {...register('email')} />
            </div>
            <div>
              <Label htmlFor="password">{tc('password')}</Label>
              <Input id="password" type="password" {...register('password')} />
            </div>
            {errors.root && <p className="text-sm text-destructive">{errors.root.message}</p>}
            <Button type="submit" className="w-full" disabled={isSubmitting}>{t('createAccount')}</Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            {t('hasAccount')}{' '}
            <Link href="/login" className="text-primary underline">{t('signIn')}</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
