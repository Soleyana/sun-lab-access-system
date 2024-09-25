import { useAuthStore } from '@/store/useAuthStore';
import { supabase } from '@/supabase/client';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'sonner';

const AccessLog: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  if (!user) {
    alert('You must be logged in to log access');
    navigate('/login', { replace: true });
    return null;
  }

  const logAccess = async (action: 'check-in' | 'check-out') => {
    setLoading(true);

    try {
      const { error } = await supabase
        .from('access_logs')
        .insert({ user_id: user.id, action });

      if (error) throw error;
      toast.success(`${action} successful!`);
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

  return (
    <div className='mt-12 md:mt-16 lg:mt-20 flex gap-8'>
      <Button onClick={() => logAccess('check-in')} disabled={loading}>
        Check In
      </Button>
      <Button onClick={() => logAccess('check-out')} disabled={loading}>
        Check Out
      </Button>
    </div>
  );
};

export default AccessLog;
