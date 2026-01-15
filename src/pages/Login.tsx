import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { showValidationErrors } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, Mail, Lock, Loader2 } from 'lucide-react';
import { loginUser } from '@/data/Authorization';
import { validateRefreshToken } from '@/utils/authUtils';
import { setAccessToken } from '@/store/slices/notificationsSlice';
import Logo from '@/assets/Logo.jpg';

import { setMe } from '@/store/slices/meSlice';


const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      // Try to validate session using HTTP-only cookie
      const isValid = await validateRefreshToken();
      if (isValid) {
        navigate('/');
        return;
      }
      setIsCheckingSession(false);
    };
    checkSession();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;
    setIsLoading(true);

    try {
      const response = await loginUser({ email, password });
      if (response.error || response.errors?.length > 0) {
        showValidationErrors(
          'Login Failed',
          response.errors?.length > 0 ? response.errors : response.error,
          'Email or password is incorrect'
        );
        setIsLocked(true);
      } else {
        // Store the access token for SignalR connection
        if (response.accessToken || response.token) {
          dispatch(setAccessToken(response.accessToken || response.token));
        }
        dispatch(setMe(response));
        toast.success('Login successful!');
        navigate('/');
      }
    } catch (error: any) {
      toast.error('Server is down or unreachable!');
      setIsLocked(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
      if (isLocked) setIsLocked(false);
    };

  if (isCheckingSession) {
    return (
      <div className='flex flex-col justify-center items-center h-screen'>
        <img
          src={Logo}
          alt='Company Logo'
          className='w-32 h-32 object-contain'
          style={{ animation: 'bw-pulse 2.5s infinite' }}
        />
        <Loader2 className='mt-8 h-8 w-8 animate-spin text-gray-800' />
      </div>
    );
  }

  return (
    <div className='w-full h-screen lg:grid lg:grid-cols-2'>
      {/* Left Column: Branding / Marketing */}
      <div className='hidden lg:flex flex-col justify-between bg-zinc-900 p-10 text-white dark:bg-zinc-900 relative overflow-hidden'>
        {/* Abstract Background Shape */}
        <div className='absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20'>
          <div className='absolute -top-[50%] -left-[50%] w-[200%] h-[200%] rounded-full bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-3xl animate-blob' />
        </div>
        
        <div className='relative z-10 flex items-center gap-3 font-medium text-lg'>
          <div className='h-10 w-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center overflow-hidden border border-white/20 shadow-xl'>
            <img src={Logo} alt='Logo' className='h-full w-full object-cover' />
          </div>
          <span className='text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent'>Mall Dash</span>
        </div>
        
        <div className='relative z-10 mt-auto'>
          <blockquote className='space-y-4'>
            <p className='text-xl italic font-light leading-relaxed text-zinc-200'>
              &ldquo;Streamline your mall management operations with real-time insights and comprehensive control.&rdquo;
            </p>
            <footer className='text-sm font-medium text-zinc-400 flex items-center gap-2'>
              <div className='h-px w-8 bg-zinc-600' />
              Admin Console
            </footer>
          </blockquote>
        </div>
      </div>

      {/* Right Column: Login Form */}
      <div className='flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background relative'>
        {/* Mobile Logo (visible only on small screens) */}
        <div className='absolute top-4 left-4 lg:hidden flex items-center gap-2'>
           <div className='h-8 w-8 bg-zinc-100 rounded-md flex items-center justify-center overflow-hidden'>
            <img src={Logo} alt='Logo' className='h-full w-full object-contain' />
          </div>
          <span className='font-bold'>Mall Dash</span>
        </div>

        <div className='mx-auto grid w-full max-w-[400px] gap-8'>
          <div className='flex flex-col space-y-2 text-center'>
            <h1 className='text-4xl font-bold tracking-tight text-foreground'>Welcome back</h1>
            <p className='text-muted-foreground text-lg'>
              Enter your credentials to access your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className='grid gap-6'>
            <div className='grid gap-3'>
              <Label htmlFor='email' className='text-base'>Email</Label>
              <div className='relative group'>
                <Input
                  id='email'
                  type='email'
                  placeholder='name@example.com'
                  required
                  value={email}
                  onChange={handleChange(setEmail)}
                  className='pl-11 h-12 transition-all border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-primary/20'
                />
                <Mail className='absolute left-3.5 top-3.5 h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors' />
              </div>
            </div>

            <div className='grid gap-3'>
              <div className='flex items-center justify-between'>
                <Label htmlFor='password' className='text-base'>Password</Label>
                <a
                  href='#'
                  className='text-sm font-medium text-primary hover:text-primary/80 underline-offset-4 hover:underline transition-colors'
                  onClick={(e) => { e.preventDefault(); toast.info("Please contact your administrator to reset password."); }}
                >
                  Forgot password?
                </a>
              </div>
              <div className='relative group'>
                <Input
                  id='password'
                  type={showPassword ? 'text' : 'password'}
                  placeholder='••••••'
                  required
                  value={password}
                  onChange={handleChange(setPassword)}
                  className='pl-11 pr-11 h-12 transition-all border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-primary/20'
                />
                <Lock className='absolute left-3.5 top-3.5 h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors' />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3.5 top-3.5 text-muted-foreground hover:text-foreground transition-colors'
                >
                  {showPassword ? (
                    <EyeOff className='h-5 w-5' />
                  ) : (
                    <Eye className='h-5 w-5' />
                  )}
                </button>
              </div>
            </div>

            <Button type='submit' className='w-full h-12 text-base font-medium shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all' disabled={isLoading || isLocked}>
              {isLoading && <Loader2 className='mr-2 h-5 w-5 animate-spin' />}
              {isLocked ? 'Please edit credentials' : 'Sign In'}
            </Button>
          </form>

          <p className='px-8 text-center text-sm text-muted-foreground'>
             By clicking continue, you agree to our{' '}
            <a href='#' className='underline underline-offset-4 hover:text-primary transition-colors'>
              Terms of Service
            </a>{' '}
            and{' '}
            <a href='#' className='underline underline-offset-4 hover:text-primary transition-colors'>
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
