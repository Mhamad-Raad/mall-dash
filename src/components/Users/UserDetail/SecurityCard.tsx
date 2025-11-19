import { Lock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

interface SecurityCardProps {
  password: string;
  confirmPassword: string;
  onPasswordChange: (password: string) => void;
  onConfirmPasswordChange: (confirmPassword: string) => void;
}

const SecurityCard = ({
  password,
  confirmPassword,
  onPasswordChange,
  onConfirmPasswordChange,
}: SecurityCardProps) => {
  const passwordsMatch = !password || !confirmPassword || password === confirmPassword;

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-lg'>Security</CardTitle>
        <CardDescription>
          Update user password (Optional)
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-6'>
        <div className='space-y-2'>
          <Label htmlFor='password' className='text-sm font-medium flex items-center gap-2'>
            <Lock className='size-4 text-primary' />
            New Password
          </Label>
          <Input
            id='password'
            type='password'
            placeholder='••••••••'
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            className='h-11'
          />
        </div>
        <Separator />
        <div className='space-y-2'>
          <Label htmlFor='confirmPassword' className='text-sm font-medium flex items-center gap-2'>
            <Lock className='size-4 text-primary' />
            Confirm New Password
          </Label>
          <Input
            id='confirmPassword'
            type='password'
            placeholder='••••••••'
            value={confirmPassword}
            onChange={(e) => onConfirmPasswordChange(e.target.value)}
            className='h-11'
          />
          {!passwordsMatch && (
            <p className='text-xs text-destructive'>
              Passwords do not match
            </p>
          )}
        </div>
        <p className='text-xs text-muted-foreground'>
          Leave blank to keep the current password. Password must be at least 8 characters long.
        </p>
      </CardContent>
    </Card>
  );
};

export default SecurityCard;
