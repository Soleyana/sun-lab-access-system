import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

import Registration from '@/components/pages//Registration';
import Login from '@/components/pages//Login';
import AdminDashboard from '@/components/pages//AdminDashboard';
import { Button } from '@/components/ui/button';
import ProtectedRoute from '@/components/ProtectedRoute';
import AccessLog from '@/components/pages/AccessLog';

import { useAuthStore } from '@/store/useAuthStore';
import { Toaster } from '@/components/ui/sonner';

const App = () => {
  const { user, signOut } = useAuthStore();

  return (
    <Router>
      <>
        <Toaster richColors={true} theme='light' />
        <nav className='py-5 bg-primary text-white flex items-center justify-between px-4 md:px-10 lg:px-16'>
          <Link to='/'>
            <h1 className='text-lg md:text-xl font-bold font-mono'>
              <span className='hidden md:block'>SUN Lab Access System</span>
              <span className='md:hidden'>SLAS</span>
            </h1>
          </Link>

          {!user ? (
            <Button asChild variant='secondary'>
              <Link to='/login'>Login</Link>
            </Button>
          ) : (
            <div className='flex gap-6'>
              <Button
                onClick={() => {
                  signOut();
                }}
                variant='destructive'
              >
                Logout
              </Button>
              {user.user_metadata.role === 'admin' ? (
                <Button asChild variant='secondary'>
                  <Link to='/admin'>Admin Panel</Link>
                </Button>
              ) : (
                <Button asChild variant='secondary'>
                  <Link to='/access'>Access</Link>
                </Button>
              )}
            </div>
          )}
        </nav>

        <div className='container mx-auto px-4'>
          <Routes>
            <Route
              path='/'
              element={
                <div className='flex flex-col items-center justify-center mt-12 md:mt-16 lg:mt-20'>
                  <h2 className='text-2xl font-bold'>
                    Welcome to SUN Lab Access System
                  </h2>
                  <p className='mt-2 text-lg font-semibold text-primary'>
                    Welcome!{' '}
                    {user?.user_metadata.name && (
                      <span>{user.user_metadata.name}</span>
                    )}
                  </p>
                </div>
              }
            />
            <Route path='/register' element={<Registration />} />
            <Route path='/login' element={<Login />} />
            <Route
              path='/admin'
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path='/access'
              element={
                <ProtectedRoute>
                  <AccessLog />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </>
    </Router>
  );
};

export default App;
