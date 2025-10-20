import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'; // lucid-react imports
import Logo from '@/assets/Logo.jpg';

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className='w-full h-full flex items-center justify-center'>
      <div className='w-[400px] flex flex-col gap-6 mt-40'>
        <Card className='rounded-md'>
          <CardHeader className='flex flex-col items-center'>
            <img src={Logo} alt='Companies Logo' className='w-25 h-25' />
            <CardTitle className='font-black'>Welcome Back !</CardTitle>
            <CardDescription>
              Please enter your credentials to login!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <FieldGroup className='gap-5'>
                <Field className='gap-1'>
                  <FieldLabel htmlFor='email' className='text-muted-foreground'>
                    Email
                  </FieldLabel>
                  <div className='relative'>
                    <Input
                      id='email'
                      type='email'
                      placeholder='E-mail'
                      required
                      className='pl-10 h-11'
                    />
                    <span className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'>
                      <Mail size={16} />
                    </span>
                  </div>
                </Field>

                <Field className='gap-1'>
                  <FieldLabel
                    htmlFor='password'
                    className='text-muted-foreground'
                  >
                    Password
                  </FieldLabel>
                  <div className='relative'>
                    <Input
                      id='password'
                      type={showPassword ? 'text' : 'password'}
                      placeholder='Password'
                      required
                      className='pl-10 pr-10 h-11'
                    />
                    <span className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'>
                      <Lock size={16} />
                    </span>
                    <button
                      type='button'
                      className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400'
                      onClick={() => setShowPassword((prev) => !prev)}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                    </button>
                  </div>
                </Field>

                <Field className='mt-5'>
                  <Button type='submit' className='h-10 font-black text-[17px]'>
                    Login
                  </Button>
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
