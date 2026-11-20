import { Redirect } from 'expo-router';
import { useAuthContext } from '../contexts/AuthContext';
import { PropsWithChildren } from 'react';

type Props = PropsWithChildren<{
  requireAdmin?: boolean;
}>;

export default function AuthGuard({ requireAdmin = false, children }: Props) {
  const { isReady, isAuthenticated, user } = useAuthContext();

  if (!isReady) {
    return null;
  }

  if (!isAuthenticated) {
    return <Redirect href="/" />;
  }

  if (requireAdmin && user && !user.isAdmin) {
    return <Redirect href="/" />;
  }

  return (
    <>{children}</>
  );
}