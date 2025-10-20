import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

import Logo from '@/assets/Logo.jpg';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className='w-full h-[100vh] flex items-center justify-center'>
      <div className='w-[90%] max-w-[1000px] flex flex-col gap-6'>
        <Card className='overflow-hidden p-0'>
          <CardContent className='grid p-0 md:grid-cols-2'>
            <form className='p-6 md:p-8'>
              <FieldGroup>
                <div className='flex flex-col items-center gap-2 text-center'>
                  <h1 className='text-2xl font-bold'>Welcome back!</h1>
                  <p className='text-muted-foreground text-balance'>
                    Login to your account
                  </p>
                </div>
                <Field className='gap-2'>
                  <FieldLabel htmlFor='email' className='text-muted-foreground'>
                    Email
                  </FieldLabel>
                  <div className='relative'>
                    <Input
                      id='email'
                      type='email'
                      placeholder='m@example.com'
                      className='h-11 pl-10' /* left padding for icon */
                      required
                    />
                    <span className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground'>
                      <Mail size={20} />
                    </span>
                  </div>
                </Field>
                <Field className='gap-2'>
                  <div className='flex items-center'>
                    <FieldLabel
                      htmlFor='password'
                      className='text-muted-foreground'
                    >
                      Password
                    </FieldLabel>
                    <a
                      href='#'
                      className='ml-auto text-sm underline-offset-2 hover:underline'
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <div className='relative'>
                    <Input
                      id='password'
                      type={showPassword ? 'text' : 'password'}
                      className='h-11 pl-10 pr-10' /* left/right padding for icons */
                      placeholder='******'
                      required
                    />
                    <span className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground'>
                      <Lock size={20} />
                    </span>
                    <button
                      type='button'
                      tabIndex={-1}
                      onClick={() => setShowPassword((v) => !v)}
                      className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground'
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </Field>
                <Field>
                  <Button type='submit'>Login</Button>
                </Field>
              </FieldGroup>
            </form>
            <div className='bg-muted relative hidden md:block'>
              <img
                src={Logo}
                alt='Image'
                className='absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale'
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
