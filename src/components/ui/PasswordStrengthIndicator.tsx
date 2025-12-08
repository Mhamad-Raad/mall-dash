import { Check, X } from 'lucide-react';

interface PasswordRequirement {
  label: string;
  met: boolean;
}

interface PasswordStrengthIndicatorProps {
  password: string;
  className?: string;
}

export function PasswordStrengthIndicator({ password, className = '' }: PasswordStrengthIndicatorProps) {
  const requirements: PasswordRequirement[] = [
    {
      label: 'At least 8 characters',
      met: password.length >= 8,
    },
    {
      label: 'Contains a digit (0-9)',
      met: /\d/.test(password),
    },
    {
      label: 'Contains a lowercase letter (a-z)',
      met: /[a-z]/.test(password),
    },
    {
      label: 'Contains an uppercase letter (A-Z)',
      met: /[A-Z]/.test(password),
    },
  ];

  const allRequirementsMet = requirements.every(req => req.met);
  const metCount = requirements.filter(req => req.met).length;

  const getStrengthColor = () => {
    if (metCount === 0) return 'bg-gray-200 dark:bg-gray-700';
    if (metCount <= 2) return 'bg-red-500';
    if (metCount === 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthText = () => {
    if (metCount === 0) return '';
    if (metCount <= 2) return 'Weak';
    if (metCount === 3) return 'Medium';
    return 'Strong';
  };

  return (
    <div className={className}>
      {/* Strength Bar */}
      {password.length > 0 && (
        <div className='mb-3'>
          <div className='flex items-center justify-between mb-1'>
            <span className='text-xs font-medium text-muted-foreground'>
              Password Strength
            </span>
            <span className={`text-xs font-semibold ${
              metCount <= 2 ? 'text-red-500' : 
              metCount === 3 ? 'text-yellow-500' : 
              'text-green-500'
            }`}>
              {getStrengthText()}
            </span>
          </div>
          <div className='w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden'>
            <div
              className={`h-full transition-all duration-300 ${getStrengthColor()}`}
              style={{ width: `${(metCount / requirements.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Requirements List */}
      <div className='space-y-2'>
        <p className='text-xs font-medium text-muted-foreground mb-2'>
          Password must contain:
        </p>
        {requirements.map((requirement, index) => (
          <div
            key={index}
            className='flex items-center gap-2 text-xs'
          >
            <div className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center transition-colors ${
              requirement.met
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
            }`}>
              {requirement.met ? (
                <Check className='w-3 h-3' />
              ) : (
                <X className='w-3 h-3' />
              )}
            </div>
            <span className={`transition-colors ${
              requirement.met
                ? 'text-green-600 dark:text-green-400 font-medium'
                : 'text-muted-foreground'
            }`}>
              {requirement.label}
            </span>
          </div>
        ))}
      </div>

      {/* Success Message */}
      {allRequirementsMet && password.length > 0 && (
        <div className='mt-3 p-2 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-md'>
          <p className='text-xs text-green-700 dark:text-green-400 font-medium'>
            ✓ Password meets all requirements
          </p>
        </div>
      )}
    </div>
  );
}
