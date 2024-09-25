import { FormEvent, useState } from 'react';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Link, useNavigate } from 'react-router-dom';

import { useAuthStore } from '@/store/useAuthStore';

import { supabase } from '@/supabase/client';
import { toast } from 'sonner';

const Registration: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const signUp = useAuthStore((state) => state.signUp);
  const { user } = useAuthStore();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      const { error: signUpError, data } = await signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
          },
        },
      });

      const { error: databaseError } = await supabase.from('users').insert({
        created_at: data.user?.created_at,
        id: data.user?.id,
        name: data.user?.user_metadata?.name,
        email: data.user?.user_metadata?.email,
        role: data.user?.user_metadata?.role,
        status: 'active',
      });

      if (signUpError) {
        console.log(signUpError);
        throw signUpError;
      }
      if (databaseError) {
        console.log(databaseError);
        throw databaseError;
      }

      toast.success('Registration successful!');
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
          <CardTitle className='text-2xl'>Register</CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent className='grid gap-4'>
          <div className='grid gap-2'>
            <Label htmlFor='name'>Name</Label>
            <Input
              type='text'
              id='name'
              name='name'
              placeholder='Max Mustermann'
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
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

          <div className='grid gap-2'>
            <Label htmlFor='role'>Role</Label>
            <Select
              name='role'
              onValueChange={(value) => setRole(value)}
              required
            >
              <SelectTrigger id='role'>
                <SelectValue placeholder='Select role' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='student'>Student</SelectItem>
                <SelectItem value='faculty'>Faculty Member</SelectItem>
                <SelectItem value='staff'>Staff Member</SelectItem>
                <SelectItem value='janitor'>Janitor</SelectItem>
                <SelectItem value='admin'>Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type='submit' disabled={loading} className='w-full'>
            {loading ? 'Registering...' : 'Register'}
          </Button>

          <div className='mt-4 text-center text-sm'>
            Already have an account?{' '}
            <Link to='/login' className='underline'>
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};

export default Registration;
