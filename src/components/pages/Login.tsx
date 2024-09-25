import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const signIn = useAuthStore((state) => state.signIn);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      const { error } = await signIn({ email, password });
      if (error) throw error;
      toast.success('Login successful!');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    navigate('/', { replace: true });
    return null;
  }

  return (
    <form onSubmit={handleSubmit} className='flex items-center justify-center'>
      <Card className='w-full max-w-md mt-12 md:mt-16 lg:mt-20'>
        <CardHeader>
          <CardTitle className='text-2xl'>Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account.
          </CardDescription>
        </CardHeader>
        <CardContent className='grid gap-4'>
          <div className='grid gap-2'>
            <Label htmlFor='email'>Email</Label>
            <Input
              name='email'
              id='email'
              type='email'
              placeholder='max@example.com'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='password'>Password</Label>
            <Input
              name='password'
              id='password'
              type='password'
              placeholder='••••••••••••'
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type='submit' disabled={loading} className='w-full'>
            {loading ? 'Logging in...' : 'Login'}
          </Button>

          <div className='mt-4 text-center text-sm'>
            Don&apos;t have an account?{' '}
            <Link to='/register' className='underline'>
              Register
            </Link>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};

export default Login;
