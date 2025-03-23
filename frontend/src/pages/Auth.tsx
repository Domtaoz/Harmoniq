
import React from 'react';
import AuthModalComponent from '@/components/auth/AuthModal';
import { useSearchParams } from 'react-router-dom';

const Auth: React.FC = () => {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') === 'register' ? 'register' : 'login';

  return <AuthModalComponent initialMode={mode} />;
};

export default Auth;
