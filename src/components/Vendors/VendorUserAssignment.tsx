import { User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ObjectAutoComplete } from '@/components/ObjectAutoComplete';
import { fetchUsers } from '@/data/Users';

interface VendorUserAssignmentProps {
  userId: string;
  userName: string;
  vendorEmail?: string;
  vendorPhone?: string;
  onUserSelect: (userId: string, userName: string) => void;
}

const VendorUserAssignment = ({
  userId,
  userName,
  vendorEmail,
  vendorPhone,
  onUserSelect,
}: VendorUserAssignmentProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <User className='h-5 w-5' />
          User Assignment
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='space-y-2'>
          <Label htmlFor='userId'>
            Select User <span className='text-destructive'>*</span>
          </Label>
          <ObjectAutoComplete
            fetchOptions={async (query) => {
              const res = await fetchUsers({
                searchTerm: query,
                limit: 10,
                role: 2,
              });
              if (res.error || !res.data) return [];
              return res.data;
            }}
            onSelectOption={(user: any) => {
              if (user) {
                onUserSelect(
                  user._id || user.id,
                  `${user.firstName} ${user.lastName}`
                );
              } else {
                onUserSelect('', '');
              }
            }}
            getOptionLabel={(user: any) =>
              `${user.firstName} ${user.lastName} (${user.email})`
            }
            placeholder='Search for a user by name or email...'
            initialValue={userName}
          />
          {userName && (
            <div className='mt-2 p-3 bg-primary/5 border border-primary/20 rounded-md'>
              <p className='text-sm font-medium text-primary'>
                Selected User: {userName}
              </p>
              <p className='text-xs text-muted-foreground mt-1'>
                User ID: {userId}
              </p>
              {vendorEmail && (
                <p className='text-xs text-muted-foreground mt-1'>
                  Email: {vendorEmail}
                </p>
              )}
              {vendorPhone && (
                <p className='text-xs text-muted-foreground mt-1'>
                  Phone: {vendorPhone}
                </p>
              )}
            </div>
          )}
          <p className='text-xs text-muted-foreground'>
            Search and select the user who will manage this vendor
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default VendorUserAssignment;
