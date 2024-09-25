import React, { useState, useEffect } from 'react';
import { supabase } from '@/supabase/client';
import { DateRange } from 'react-day-picker';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { DatePickerWithRange } from '@/components/ui/date-picker';
import { Badge } from '@/components/ui/badge';
import { Loader2, MoreHorizontal } from 'lucide-react';

interface AccessLog {
  id: string;
  user_id: string;
  timestamp: string;
  action: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

const AdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [accessLogs, setAccessLogs] = useState<AccessLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AccessLog[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [userId, setUserId] = useState('');

  const fetchAccessLogs = async () => {
    const { data, error } = await supabase.from('access_logs').select('*');
    if (error) console.error('Error fetching access logs:', error);
    else {
      setAccessLogs(data || []);
      setFilteredLogs(data || []);
    }
  };

  const fetchUsers = async () => {
    const { data, error } = await supabase.from('users').select('*');
    if (error) console.error('Error fetching users:', error);
    else setUsers(data || []);
  };

  const handleSearch = () => {
    const filtered = accessLogs.filter((log) => {
      const logDate = new Date(log.timestamp);
      const userIdMatch = log.user_id
        .toLowerCase()
        .includes(userId.toLowerCase());
      const dateMatch =
        (!dateRange?.from || logDate >= dateRange.from) &&
        (!dateRange?.to || logDate <= dateRange.to);
      return userIdMatch && dateMatch;
    });
    setFilteredLogs(filtered);
  };

  const handleUserAction = async (
    userId: string,
    action: 'activate' | 'suspend' | 'reactivate'
  ) => {
    const { error } = await supabase
      .from('users')
      .update({ status: action === 'suspend' ? 'suspended' : 'active' })
      .eq('id', userId);

    if (error) console.error(`Error ${action}ing user:`, error);
    else fetchUsers();
  };

  useEffect(() => {
    fetchAccessLogs();
    fetchUsers();
    setLoading(false);
  }, []);

  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-5 md:flex-row mt-12'>
        <DatePickerWithRange onChange={(range) => setDateRange(range)} />
        <Input
          type='text'
          placeholder='User ID'
          className='ml-0'
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <Button onClick={handleSearch}>Search</Button>
      </div>

      <div className='mt-12 rounded-md border p-6'>
        <h2 className='text-xl font-bold'>Access Logs</h2>
        <p className='text-muted-foreground'>Here are the access logs.</p>

        {filteredLogs.length === 0 && !loading && (
          <div className='flex justify-center mt-6'>
            <p>No logs found matching the criteria.</p>
          </div>
        )}

        {loading && (
          <div className='flex justify-center mt-6'>
            <Loader2 className='animate-spin' />
          </div>
        )}

        {!loading && filteredLogs.length > 0 && (
          <Table className='mt-6'>
            <TableHeader>
              <TableRow>
                <TableHead>User ID</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{log.user_id}</TableCell>
                  <TableCell>
                    {new Date(log.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {log.action === 'check-in' ? (
                      <Badge className='bg-green-700 rounded-full'>
                        Check In
                      </Badge>
                    ) : (
                      <Badge className='bg-red-700 rounded-full'>
                        Check Out
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <div className='mt-12 rounded-md border p-6'>
        <h2 className='text-xl font-bold'>Users</h2>
        <p className='text-muted-foreground'>Manage users in the system.</p>

        {users.length === 0 && !loading && (
          <div className='flex justify-center mt-6'>
            <Loader2 className='animate-spin' />
          </div>
        )}

        <Table className='mt-6'>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  {user.status === 'active' ? (
                    <Badge className='bg-green-600 rounded-full'>Active</Badge>
                  ) : (
                    <Badge className='bg-red-600 rounded-full'>Suspended</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Button size='icon' variant='outline'>
                        <MoreHorizontal size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() => handleUserAction(user.id, 'activate')}
                        disabled={user.status === 'active'}
                      >
                        Activate
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleUserAction(user.id, 'suspend')}
                        disabled={user.status === 'suspended'}
                      >
                        Suspend
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminDashboard;
