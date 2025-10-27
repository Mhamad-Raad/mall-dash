import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const userTypes = [
  { label: 'Admin', value: 'Admin', icon: '👑', color: 'purple' },
  { label: 'Customer', value: 'Customer', icon: '👤', color: 'blue' },
  { label: 'Vendor', value: 'Vendor', icon: '🏪', color: 'green' },
];

interface UserTypeSelectorProps {
  selectedType: string;
  onTypeChange: (type: string) => void;
}

export default function UserTypeSelector({ selectedType, onTypeChange }: UserTypeSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-lg'>User Type</CardTitle>
        <CardDescription>Select the type of user account</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          {userTypes.map((userType) => (
            <button
              key={userType.value}
              onClick={() => onTypeChange(userType.value)}
              className={`p-4 rounded-lg border-2 transition-all text-left hover:shadow-md ${
                selectedType === userType.value
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className='flex flex-col items-center text-center gap-3'>
                <span className='text-4xl'>{userType.icon}</span>
                <div className='space-y-1'>
                  <p className='font-semibold'>{userType.label}</p>
                  <p className='text-xs text-muted-foreground'>
                    {userType.value === 'Admin' && 'Full system access'}
                    {userType.value === 'Customer' && 'Standard user account'}
                    {userType.value === 'Vendor' && 'Business account'}
                  </p>
                </div>
                {selectedType === userType.value && (
                  <Badge variant='default'>
                    Selected
                  </Badge>
                )}
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
